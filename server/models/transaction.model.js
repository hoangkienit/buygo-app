const { required } = require("joi");
const mongoose = require("mongoose");

const DepositSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, index: 1 },
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

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, index: 1 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: ['add', 'subtract'],
      required: true
    },
    note: {type: String, default: ''},
    balance: {type: Number, required: true}
  },
  { timestamps: true }
);

const DepositHistory = mongoose.model("DepositHistory", DepositSchema);
const TransactionHistory = mongoose.model("TransactionHistory", TransactionSchema);
module.exports = {DepositHistory, TransactionHistory};
