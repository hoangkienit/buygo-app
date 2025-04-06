const Order = require('../models/order.model');
const logger = require('../utils/logger');
const { generateOrderId } = require('../utils/random');
const { Product } = require('./../models/product.model');
const { encrypt, decrypt } = require('../utils/crypto');

class OrderService {
  // 🔹 Create a new order
    static async createNewOrder(userId, productId, product_type, amount) {
        const product = await Product.findOne({productId: productId}).lean();
        if (!product) {
            throw new Error("Product not found");
        }
    

        let newOrder = null;
        if (product_type === 'utility_account') {
            if (product.product_attributes.account.length <= 0) throw new Error("Sản phẩm đã hết hàng");

            const utilAccount = await Product.aggregate([
                { $match: { productId: productId } }, // Match the product by its _id
                { $unwind: "$product_attributes.account" }, // Unwind the packages array to access individual elements
                { $limit: 1 }, // Limit to only the first object in the array
                { $project: { account: "$product_attributes.account" } } // Project the first package
            ]);

        const firstAccount = utilAccount[0]?.account;
        // if (firstAccount) {
        //     await Product.updateOne(
        //         { productId: productId },
        //         { $pull: { "product_attributes.account": { _id: firstAccount._id } } }
        //     );
        // } else {
        //     logger.error("OrderService: no account to delete");
        // }


        // Create order
            newOrder = new Order({
                orderId: generateOrderId(),
                userId: userId,
                productId: product._id,
                order_type: product.product_type,
                order_amount: amount,
                order_status: "pending",
                order_note: '',
                order_attributes: {
                    username: encrypt(firstAccount.username),
                    password: firstAccount.password
                }
            });

        } else {
            newOrder = new Order({
                orderId: generateOrderId(),
                userId: userId,
                productId: product._id,
                order_type: product.product_type,
                order_amount: amount,
                order_status: "pending",
                order_note: ''
            })
        }
        
        await newOrder.save();

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
    }
}

module.exports = OrderService;
