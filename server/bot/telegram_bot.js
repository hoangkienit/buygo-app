const { Telegraf } = require("telegraf");
const TelegramService = require("../services/telegram.service");
const { getUserTextAfterCommand } = require("../utils/text");
const OrderService = require("../services/order.service");
require("dotenv").config();

const telegram_bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

telegram_bot.on("new_chat_members", (ctx) => {
  ctx.message.new_chat_members.forEach((member) => {
    ctx.reply(
      `👋 Chào mừng ${member.first_name || "người chơi"} đến với nhóm!`
    );
  });
});
telegram_bot.start((ctx) =>
  ctx.reply(
    "Chào bạn! Đây là bot hỗ trợ thông báo được phát triển bởi Hoangkiendev."
  )
);
telegram_bot.command("info", (ctx) =>
  ctx.reply("Đây là bot hỗ trợ thông báo được phát triển bởi Hoangkiendev.")
);
telegram_bot.command("help", (ctx) => ctx.reply("Các lệnh: /nap /info"));

// Stats
telegram_bot.command("daily_stats", async () => {
  await TelegramService.sendOrderDailyStatistics();
});

telegram_bot.command("weekly_stats", async () => {
  await TelegramService.sendOrderWeeklyStatistics();
});

// Order
telegram_bot.command("confirm", async (ctx) => {
  try {
    const orderId = getUserTextAfterCommand(ctx);
    await OrderService.markAsSuccessForAdmin(
      orderId,
      null,
      ctx.message.from.username
    );
    await TelegramService.sendMessage(
      ctx.message.chat.id,
      `Đã hoàn thành đơn hàng #${orderId}`
    );
  } catch (error) {
    ctx.reply(error.message);
  }
});

telegram_bot.command("cancel", async (ctx) => {
  try {
    const orderId = getUserTextAfterCommand(ctx);
    await OrderService.markAsFailedForAdmin(
      orderId,
      null,
      ctx.message.from.username
    );
    await TelegramService.sendMessage(
      ctx.message.chat.id,
      `Đã hủy đơn hàng #${orderId}`
    );
  } catch (error) {
    ctx.reply(error.message);
  }
});

module.exports = telegram_bot;
