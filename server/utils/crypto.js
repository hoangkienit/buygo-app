const CryptoJS = require("crypto-js");
const fs = require('fs');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.GOOGLE_GMAIL_SECRET || crypto.randomBytes(32).toString('hex');
const ivLength = 16;

const decrypt = (str) => {
    const bytes = CryptoJS.AES.decrypt(str, process.env.CRYPTO_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const encrypt = (str) => {
    return CryptoJS.AES.encrypt(str, process.env.CRYPTO_SECRET).toString();
};

// === Node.js crypto-based encryption ===
function encryptToString(plainText) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptFromString(cipherText) {
  const [ivHex, encryptedHex] = cipherText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}

// === File utilities ===
function encryptToFile(jsonObject, filePath) {
  const jsonStr = JSON.stringify(jsonObject);
  const encrypted = encryptToString(jsonStr);
  fs.writeFileSync(filePath, encrypted, 'utf8');
}

function decryptFromFile(filePath) {
  const encrypted = fs.readFileSync(filePath, 'utf8');
  const jsonStr = decryptFromString(encrypted);
  return JSON.parse(jsonStr);
}

module.exports = {decrypt, encrypt, encryptToFile, decryptFromFile}
