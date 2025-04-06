const TransactionService = require('../services/transaction.service');
const logger = require('../utils/logger');
const { validateTransaction, validateId } = require('../utils/validation');

class TransactionController {
  // 🔹 Create new transaction
    static async createTransaction(req, res) {
        const { amount, paymentMethod, gateway } = req.body;
        const userId = req.user.id;
        console.log("UserId:"+userId);
        const errors = validateTransaction(req.body);
            if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, message: errors[0].message });
            }
      
        try {
            const response = await TransactionService.createTransaction(userId, amount, paymentMethod, gateway);

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    transactionId: response.transactionId
                }
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // 🔹 Get single transaction
    static async getTransaction(req, res) {
        const transactionId = req.params.transactionId;
        const errors = validateId(transactionId);
            if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, message: errors[0].message });
            }
      
        try {
            const response = await TransactionService.getTransaction(transactionId);

            return res.status(200).json({
                success: true,
                message: "Get transaction successfully",
                data: {
                    transaction: response.transaction
                }
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // 🔹 Get transaction list
    static async getDepositHistoryList(req, res) {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit) || 50;
        try {
            const response = await TransactionService.getDepositHistoryList(userId, limit);

            return res.status(200).json({
                success: true,
                message: "Get transaction list successfully",
                data: {
                    transactions: response.transactions
                }
            });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getTransactionHistoryList(req, res) {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit) || 50;
        try {
            const response = await TransactionService.getTransactionHistoryList(userId, limit);

            return res.status(200).json({
                success: true,
                message: "Get transaction list successfully",
                data: {
                    transactions: response.transactions
                }
            });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // 🔹 Cancel transaction
    static async cancelTransaction(req, res) {
        const { transactionId } = req.params;
    
        const errors = validateId(transactionId);
            if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, message: errors[0].message });
            }
      
        try {
            const response = await TransactionService.cancelTransaction(transactionId);

            return res.status(200).json({
                success: true,
                message: response.message,
                data: null
            });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // For admin
    // 🔹 Get transaction list
    static async getTransactionListForAdmin(req, res) {
        const limit = parseInt(req.query.limit) || 20;
        try {
            const response = await TransactionService.getTransactionListForAdmin(limit);

            return res.status(200).json({
                success: true,
                message: "Get transaction list successfully",
                data: {
                    transactions: response.transactions
                }
            });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async deleteTransactionForAdmin(req, res) {
        const { transactionId } = req.params;

        const errors = validateId(transactionId);
        if (errors && errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors[0].message
            });
        }

        try {
            const response = await TransactionService.deleteTransactionForAdmin(transactionId);
            
            return res.status(200).json({
                success: true,
                message: response.message
            })
        } catch (error) {
            logger.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = TransactionController;
