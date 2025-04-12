const express = require('express');
const UserController = require('../controllers/user.controller');
const { verifyMiddleware, verifyAdminMiddleware } = require('../middlewares/verify.middleware');

const router = express.Router();

// For client
router.get('/get-user/:userId', verifyMiddleware, UserController.getUser);

// For Admin
router.get('/all-users', verifyMiddleware, verifyAdminMiddleware, UserController.getAllUserForAdmin);

router.put('/update-user/:userId', verifyMiddleware, verifyAdminMiddleware, UserController.updateUserForAdmin);

router.patch('/modify-balance/:userId', verifyMiddleware, verifyAdminMiddleware, UserController.modifyUserBalanceForAdmin);



module.exports = router;