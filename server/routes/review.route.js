const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware, checkBanned } = require('../middlewares/verify.middleware');
const ReviewController = require('../controllers/review.controller');

const router = express.Router();

// For client
router.post('/create',  ReviewController.createNewReview);

// For Admin

module.exports = router;