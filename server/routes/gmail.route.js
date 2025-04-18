const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware, checkBanned } = require('../middlewares/verify.middleware');
const GmailController = require('../controllers/gmail.controller');

const router = express.Router();

// For admin
router.get('/get-emails/:alias', GmailController.getEmailsByAlias);



module.exports = router;