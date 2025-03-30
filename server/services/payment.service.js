const { getIO } = require("./socket.service");
const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const { convertToObjectId } = require("../utils/convert");
const { splitString } = require("../utils/text");


class PaymentService {
  // 🔹 Add user balance
    static async updateUserBalance(gateway, description, transferAmount) {
        let userId = '';
        let transactionId = '';
        
        const splittedString = splitString(description);
        userId = splittedString[2];
        transactionId = splittedString[1];

        const user = await User.findOne({ _id: convertToObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        // Update user balance
        user.balance += transferAmount;
        await user.save();
        const newBalance = user.balance;

        // Update transaction status
        // 🔹 Find and update
        const transaction = await Transaction.findOneAndUpdate(
            { transactionId: transactionId, userId: convertToObjectId(userId), transactionStatus: "pending" }, 
            { transactionStatus: "success", updatedAt: new Date(), gateway: gateway },
            { new: true }
        );

        if (!transaction) {
            throw new Error("Không tìm thấy giao dịch hợp lệ");
        }

        // Write to log

        // Notify the client via WebSocket
        getIO().to(userId).emit("recharge_success", { userId, newBalance, gateway, transferAmount });

    return {
        message: "Recharge successfully"
    };
  }
}

module.exports = PaymentService;