const { required } = require("joi");
const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
      default: "fixed",
    },
    discount_value: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // reset to 00:00:00
          return v >= today;
        },
      },
      default: Date.now(),
    },
    end_date: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v >= this.start_date;
        },
      },
    },
    min_purchase: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: { type: Boolean, default: true },
    usedCount: { type: Number, default: 0 },
    limitUsage: { type: Number, default: 10 },
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
