const PaymentService = require('../services/payment.service');
const { validateWebhookDescription } = require('./../utils/validation');

class PaymentController {
  // 🔹 Webhook Callback
    static async checkPaymentAndUpdateBalance(req, res) {
        const key = req.headers.authorization || '';
        const attachKey = key.startsWith('Apikey ') ? key.replace('Apikey ', '') : null;

        const { gateway, description, transferAmount } = req.body;
        if (!gateway || !description || !transferAmount) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
      
        const errors = validateWebhookDescription(description);
        if (errors && errors.length > 0) {
          return res.status(400).json({ success: false, message: errors[0].message });
        }
      
      // ✅ Validate
      if (attachKey != process.env.SEPAY_WEBHOOK_PRIVATE_KEY) {
        return res.status(401).json({ success: false, message: "Unauthorized user" });
      }

    try {
        const response = await PaymentService.updateUserBalance(gateway, description, transferAmount);
        return res.status(200).json({ success: true, message: response.message, data: null });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = PaymentController;