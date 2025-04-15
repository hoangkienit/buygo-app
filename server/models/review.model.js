const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: {type: String, required: true},
  rating: { type: Number, min: 1, max: 5, required: true }, // 1-5 star rating
  comment: { type: String, required: true },
  status: { type: String, default: 'show', enum: ['show', 'hide'] },
}, {
    timestamps: true
});
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;