const express = require('express');
const { verifyMiddleware } = require('../middlewares/verify.middleware');
const OrderController = require('../controllers/order.controller');
const router = express.Router();


router.post('/create-order', verifyMiddleware, OrderController.createNewOrder);




module.exports = router;