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
const DiscountService = require("./discount.service");
const Discount = require("../models/discount.model");

class OrderService {
  // 🔹 Create a new order
  static async createNewOrder(
    coupon, 
  userId,
  productId,
  product_type,
  _amountFromClient,
  requestId,
  packageId
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!requestId) throw new Error("Missing requestId");

    const existing = await Order.findOne({ requestId }).session(session);
    if (existing) throw new Error("Duplicate request detected");

    const user = await User.findOne({
      _id: convertToObjectId(userId),
    }).session(session);
    if (!user) throw new Error("User not found");

    const product = await Product.findOne({ productId }).lean().session(session);
    if (!product) throw new Error("Product not found");

    // Take amount from product 
    let base_amount = 0;
    let discountCode = '';
    let discountAmount = 0;
    let finalTotal = base_amount;
    
    if (product_type === "topup_package") {
      const selectedPackage = product.product_attributes?.packages?.find(
        (pkg) => pkg._id.toString() === packageId
      );
      
      if (!selectedPackage) throw new Error("Invalid packageId");
      base_amount = selectedPackage.price;
      
    } else {
      base_amount = product.product_attributes?.price;
    }

    // Checking discount and apply
    if (coupon || coupon !== "") {
      const {
        discountAmount: amount,
        finalTotal: final,
        discountCode: code,
        discountId
      } = await DiscountService.validateDiscount(coupon, base_amount);

      discountCode = code;
      discountAmount = amount;
      finalTotal = final;
      
      // Increase discount usage to 1
      await Discount.findByIdAndUpdate(
        { _id: discountId },
        { $inc: { usedCount: 1 } }
      );
    } else {
      discountAmount = 0;
      finalTotal = base_amount;
      discountCode = '';
    }

    if (user.balance < finalTotal) throw new Error("Bạn không đủ số dư");
    
    let newOrder = new Order({
      requestId: requestId,
      orderId: generateOrderId(),
      userId: userId,
      productId: product.productId,
      order_type: product.product_type,
      order_base_amount: base_amount,
      order_discount_amount: discountAmount,
      order_final_amount: finalTotal,
      discountCode: discountCode,
      order_status: "processing",
      order_note: "",
    });

    if (
      product_type === "utility_account" ||
      product_type === "game_account"
    ) {
      const utilAccount = await Product.aggregate([
        { $match: { productId: productId } },
        { $unwind: "$product_attributes.account" },
        { $limit: 1 },
        { $project: { account: "$product_attributes.account" } },
      ]).session(session);

      const firstAccount = utilAccount[0]?.account;

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

    if (
      product_type === "utility_account" ||
      (product_type === "game_account" && !product?.isValuable)
    ) {
      newOrder.order_status = "success";
    } else {
      newOrder.order_status = "processing";
    }

    await newOrder.save({ session });

    user.balance -= newOrder?.order_final_amount;
    await user.save({ session });

    const newTransaction = new TransactionHistory({
      transactionId: generateTransactionId(),
      userId: user?._id,
      amount: newOrder?.order_final_amount,
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
  static async getAllOrdersForAdmin(limit = 10, page = 1) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find().populate("userId", "username").skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Order.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      message: "Get orders successful",
      orders: orders ? orders : [],
      page: page,
      limit: limit,
      total: total,
      totalPages: totalPages
    };
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

      await Promise.all([
        order.save({ session }),
        product.save({ session })
      ]);

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
      user.balance += order?.order_base_amount;

      // 🔹 Log transaction
      const newTransaction = new TransactionHistory({
        transactionId: generateTransactionId(),
        userId: user?._id,
        amount: order.order_base_amount,
        transactionType: "add",
        note: "Đơn hàng đã bị hủy",
        balance: user?.balance,
      });

      await Promise.all([
        newTransaction.save({ session }),
        user.save({ session }),
        order.save({ session })
      ])

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
