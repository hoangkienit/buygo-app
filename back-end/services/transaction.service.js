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
}

module.exports = TransactionService;