const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware } = require('../middlewares/verify.middleware');
const OrderController = require('../controllers/order.controller');
const router = express.Router();


router.post('/create-order', verifyMiddleware, OrderController.createNewOrder);

router.get('/get-order/:orderId', verifyMiddleware, OrderController.getOrder);

router.get('/all-orders', verifyMiddleware, OrderController.getAllOrders);

// For admin
router.get('/admin/orders', verifyMiddleware, verifyAdminMiddleware, OrderController.getAllOrdersForAdmin);

router.get('/admin/get-order/:orderId', verifyMiddleware, verifyAdminMiddleware, OrderController.getOrderForAdmin);

router.delete('/admin/delete-order/:orderId', verifyMiddleware, verifyAdminMiddleware, OrderController.deleteOrderForAdmin); 

router.patch('/admin/mark-as-success/:orderId', verifyMiddleware, verifyAdminMiddleware, OrderController.markAsSuccessForAdmin); 

router.patch('/admin/mark-as-failed/:orderId', verifyMiddleware, verifyAdminMiddleware, OrderController.markAsFailedForAdmin); 


module.exports = router;