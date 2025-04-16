const OrderService = require("../services/order.service");
const logger = require("../utils/logger");
const { validateId } = require("../utils/validation");

class OrderController {
  // 🔹 Create New Order
  static async createNewOrder(req, res) {
    const userId = req.user.id;
    const {
      discountCode,
      productId,
      product_type,
      amount,
      requestId,
      packageId = null,
    } = req.body;

    //TODO: validate

    try {
      const response = await OrderService.createNewOrder(
        discountCode, 
        userId,
        productId,
        product_type,
        amount,
        requestId,
        packageId
      );

      return res.status(201).json({
        success: true,
        message: response.message,
        orderId: response.orderId,
        item: response.item,
        isValuable: response.isValuable,
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAllOrdersForAdmin(req, res) {
    try {
      const limit = parseInt(req.query.limit);
      const page = parseInt(req.query.page);

      const response = await OrderService.getAllOrdersForAdmin(limit, page);

      return res.status(200).json({
        success: true,
        message: response.message,
        data: {
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
          page: response.page,
          orders: response.orders,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteOrderForAdmin(req, res) {
    const { orderId } = req.params;

    try {
      const response = await OrderService.deleteOrderForAdmin(orderId);

      return res.status(200).json({
        success: true,
        message: response.message,
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getOrderForAdmin(req, res) {
    const { orderId } = req.params;

    const errors = validateId(orderId);
    if (errors && errors.length > 0)
      return res
        .status(400)
        .json({ success: false, message: errors[0].message });

    try {
      const response = await OrderService.getOrderForAdmin(orderId);

      return res.status(200).json({
        success: true,
        message: response.message,
        data: {
          order: response.order,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getOrder(req, res) {
    const { orderId } = req.params;

    const errors = validateId(orderId);
    if (errors && errors.length > 0)
      return res
        .status(400)
        .json({ success: false, message: errors[0].message });

    try {
      const response = await OrderService.getOrder(orderId);

      return res.status(200).json({
        success: true,
        message: response.message,
        data: {
          order: response.order,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAllOrders(req, res) {
    const userId = req.user?.id;
    const { limit } = parseInt(req.query.limit);

    // const errors = validateId(orderId);
    // if (errors && errors.length > 0) return res.status(400).json({ success: false, message: errors[0].message });

    try {
      const response = await OrderService.getAllOrders(userId, limit);

      return res.status(200).json({
        success: true,
        message: response.message,
        data: {
          orders: response.orders,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async markAsSuccessForAdmin(req, res) {
    const { orderId } = req.params;
    const { authorId } = req.query;

    try {
      const response = await OrderService.markAsSuccessForAdmin(
        orderId,
        authorId
      );

      return res.status(200).json({
        success: true,
        message: response.message,
        data: {
          order_status: response.order_status,
          processed_by: response.processed_by,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async markAsFailedForAdmin(req, res) {
    const { orderId } = req.params;
    const { authorId } = req.query;

    try {
      const response = await OrderService.markAsFailedForAdmin(
        orderId,
        authorId
      );

      return res.status(200).json({
        success: true,
        message: response.message,
        data: {
          order_status: response.order_status,
          processed_by: response.processed_by,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = OrderController;
