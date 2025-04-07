const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware } = require('../middlewares/verify.middleware');
const OrderController = require('../controllers/order.controller');
const router = express.Router();


router.post('/create-order', verifyMiddleware, OrderController.createNewOrder);

// For admin
router.get('/admin/orders', verifyMiddleware, verifyAdminMiddleware, OrderController.getAllOrdersForAdmin);

router.delete('/admin/delete-order/:orderId', verifyMiddleware, verifyAdminMiddleware, OrderController.deleteOrderForAdmin); 




module.exports = router;