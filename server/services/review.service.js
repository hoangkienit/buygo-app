const Review = require('./../models/review.model');

class ReviewService {
    static async getProductRatingStats(productId) {
        const result = await Review.aggregate([
            { $match: { productId } },  // Filter by productId
            { 
            $group: { 
            _id: "$productId",
            averageRating: { $avg: "$rating" },  // Calculate avg rating
            totalReviews: { $sum: 1 } // Count total reviews
            }
            }
        ]);

        return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
    };

    static async getProductReviewsWithStats(productId) {
        const reviews = await Review.find({ productId })
        .populate("userId", "username profileImg") // Fetch only `username` & `profile_img`
        .sort({ createdAt: -1 })
        .lean();

        const ratingStats = await ReviewService.getProductRatingStats(productId);

        return { ...ratingStats, reviews };
    };

}

module.exports = ReviewService;