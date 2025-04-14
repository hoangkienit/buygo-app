const { Product } = require("../models/product.model");
const Review = require("./../models/review.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const { convertToObjectId } = require("../utils/convert");

class ReviewService {
  static async getProductRatingStats(productId) {
    const result = await Review.aggregate([
      { $match: { productId } }, // Filter by productId
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" }, // Calculate avg rating
          totalReviews: { $sum: 1 }, // Count total reviews
        },
      },
    ]);

    return result.length > 0
      ? result[0]
      : { averageRating: 0, totalReviews: 0 };
  }

  static async getProductReviewsWithStats(productId, limit = 20) {
    const reviews = await Review.find({ productId })
      .limit(limit)
      .populate("userId", "username profileImg rank") // Fetch only `username` & `profile_img`
      .sort({ createdAt: -1 })
      .lean();

    const ratingStats = await ReviewService.getProductRatingStats(productId);

    return { ...ratingStats, reviews };
  }

  static async createNewReview(productId, userId, orderId, rating, comment) {
    const [product, order, user] = await Promise.all([
      Product.findOne({ productId: productId }).lean(),
      Order.findOne({ orderId }).lean(),
      User.findById(convertToObjectId(userId)).lean(),
    ]);

    if (!product) throw new Error(`Product with ID ${productId} not found`);
    if (!order) throw new Error(`Order with ID ${orderId} not found`);
    if (!user) throw new Error(`User with ID ${userId} not found`);

    const newReview = await Review.create({
      productId: product.productId,
      userId: user._id,
      orderId: order.orderId,
      rating,
      comment,
    });

    return newReview;
  }
}

module.exports = ReviewService;
