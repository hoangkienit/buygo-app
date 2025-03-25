const express = require('express');
const { verifyMiddleware } = require('../middlewares/verify.middleware');
const PaymentController = require('../controllers/payment.controller');

const router = express.Router();

router.post('/check-payment/callback', PaymentController.checkPaymentAndUpdateBalance);


module.exports = router;