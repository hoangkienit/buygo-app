const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const { convertToObjectId } = require("../utils/convert");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const { generateTransactionId } = require("../utils/random");
const { getIO } = require("./socket.service");
const { TransactionHistory, DepositHistory } = require("../models/transaction.model");
const Order = require("../models/order.model");

class UserService {
  // 🔹 Register a new user
  static async getAllUsersForAdmin() {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    if (!users) users = [];
    return {
      users: users,
    };
  }

  static async getUser(userId) {
    const user = await User.findOne({ _id: convertToObjectId(userId) }).lean();
    if (!user) throw new Error("User not found");

    return {
      message: "Get user success",
      user: user,
    };
  }

  static async updateUserForAdmin(userId, fullName, email, newPassword) {
    const user = await User.findById(convertToObjectId(userId));
    if (!user) throw new Error("User not found");

    console.log(user);
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    if (newPassword) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return {
      updatedUser: user,
    };
  }

  static async modifyUserBalanceForAdmin(userId, modify_type, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(convertToObjectId(userId)).session(
        session
      );
      if (!user) throw new Error("User not found");

      // 🔹 Log transaction
      const newTransaction = new TransactionHistory({
        transactionId: generateTransactionId(),
        userId: user?._id,
        amount: amount,
        balance: user?.balance,
      });

      if (modify_type === "add") {
        user.balance += amount;

        newTransaction.transactionType = "add";
        newTransaction.note = "Nhận tiền từ Admin";
      } else if (modify_type === "sub") {
        user.balance -= amount;

        newTransaction.transactionType = "subtract";
        newTransaction.note = "Trừ tiền từ Admin";
      }

      await Promise.all([
        user.save({ session }),
        newTransaction.save({ session }),
      ]);

      await session.commitTransaction();
      session.endSession();

      console.log("emit socket " + userId);

      const io = getIO();
      io.to(userId).emit("admin_modify_balance", {
        newBalance: user.balance,
      });

      return {
        message: "Update user balance successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error("UserService: " + error);
      throw error;
    }
  }

  static async deleteUserForAdmin(userId) {
    await Promise.all([
      DepositHistory.deleteMany({ userId: convertToObjectId(userId) }),
      TransactionHistory.deleteMany({ userId: convertToObjectId(userId) }),
      Order.deleteMany({ userId: convertToObjectId(userId) })
    ]);

    // Delete the user
    const user = await User.findByIdAndDelete(convertToObjectId(userId));

    if (!user) {
      throw new Error('User not found');
    }

    return {
      message: "Delete user successfully"
    }
  }
}

module.exports = UserService;
