const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { 
      type: String, 
      enum: ["recharge", "purchase"], 
      required: true 
    }, // "recharge" for balance top-up, "purchase" for buying products

    // Common fields
    amount: { type: Number, required: true },
    paymentMethod: { 
      type: String, 
      enum: ["balance", "momo", "bank_transfer", "paypal"], 
      required: true 
    },
    transactionStatus: { 
      type: String, 
      enum: ["pending", "completed", "failed"], 
      default: "pending" 
    },

    // Only for purchases
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    productName: { type: String, default: null },
    deliveredKey: { type: String, default: null }, // Store product key if digital

    // Only for recharge transactions
    rechargeGateway: { type: String, default: null }, // "Momo", "Bank Transfer", etc.
    
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
