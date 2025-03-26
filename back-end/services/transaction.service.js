const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const { convertToObjectId } = require("../utils/convert");
const { generateTransactionId } = require("../utils/random");

class TransactionService {
  // 🔹 Create new transaction
    static async createTransaction(userId, amount, paymentMethod, gateway) {       
        const user = await User.findOne({ _id: convertToObjectId(userId) });
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        const transaction = new Transaction({
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
        const transaction = await Transaction.findOne({ transactionId });
        if (!transaction) {
            throw new Error("Transaction not found");
        }

        return {
            transaction: transaction
    };
    }

    // 🔹 Get transaction list
    static async getTransactionList(userId, limit = 20) {  
        try {
            const transactions = await Transaction.find({ userId: convertToObjectId(userId) }) // Find transactions by userId
            .limit(limit) // Limit the number of transactions returned
            .sort({ createdAt: -1 }) // Sort by most recent transactions
            .exec();

        if (!transactions || transactions.length === 0) {
            return { transactions: [] };
        }

        return { transactions };
        } catch (error) {
            console.log(error);
        }
    }

    // 🔹 Cancel transaction
    static async cancelTransaction(transactionId) {       
        const transaction = await Transaction.findOneAndUpdate(
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
}

module.exports = TransactionService;