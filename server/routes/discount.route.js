const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware, checkBanned } = require('../middlewares/verify.middleware');
const DiscountController = require('../controllers/discount.controller');

const router = express.Router();

// For client
router.post('/apply-discount', DiscountController.validateDiscount);

// For Admin
router.post('/create-discount', DiscountController.createDiscountForAdmin);


module.exports = router;