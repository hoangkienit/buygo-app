const { getIO } = require("./socket.service");
const User = require("../models/user.model");
const {
  DepositHistory,
  TransactionHistory,
} = require("../models/transaction.model");
const { convertToObjectId } = require("../utils/convert");
const { splitString } = require("../utils/text");
const { generateTransactionId } = require("../utils/random");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

class PaymentService {
  static async updateUserBalance(gateway, description, transferAmount) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 🔹 Extract userId and transactionId from description
      const [, transactionId, userIdRaw] = splitString(description);
      const userId = convertToObjectId(userIdRaw);

      // 🔹 Find user
      const user = await User.findById(userId).session(session);
      if (!user) throw new Error("User not found");

      // 🔹 Update deposit history
      const deposit = await DepositHistory.findOneAndUpdate(
        {
          transactionId,
          userId,
          transactionStatus: "pending",
          amount: transferAmount,
        },
        {
          transactionStatus: "success",
          updatedAt: new Date(),
          gateway,
        },
        { new: true, session }
      );

      if (!deposit) throw new Error("Không tìm thấy giao dịch hợp lệ");

      // 🔹 Update user balance
      user.balance += transferAmount;
      user.total_amount_deposited += transferAmount;
      await user.save({ session });

      // 🔹 Log transaction
      const newTransaction = new TransactionHistory({
        transactionId: generateTransactionId(),
        userId,
        amount: transferAmount,
        transactionType: "add",
        note: "Nạp tiền qua ngân hàng",
        balance: user.balance,
      });

      await newTransaction.save({ session });

      // 🔹 Commit all changes
      await session.commitTransaction();
      session.endSession();

      // 🔹 Notify user and admin via socket
      const io = getIO();
      io.to(userIdRaw).emit("recharge_success", {
        userId: userIdRaw,
        newBalance: user.balance,
        gateway,
        transferAmount,
      });

      io.to("admin_room").emit("new_transaction", {
        type: "payment",
        count: 1,
      });

      return { message: "Recharge successfully" };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error("PaymentService Error:", error.message);
      throw error;
    }
  }
}

module.exports = PaymentService;
