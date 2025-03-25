const express = require('express');
const { verifyMiddleware } = require('../middlewares/verify.middleware');
const TransactionController = require('../controllers/transaction.controller');

const router = express.Router();


router.get('/:transactionId', verifyMiddleware, TransactionController.getTransaction);
router.post('/create-transaction', verifyMiddleware, TransactionController.createTransaction);


module.exports = router;