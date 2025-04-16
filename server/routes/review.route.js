const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware, checkBanned } = require('../middlewares/verify.middleware');
const ReviewController = require('../controllers/review.controller');

const router = express.Router();

// For client
router.post('/create', verifyMiddleware, checkBanned, ReviewController.createNewReview);

// For Admin
router.get('/all-reviews', verifyMiddleware, verifyAdminMiddleware, ReviewController.getAllReviewsForAdmin);

router.patch('/update-status/:reviewId', verifyMiddleware, verifyAdminMiddleware, ReviewController.updateReviewStatusForAdmin);

router.delete('/delete/:reviewId', verifyMiddleware, verifyAdminMiddleware, ReviewController.deleteReviewForAdmin);

module.exports = router;