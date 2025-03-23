const PaymentService = require('./../services/payment.service');

class PaymentWebhookController {
  // 🔹 Webhook Callback
    static async checkPaymentAndUpdateBalance(req, res) {
        console.log("webhook calling");
        const key = req.headers.authorization || '';
        const attachKey = key.startsWith('Apikey ') ? key.replace('Apikey ', '') : null;

        const { gateway, transactionDate, description, transferAmount } = req.body;
        if (!gateway || !transactionDate || !description || !transferAmount) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
      
    // ✅ Validate
    if (attachKey != process.env.SEPAY_WEBHOOK_PRIVATE_KEY) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    try {
        const response = await PaymentService.updateUserBalance(gateway, transactionDate, description, transferAmount);
        return res.status(200).json({ success: true, message: response.message, data: null });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = PaymentWebhookController;