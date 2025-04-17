const express = require('express');
const TelegramController = require('../controllers/telegram.controller');

const router = express.Router();

router.post('/set-webhook', TelegramController.setWebhook);

router.post('/webhook', TelegramController.handleWebhook);

module.exports = router;