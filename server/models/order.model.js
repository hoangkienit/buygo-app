const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    requestId: {type: String, unique: true, required: true,},
    orderId: {type: String, required: true,},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: {type: String, required: true, index: true},
    order_type: { type: String, enum: ["topup_package", "game_account", "utility_account"], required: true, index: true },
    order_base_amount: { type: Number, required: true },
    order_discount_amount: { type: Number, required: true },
    order_final_amount: { type: Number, required: true },
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: "Discount", index: true },
    order_status: { type: String, enum: ["processing", "success", "failed"], default: "processing", index: true },
    order_note: { type: String, default: '' },
    processed_by: {type: String, default: ''},
    order_attributes: { type: mongoose.Schema.Types.Mixed },
}, {
    timestamps: true
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
