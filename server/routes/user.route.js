const express = require('express');
const UserController = require('../controllers/user.controller');
const { verifyMiddleware, verifyAdminMiddleware } = require('../middlewares/verify.middleware');

const router = express.Router();

// For client
router.get('/get-user/:userId', verifyMiddleware, UserController.getUser);

// For Admin
router.get('/all-users', verifyMiddleware, verifyAdminMiddleware, UserController.getAllUserForAdmin);



module.exports = router;