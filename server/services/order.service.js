const Order = require("../models/order.model");
const User = require("../models/user.model");
const logger = require("../utils/logger");
const { generateOrderId, generateTransactionId } = require("../utils/random");
const { Product } = require("./../models/product.model");
const { encrypt, decrypt } = require("../utils/crypto");
const mongoose = require("mongoose");
const { getIO } = require("./socket.service");
const { convertToObjectId } = require("../utils/convert");
const { TransactionHistory } = require("../models/transaction.model");

class OrderService {
  // 🔹 Create a new order
  static async createNewOrder(
    userId,
    productId,
    product_type,
    amount,
    requestId,
    packageId
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (!requestId) throw new Error("Missing requestId");

      // Prevent duplicate orders by requestId
      const existing = await Order.findOne({ requestId }).session(session);
      if (existing) {
        throw new Error("Duplicate request detected");
      }

      // Checking user balance
      const user = await User.findOne({
        _id: convertToObjectId(userId),
      }).session(session);
      if (!user) throw new Error("User not found");

      if (user.balance < amount)
        throw new Error("You don't have enough balance");

      const product = await Product.findOne({ productId: productId })
        .lean()
        .session(session);
      if (!product) {
        throw new Error("Product not found");
      }

      let newOrder = null;
      newOrder = new Order({
        requestId: requestId,
        orderId: generateOrderId(),
        userId: userId,
        productId: product.productId,
        order_type: product.product_type,
        order_amount: amount,
        order_status: "processing",
        order_note: "",
      });
      if (
        product_type === "utility_account" ||
        product_type === "game_account"
      ) {
        // if (product.product_attributes.account.length <= 0) throw new Error("Sản phẩm đã hết hàng");

        const utilAccount = await Product.aggregate([
          { $match: { productId: productId } }, // Match the product by its _id
          { $unwind: "$product_attributes.account" }, // Unwind the packages array to access individual elements
          { $limit: 1 }, // Limit to only the first object in the array
          { $project: { account: "$product_attributes.account" } }, // Project the first package
        ]).session(session);

        const firstAccount = utilAccount[0]?.account;

        //Delete account from stock
        if (firstAccount && !product?.isValuable) {
          await Product.updateOne(
            { productId: productId },
            {
              $pull: {
                "product_attributes.account": { _id: firstAccount._id },
              },
            },
            { session }
          );

          newOrder.order_attributes = {
            username: encrypt(firstAccount.username),
            password: firstAccount.password,
          };

          // Set product status to 0 if there are no accounts
          const updatedProduct = await Product.findOne({ productId }, null, {
            session,
          });

          const accounts = updatedProduct?.product_attributes?.account ?? [];

          if (accounts.length === 0) {
            await Product.updateOne(
              { productId: productId },
              { product_status: "inactive" },
              { session }
            );
          }

          updatedProduct.product_sold_amount += 1;
          await updatedProduct.save({ session });
        } else {
          logger.error("OrderService: no account to delete");
        }
      } else if (product_type === "topup_package") {
        newOrder.order_attributes = {
          packageId: packageId,
        };
      }

      //
      if (
        product_type === "utility_account" ||
        (product_type === "game_account" && !product?.isValuable)
      ) {
        newOrder.order_status = "success";
      } else {
        newOrder.order_status = "processing";
      }

      await newOrder.save({ session });

      user.balance -= amount;
      await user.save({ session });

      // 🔹 Log transaction
      const newTransaction = new TransactionHistory({
        transactionId: generateTransactionId(),
        userId: user?._id,
        amount: amount,
        transactionType: "subtract",
        note: `Bạn đã mua ${product?.product_name}`,
        balance: user.balance,
      });

      await newTransaction.save({ session });

      await session.commitTransaction();
      session.endSession();

      const io = getIO();
      io.to(user._id.toString()).emit("order_success", {
        newBalance: user.balance,
      });

      io.to("admin_room").emit("new_order", {
        type: "orders",
        count: 1,
      });

      if (
        product_type === "utility_account" ||
        (product_type === "game_account" && !product?.isValuable)
      )
        return {
          message: "Create order successful",
          item: {
            username: decrypt(newOrder?.order_attributes?.username),
            password: decrypt(newOrder?.order_attributes?.password),
          },
          orderId: newOrder.orderId,
          isValuable: product?.isValuable,
        };
      return {
        message: "Create order successful",
        orderId: newOrder.orderId,
        item: null,
        isValuable: product?.isValuable,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error("OrderService: " + error);
      throw error;
    }
  }

  static async getAllOrders(userId, limit = 100) {
    const orders = await Order.find({ userId: userId })
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();
    if (!orders) throw new Error("Order not found");

    return {
      message: "Get orders success",
      orders: orders,
    };
  }

  static async getOrder(orderId) {
    const order = await Order.findOne({ orderId }).lean();
    if (!order) throw new Error("Order not found");

    const product = await Product.findOne({
      productId: order.productId,
    }).lean();
    if (!product) throw new Error("Product not found");

    if (
      order.order_type === "utility_account" ||
      (order.order_type === "utility_account" && !product?.isValuable)
    ) {
      const formatOrder = {
        ...order,
        order_attributes: {
          username: decrypt(order.order_attributes.username),
          password: decrypt(order.order_attributes.password),
        },
      };

      return {
        message: "Get order success",
        order: {
          ...formatOrder,
          product,
        },
      };
    }

    return {
      message: "Get order success",
      order: {
        ...order,
        product,
      },
    };
  }

  // For admin
  static async getAllOrdersForAdmin(limit = 50) {
    const orders = await Order.find()
      .populate("userId", "username")
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    return { message: "Get orders successful", orders: orders ? orders : [] };
  }

  static async deleteOrderForAdmin(orderId) {
    const order = await Order.deleteOne({ orderId });

    if (order.deletedCount === 0) {
      throw new Error("Order not found");
    }

    return { message: "Delete order success" };
  }

  static async getOrderForAdmin(orderId) {
    const order = await Order.findOne({ orderId })
      .populate("userId", "username profileImg")
      .lean();

    if (!order) throw new Error("Order not found");

    const product = await Product.findOne({
      productId: order.productId,
    }).lean();
    if (!product) throw new Error("Product not found");

    if (
      (order.order_type === "utility_account" ||
        order.order_type === "game_account") &&
      !product?.isValuable
    ) {
      const formatOrder = {
        ...order,
        order_attributes: {
          username: decrypt(order.order_attributes.username),
          password: decrypt(order.order_attributes.password),
        },
      };

      return {
        message: "Get order success",
        order: {
          ...formatOrder,
          product,
        },
      };
    }

    return {
      message: "Get order success",
      order: {
        ...order,
        product,
      },
    };
  }

  static async markAsSuccessForAdmin(orderId, authorId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findOne({ orderId }).session(session);
      if (!order) throw new Error("Order not found");

      const product = await Product.findOne({
        productId: order.productId,
      }).session(session);
      if (!product) throw new Error("Product not found");

      const author = await User.findOne(
        { _id: convertToObjectId(authorId) },
        { username: 1, _id: 0 } // only return username
      ).lean();
      if (!author) throw new Error("Author not found");

      order.processed_by = author?.username;
      order.order_status = "success";
      product.product_sold_amount += 1; //Increase sold amount to 1

      await order.save({ session });
      await product.save({ session });

      await session.commitTransaction();
      session.endSession();

      const io = getIO();
      io.to(order?.userId.toString()).emit("markAsSuccess", {
        order_status: "success",
      });

      return {
        message: "Mark order successfully",
        order_status: order.order_status,
        processed_by: order.processed_by,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error("OrderService: " + error);
      throw error;
    }
  }

  static async markAsFailedForAdmin(orderId, authorId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findOne({ orderId }).session(session);
      if (!order) throw new Error("Order not found");

      const user = await User.findOne({_id: convertToObjectId(order?.userId) }).session(
        session
      );
      if (!user) throw new Error("User not found");

      const author = await User.findOne(
        { _id: convertToObjectId(authorId) },
        { username: 1, _id: 0 } // only return username
      ).lean();
      if (!author) throw new Error("Author not found");

      order.processed_by = author?.username;
      order.order_status = "failed";
      user.balance += order?.order_amount;

      // 🔹 Log transaction
      const newTransaction = new TransactionHistory({
        transactionId: generateTransactionId(),
        userId: user?._id,
        amount: order.order_amount,
        transactionType: "add",
        note: "Đơn hàng đã bị hủy",
        balance: user?.balance,
      });

      await newTransaction.save({ session });
      await user.save({ session });
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      const io = getIO();
      io.to(user._id.toString()).emit("markAsFailed", {
          newBalance: user.balance,
          order_status: order?.order_status
      });

      return {
        message: "Mark order failed success",
        order_status: order?.order_status,
        processed_by: order.processed_by,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error("OrderService: " + error);
      throw error;
    }
  }
}

module.exports = OrderService;
