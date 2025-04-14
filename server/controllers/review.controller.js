const ReviewService = require("../services/review.service");
const logger = require("../utils/logger");
const { validateId } = require("../utils/validation");


class ReviewController {
    static async createNewReview(req, res) {
        const { userId, productId, orderId, rating, comment } = req.body;
        
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
}

module.exports = ReviewController;