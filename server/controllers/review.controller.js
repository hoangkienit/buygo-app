const ReviewService = require("../services/review.service");
const logger = require("../utils/logger");
const { validateId } = require("../utils/validation");


class ReviewController {
    static async createNewReview(req, res) {
        const userId = req.user?.id;
        const { productId, orderId, rating, comment } = req.body;
        
        let errors = validateId(productId);
        if (errors && errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors[0].message
            })
        }

        errors = validateId(orderId);
        if (errors && errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors[0].message
            })
        }

        try {
            const response = await ReviewService.createNewReview(
                productId,
                userId,
                orderId,
                rating,
                comment
            );

            return res.status(201).json({
                success: true,
                message: "Created review",
                data: {
                    newReview: response
                }
            })
        } catch (error) {
            logger.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getAllReviewsForAdmin(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);

            const response = await ReviewService.getAllReviewsForAdmin(limit, page);

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    total: response.total,
                    totalPages: response.totalPages,
                    page: response.page,
                    reviews: response.reviews
                }
            })
        } catch (error) {
            logger.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    static async updateReviewStatusForAdmin(req, res) {
        const { reviewId } = req.params;
        const { status } = req.query;

        const errors = validateId(reviewId);
        if (errors && errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors[0].message
            });
        }
        try {
            const response = await ReviewService.updateReviewStatusForAdmin(reviewId, status);

            return res.status(200).json({
                success: true,
                message: "Update review status success",
                data: {
                    updatedReview: response
                }
            })
        } catch (error) {
            logger.error(error);
             return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteReviewForAdmin(req, res) {
        const { reviewId } = req.params;

        const errors = validateId(reviewId);
        if (errors && errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors[0].message
            });
        }
        try {
            const response = await ReviewService.deleteReviewForAdmin(reviewId);

            return res.status(200).json({
                success: true,
                message: response.message,
                data: null
            })
        } catch (error) {
            logger.error(error);
             return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getProductReviewsBySlug(req, res) {
        const { product_slug } = req.params;
        const limit = parseInt(req.query.limit);

        try {
            const response = await ReviewService.getProductReviewsBySlug(product_slug, limit);

            return res.status(200).json({
                success: true,
                message: "Get reviews success",
                data: {
                    product_reviews: response
                }
            })
        } catch (error) {
            logger.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = ReviewController;