const { getIO } = require("./socket.service");
const User = require("../models/user.model");
const { convertToObjectId } = require("../utils/convert");

class PaymentService {
  // 🔹 Login user and generate JWT
    static async updateUserBalance(gateway, transactionDate, description, transferAmount) {
        let userId = '';
        if (!description || typeof description !== "string") {
            throw new Error("Invalid description");
        }
        const match = description.match(/[a-f0-9]{24}/); // Validate description
        if (match)
        {
            userId = match[0].replace("TKPBG2 ", "");
            console.log(userId);
        } else {
            throw new Error("Invalid description");
        }

        const user = await User.findOne({ _id: convertToObjectId(userId) });
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        // Update user balance
        user.balance += transferAmount;
        await user.save();

        // Notify the client via WebSocket
        getIO().to(userId).emit("recharge_success", { transferAmount, gateway });

    return {
        message: "Nạp tiền thành công"
    };
  }
}

module.exports = PaymentService;