const fs = require('fs');
const { google } = require('googleapis');
const readline = require('readline');
const path = require('path');
const logger = require('../utils/logger');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.resolve(__dirname, 'token.json');
const CREDENTIALS = require('./credentials.json');
const { encryptToFile, decryptFromFile } = require('../utils/crypto');

const { client_id, client_secret, redirect_uris } = CREDENTIALS.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

async function authorizeGoogle() {
  if (fs.existsSync(TOKEN_PATH)) {
    try {
      const tokenData = decryptFromFile(TOKEN_PATH);
      oAuth2Client.setCredentials(tokenData);
      await refreshTokenIfNeeded();
      logger.info('🔑 Token loaded and decrypted successfully.');
      return oAuth2Client;
    } catch (error) {
      logger.error('❌ Error reading or decrypting token file:', error);
    }
  }

  const open = (await import('open')).default;
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES
  });
  logger.info('🔗 Authorize this app by visiting this URL:', authUrl);
  await open(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Enter the code: ', resolve));
  rl.close();

  try {
    logger.info('🧪 Code received, exchanging for token...');
    const { tokens } = await oAuth2Client.getToken(code.trim());
    oAuth2Client.setCredentials(tokens);

    const dir = path.dirname(TOKEN_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      encryptToFile(tokens, TOKEN_PATH);
      logger.info('🔒 Token encrypted and saved successfully at:', TOKEN_PATH);
    } catch (writeError) {
      logger.error('❌ Failed to save encrypted token:', writeError);
    }

    return oAuth2Client;
  } catch (error) {
    logger.error('❌ Error retrieving access token:', error.message);
    if (error.response) {
      logger.error('Response data:', error.response.data);
    }
    throw error;
  }
}

async function refreshTokenIfNeeded() {
  if (oAuth2Client.isTokenExpiring && oAuth2Client.isTokenExpiring()) {
    try {
      const { credentials } = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(credentials);
      encryptToFile(credentials, TOKEN_PATH);
      logger.info('🔁 Token refreshed and encrypted successfully.');
    } catch (error) {
      logger.error('❌ Error refreshing token:', error);
    }
  }
}

module.exports = { authorizeGoogle };
