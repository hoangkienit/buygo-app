const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware, checkBanned } = require('../middlewares/verify.middleware');
const DiscountController = require('../controllers/discount.controller');

const router = express.Router();

// For client
router.post('/apply-discount', verifyMiddleware, checkBanned, DiscountController.validateDiscount);

// For Admin
router.post('/create-discount', verifyMiddleware, verifyAdminMiddleware, DiscountController.createDiscountForAdmin);

router.get('/all-discounts', verifyMiddleware, verifyAdminMiddleware, DiscountController.getAllDiscountsForAdmin);

router.get('/get-discount/:discountId', verifyMiddleware, verifyAdminMiddleware, DiscountController.getDiscount);


module.exports = router;