const express = require('express');
const UserController = require('../controllers/user.controller');
const { verifyMiddleware, verifyAdminMiddleware, checkBanned } = require('../middlewares/verify.middleware');

const router = express.Router();

// For client
router.get('/get-user/:userId', verifyMiddleware, checkBanned, UserController.getUser);

router.get('/get-total-deposit', verifyMiddleware, checkBanned, UserController.getUserTotalDeposit);

// For Admin
router.get('/all-users', verifyMiddleware, verifyAdminMiddleware, UserController.getAllUserForAdmin);

router.put('/update-user/:userId', verifyMiddleware, verifyAdminMiddleware, UserController.updateUserForAdmin);

router.patch('/modify-balance/:userId', verifyMiddleware, verifyAdminMiddleware, UserController.modifyUserBalanceForAdmin);

router.patch('/delete-user/:userId', verifyMiddleware, verifyAdminMiddleware, UserController.deleteUserForAdmin);

module.exports = router;