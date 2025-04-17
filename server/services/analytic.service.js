const moment = require("moment");
const Order = require("../models/order.model");

class AnalyticService {
  static async getOrderDailyStatistics() {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    const ordersToday = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const ordersProcessing = ordersToday.filter(
      (order) => order.order_status === "processing"
    );
    const ordersSuccess = ordersToday.filter(
      (order) => order.order_status === "success"
    );
    const ordersFailed = ordersToday.filter(
      (order) => order.order_status === "failed"
    );

    const totalRevenue = ordersSuccess.reduce(
      (total, order) => total + order.order_final_amount,
      0
    );

    return {
      totalOrders: ordersToday.length,
      successOrders: ordersSuccess.length,
      processingOrders: ordersProcessing.length,
      failedOrders: ordersFailed.length,
      totalRevenue,
    };
  }

  static async getOrderWeeklyStatistics() {
    // Get the start and end of the current week
    const startOfWeek = moment().startOf("week").toDate(); // Start of this week (Sunday)
    const endOfWeek = moment().endOf("week").toDate(); // End of this week (Saturday)

    // Find orders within this week
    const ordersThisWeek = await Order.find({
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    });

    // Filter orders based on status
    const ordersProcessing = ordersThisWeek.filter(
      (order) => order.order_status === "processing"
    );
    const ordersSuccess = ordersThisWeek.filter(
      (order) => order.order_status === "success"
    );
    const ordersFailed = ordersThisWeek.filter(
      (order) => order.order_status === "failed"
    );

    // Calculate total revenue for successful orders
    const totalRevenue = ordersSuccess.reduce(
      (total, order) => total + order.order_final_amount,
      0
    );

    return {
      totalOrders: ordersThisWeek.length,
      successOrders: ordersSuccess.length,
      processingOrders: ordersProcessing.length,
      failedOrders: ordersFailed.length,
      totalRevenue,
    };
  }
}

module.exports = AnalyticService;
