const express = require('express');
const UserController = require('../controllers/user.controller');
const { verifyMiddleware } = require('../middlewares/verify.middleware');

const router = express.Router();


router.get('/protected-data', verifyMiddleware, UserController.getProtectedData);



module.exports = router;