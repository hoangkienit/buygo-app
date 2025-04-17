const { Telegraf } = require('telegraf');
const TelegramService = require('../services/telegram.service');
require('dotenv').config();

const telegram_bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

telegram_bot.on('new_chat_members', (ctx) => {
  ctx.message.new_chat_members.forEach((member) => {
    ctx.reply(`👋 Chào mừng ${member.first_name || 'người chơi'} đến với nhóm!`);
  });
});
telegram_bot.start((ctx) => ctx.reply('Chào bạn! Đây là bot hỗ trợ nạp game.'));
telegram_bot.command('help', (ctx) => ctx.reply('Các lệnh: /nap /info'));
telegram_bot.command('info', (ctx) => ctx.reply('Tôi giúp bạn nhận thông báo đơn hàng nạp game.'));

telegram_bot.command('daily_stats', async () => {
  await TelegramService.sendOrderDailyStatistics();
});

telegram_bot.command('weekly_stats', async () => {
  await TelegramService.sendOrderWeeklyStatistics();
});



module.exports = telegram_bot;
