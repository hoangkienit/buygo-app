const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware, checkBanned } = require('../middlewares/verify.middleware');
const TransactionController = require('../controllers/transaction.controller');

const router = express.Router();

// For client
router.get('/deposit-history', verifyMiddleware, checkBanned, TransactionController.getDepositHistoryList);
router.get('/transaction-history', verifyMiddleware, checkBanned, TransactionController.getTransactionHistoryList);

router.get('/get-transaction/:transactionId', verifyMiddleware, checkBanned, TransactionController.getTransaction);

router.put('/cancel-transaction/:transactionId', verifyMiddleware, checkBanned, TransactionController.cancelTransaction);

router.post('/create-transaction', verifyMiddleware, checkBanned, TransactionController.createTransaction);

// For admin
router.get('/admin/get-transaction/transactions', verifyMiddleware, verifyAdminMiddleware, TransactionController.getTransactionListForAdmin);

router.post('/admin/delete-transaction/:transactionId', verifyMiddleware, verifyAdminMiddleware, TransactionController.deleteTransactionForAdmin);


module.exports = router;