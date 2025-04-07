const Order = require('../models/order.model');
const logger = require('../utils/logger');
const { generateOrderId } = require('../utils/random');
const { Product } = require('./../models/product.model');
const { encrypt, decrypt } = require('../utils/crypto');
const mongoose = require('mongoose');

class OrderService {
  // 🔹 Create a new order
    static async createNewOrder(userId, productId, product_type, amount, requestId, packageId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (!requestId) throw new Error("Missing requestId");

            // Prevent duplicate orders by requestId
            const existing = await Order.findOne({ requestId }).session(session);
            if (existing) {
                throw new Error("Duplicate request detected");
            
            }
            const product = await Product.findOne({productId: productId}).lean().session(session);
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
                    order_note: '',
                });
            if (product_type === 'utility_account') {
                if (product.product_attributes.account.length <= 0) throw new Error("Sản phẩm đã hết hàng");

                const utilAccount = await Product.aggregate([
                    { $match: { productId: productId } }, // Match the product by its _id
                    { $unwind: "$product_attributes.account" }, // Unwind the packages array to access individual elements
                    { $limit: 1 }, // Limit to only the first object in the array
                    { $project: { account: "$product_attributes.account" } } // Project the first package
                ]).session(session);

                const firstAccount = utilAccount[0]?.account;
                
                //Delete account from stock
                if (firstAccount) {
                    await Product.updateOne(
                        { productId: productId },
                        { $pull: { "product_attributes.account": { _id: firstAccount._id } } },
                        { session }
                    );
                } else {
                    logger.error("OrderService: no account to delete");
                }


                newOrder.order_attributes = {
                        username: encrypt(firstAccount.username),
                        password: firstAccount.password
                }
                

            } else if(product_type === 'topup_package') {
                newOrder.order_attributes = {
                    packageId: packageId
                }
            }
        
            await newOrder.save({ session });

            //TODO: subtract user balance

            await session.commitTransaction();
            session.endSession();

            if (product_type === 'utility_account') return {
                message: "Create order successful",
                item: {
                    username: decrypt(newOrder?.order_attributes?.username),
                    password: decrypt(newOrder?.order_attributes?.password)
                },
                orderId: newOrder.orderId
            }
            return {
                message: "Create order successful",
                orderId: newOrder.orderId,
                item: null
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            logger.error("OrderService: "+error);
            throw error;
        }
    }

    // For admin
    static async getAllOrdersForAdmin(limit = 50) {
        const orders = await Order.find()
            .populate("userId", "username")
            .limit(Number(limit))
            .sort({ createAt: -1 })
            .lean();
        
        return {message: 'Get orders successful', orders: orders ? orders : []}
    }

    static async deleteOrderForAdmin(orderId) {
        const order = await Order.deleteOne({ orderId });

        if (order.deletedCount === 0) {
            throw new Error("Order not found");
        }

        return {message: "Delete order success"}
    }
}

module.exports = OrderService;
