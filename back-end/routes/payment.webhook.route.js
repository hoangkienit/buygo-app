const express = require('express');
const { verifyMiddleware } = require('../middlewares/verify.middleware');
const PaymentWebhookController = require('../controllers/payment.webhook.controller');

const router = express.Router();

router.post('/check-payment/callback', PaymentWebhookController.checkPaymentAndUpdateBalance);
router.post("/test", (req, res) => {
  res.json({ success: true, message: "Test route is working!" });
});

module.exports = router;