const fs = require('fs');
const { google } = require('googleapis');
const readline = require('readline');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.resolve(__dirname, 'token.json');
const CREDENTIALS = require('./credentials.json');

const { client_id, client_secret, redirect_uris } = CREDENTIALS.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

async function authorizeGoogle() {
  if (fs.existsSync(TOKEN_PATH)) {
    try {
      const tokenData = fs.readFileSync(TOKEN_PATH, 'utf8');
        oAuth2Client.setCredentials(JSON.parse(tokenData));
        await refreshTokenIfNeeded();
      console.log('Token loaded successfully.');
      return oAuth2Client;
    } catch (error) {
      console.error('Error reading or parsing token file:', error);
    }
  }

  const open = (await import('open')).default;
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('Authorize this app by visiting this url:', authUrl);
  await open(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Enter the code: ', resolve));
  rl.close();

  try {
    console.log('Exchanging authorization code for tokens...');
    console.log('Code being used:', code.trim());
    
    const { tokens } = await oAuth2Client.getToken(code.trim());
    console.log('Token obtained successfully');
    
    oAuth2Client.setCredentials(tokens);
    
    // Check if directory exists, create if not
    const dir = path.dirname(TOKEN_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write token with better error handling
    try {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log('Token saved to:', TOKEN_PATH);
    } catch (writeError) {
      console.error('Error writing token file:', writeError);
      console.log('Trying to save to current directory instead');
      fs.writeFileSync('./token.json', JSON.stringify(tokens, null, 2));
    }
    
    return oAuth2Client;
  } catch (error) {
    console.error('Error getting token:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

async function refreshTokenIfNeeded() {
  if (oAuth2Client.isTokenExpiring()) {
    try {
      const { credentials } = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(credentials);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));
      console.log('Token refreshed and saved.');
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }
}

module.exports = { authorizeGoogle };