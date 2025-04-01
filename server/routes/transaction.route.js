const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware } = require('../middlewares/verify.middleware');
const TransactionController = require('../controllers/transaction.controller');

const router = express.Router();


router.get('/get-transaction/transactions', verifyMiddleware, TransactionController.getTransactionList);

router.get('/get-transaction/:transactionId', verifyMiddleware, TransactionController.getTransaction);

router.put('/cancel-transaction/:transactionId', verifyMiddleware, TransactionController.cancelTransaction);

router.post('/create-transaction', verifyMiddleware, TransactionController.createTransaction);

// For admin
router.get('/admin/get-transaction/transactions', verifyMiddleware, verifyAdminMiddleware, TransactionController.getTransactionListForAdmin);

router.post('/admin/delete-transaction/:transactionId', verifyMiddleware, verifyAdminMiddleware, TransactionController.deleteTransactionForAdmin);


module.exports = router;