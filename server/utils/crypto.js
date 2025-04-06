const CryptoJS = require("crypto-js");

const decrypt = (str) => {
    const bytes = CryptoJS.AES.decrypt(str, process.env.CRYPTO_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const encrypt = (str) => {
    return CryptoJS.AES.encrypt(str, process.env.CRYPTO_SECRET).toString();
};

module.exports = {decrypt, encrypt}
