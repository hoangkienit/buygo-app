const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true }, // 1-5 star rating
  comment: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked this comment
}, {
    timestamps: true
});

module.exports = mongoose.model("Comment", CommentSchema);
