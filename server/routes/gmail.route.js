const express = require('express');
const { verifyMiddleware, verifyAdminMiddleware, checkBanned } = require('../middlewares/verify.middleware');
const GmailController = require('../controllers/gmail.controller');

const router = express.Router();

// For admin
router.get('/get-emails/:alias',  GmailController.getEmailsByAlias);

router.post('/create', verifyMiddleware, verifyAdminMiddleware, GmailController.createNewEmailForAdmin);

router.get('/all-emails',  GmailController.getAllEmailsForAdmin);

router.delete('/delete/:emailId', verifyMiddleware, verifyAdminMiddleware, GmailController.deleteEmailForAdmin);



module.exports = router;