const axiosInstance = require('./../lib/axiosInstance');

class TelegramService {
    static async sendMessage(chatId, message) {
        try {
            await axiosInstance.post('/sendMessage', {
                chat_id: chatId,
                text: message
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async setWebhook(newWebhookUrl) {
        return await axiosInstance.get(`/setWebhook?url=${newWebhookUrl}`);
    }
}

module.exports = TelegramService;