const OrderService = require("../services/order.service");
const logger = require("../utils/logger");

class OrderController {
  // 🔹 Create New Order
    static async createNewOrder(req, res) {
        const userId = req.user.id;
        const { productId, product_type, amount } = req.body;

        // ✅ Validate input
        // const errors = validateRegister(req.body);
        //   if (errors && errors.length > 0) {
        //   return res.status(400).json({ success: false, message: errors[0].message });
        // }

    try {
        const response = await OrderService.createNewOrder(userId, productId, product_type, amount);
        console.log(response)
        return res.status(201).json({
            success: true,
            message: response.message,
            orderId: response.orderId,
            item: response.item
        });

    } catch (error) {
        logger.error(error);
        return res.status(400).json({ success: false, message: error.message });
    }
  }

}

module.exports = OrderController;
