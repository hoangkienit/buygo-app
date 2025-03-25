const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { 
      type: String, 
      enum: ["momo", "bank_transfer", "paypal", "card"], 
      required: true 
    },
    transactionStatus: { 
      type: String, 
      enum: ["pending", "completed", "failed"], 
      default: "pending" 
    },
    // Only for recharge transactions
    gateway: { type: String, default: null }, // "Momo", "Bank Transfer", etc.
    
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
