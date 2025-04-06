const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId: {type: String, required: true,},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: {type: String, required: true, index: true},
    order_type: { type: String, enum: ["topup_package", "game_account", "utility_account"], required: true, index: true },
    order_amount: { type: Number, required: true },
    order_status: { type: String, enum: ["pending", "success", "failed"], default: "pending", index: true },
    order_note: { type: String, default: '' },
    order_attributes: { type: mongoose.Schema.Types.Mixed },
}, {
    timestamps: true
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
