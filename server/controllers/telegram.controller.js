const telegram_bot = require("../bot/telegram_bot");
const TelegramService = require("../services/telegram.service");
const logger = require("../utils/logger");

class TelegramController {
  static async setWebhook(req, res) {
    const { url, token } = req.query;

    if (token !== process.env.SET_WEBHOOK_SECRET_TOKEN) {
      logger.error("Someone set webhook with invalid token");
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }
    try {
      await TelegramService.setWebhook(url);

      return res.status(200).json({
        success: true,
        message: "Set webhook success",
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async handleWebhook(req, res) {
    try {
      await telegram_bot.handleUpdate(req.body);
      res.status(200).send("OK");
    } catch (err) {
      logger.error("Telegram Webhook Error:", err);
      res.status(500).send("Webhook handling failed");
    }
  }
}

module.exports = TelegramController;
