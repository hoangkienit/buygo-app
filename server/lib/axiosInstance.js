// telegramAxios.js
const axios = require('axios');
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const telegramAxios = axios.create({
  baseURL: TELEGRAM_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

module.exports = telegramAxios;
