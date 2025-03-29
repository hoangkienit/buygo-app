const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["topup", "account"], required: true, index: true }, // "topup" = nạp game, "account" = mua acc
    amount: { type: Number, required: true },

    // Thông tin tài khoản game khi nạp
    gameAccountInfo: {
        gameName: { type: String, required: function() { return this.type === "topup"; }, index: true },
        username: { type: String, required: function() { return this.type === "topup"; } },
        password: { type: String, required: function() { return this.type === "topup"; } }, // Phải mã hóa

        // Chỉ lưu nếu game yêu cầu
        gameId: { type: String, required: false, index: true },
        token: { type: String, required: false }
    },

    purchasedAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "GameAccount", index: true },

    status: { type: String, enum: ["pending", "completed"], default: "pending", index: true },
    createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model("Order", OrderSchema);
