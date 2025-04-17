const logger = require("../utils/logger");
const axiosInstance = require("./../lib/axiosInstance");
const AnalyticService = require("./analytic.service");

class TelegramService {
  static async sendMessage(chatId, message) {
    try {
      await axiosInstance.post("/sendMessage", {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async setWebhook(newWebhookUrl) {
    return await axiosInstance.get(`/setWebhook?url=${newWebhookUrl}`);
  }

  static async sendOrderDailyStatistics() {
    try {
      const stats = await AnalyticService.getOrderDailyStatistics();

      const statisticsMessage = `
  🌟 <b>Thống kê hôm nay - Cập nhật đơn hàng</b> 📊

  <b>Số đơn hàng hôm nay:</b> ${stats.totalOrders} đơn
  <b>Đơn hàng đang chờ:</b> ${stats.processingOrders} đơn
  <b>Đơn hàng đã xử lý:</b> ${stats.successOrders} đơn
  <b>Đơn hàng đã hủy:</b> ${stats.failedOrders} đơn

  💰 <b>Tổng doanh thu:</b> ${stats.totalRevenue.toLocaleString()}đ`;

      await this.sendMessage(process.env.TELEGRAM_CHAT_ID, statisticsMessage);
    } catch (error) {
      logger.error(error);
    }
  }

  static async sendOrderWeeklyStatistics() {
    try {
      const stats = await AnalyticService.getOrderWeeklyStatistics();

      const statisticsMessage = `
  🌟 <b>Thống kê một tuần - Cập nhật đơn hàng</b> 📊

  <b>Số đơn hàng:</b> ${stats.totalOrders} đơn
  <b>Đơn hàng đang chờ:</b> ${stats.processingOrders} đơn
  <b>Đơn hàng đã xử lý:</b> ${stats.successOrders} đơn
  <b>Đơn hàng đã hủy:</b> ${stats.failedOrders} đơn

  💰 <b>Tổng doanh thu:</b> ${stats.totalRevenue.toLocaleString()}đ`;

      await this.sendMessage(process.env.TELEGRAM_CHAT_ID, statisticsMessage);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = TelegramService;
