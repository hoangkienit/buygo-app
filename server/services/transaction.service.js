const User = require("../models/user.model");
const {DepositHistory, TransactionHistory} = require("../models/transaction.model");
const { convertToObjectId } = require("../utils/convert");
const { generateTransactionId } = require("../utils/random");

class TransactionService {
  // 🔹 Create new transaction
    static async createTransaction(userId, amount, paymentMethod, gateway) {       
        const user = await User.findOne({ _id: convertToObjectId(userId) });
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        const transaction = new DepositHistory({
            transactionId: generateTransactionId(),
            userId,
            amount,
            paymentMethod,
            gateway,
            status: "pending",
        });

        await transaction.save();

    return {
        message: "Create transaction successfully",
        transactionId: transaction.transactionId,
    };
    }
    
    // 🔹 Get transaction
    static async getTransaction(transactionId) {       
        const transaction = await DepositHistory.findOne({ transactionId });
        if (!transaction) {
            throw new Error("Transaction not found");
        }

        return {
            transaction: transaction
    };
    }

    // 🔹 Get transaction list
    static async getDepositHistoryList(userId, limit = 50) {  
        try {
            const transactions = await DepositHistory.find({ userId: convertToObjectId(userId) })// Find transactions by userId
                .limit(limit) // Limit the number of transactions returned
                .sort({ createdAt: -1 }) // Sort by most recent transactions
                .lean();

        if (!transactions || transactions.length === 0) {
            return { transactions: [] };
        }
        return { transactions };
        } catch (error) {
            throw new Error("Cant get transaction list. System error");
        }
    }

    static async getTransactionHistoryList(userId, limit = 50) {  
        try {
            const transactions = await TransactionHistory.find({ userId: convertToObjectId(userId) })// Find transactions by userId
                .limit(limit) // Limit the number of transactions returned
                .sort({ createdAt: -1 }) // Sort by most recent transactions
                .lean();

        if (!transactions || transactions.length === 0) {
            return { transactions: [] };
        }
        return { transactions };
        } catch (error) {
            throw new Error("Cant get transaction list. System error");
        }
    }

    // 🔹 Cancel transaction
    static async cancelTransaction(transactionId) {       
        const transaction = await DepositHistory.findOneAndUpdate(
            { transactionId: transactionId },
            { transactionStatus: "failed" },
            { new: true }
        );
        if (!transaction) {
            throw new Error("Transaction not found");
        }

    return {
        message: "Update transaction status successfully",
    };
    }

    // For admin
    // 🔹 Get transaction list
    static async getTransactionListForAdmin(limit = 50) {  
        try {
            const transactions = await DepositHistory.find()// Find transactions
                .limit(limit) // Limit the number of transactions returned
                .populate("userId", "username")
                .sort({ createdAt: -1 }) // Sort by most recent transactions
                .lean();

            if (!transactions || transactions.length === 0) {
                return { transactions: [] };
            }

            return { transactions };
        } catch (error) {
            throw new Error("Cant get transaction list. System error");
        }
    }

    static async deleteTransactionForAdmin(transactionId) {
        const transaction = await DepositHistory.deleteOne({ transactionId });

        if (transaction.deletedCount === 0) {
            throw new Error("Transaction not found");
        }
        
        return {
            message: "Delete transaction successfully"
        }
    }
}

module.exports = TransactionService;