const CryptoJS = require("crypto-js");

const generateTransactionId = () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `GD${randomNumber}`;
}

const generateOrderId = () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `DH${randomNumber}`;
}

const generateProductId = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `SP${randomNumber}`;
}

function generateWords(length = 8, useUppercase = false) {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letters = useUppercase ? lower + upper : lower;

  let result = '';
  for (let i = 0; i < length; i++) {
    const random = CryptoJS.lib.WordArray.random(1).words[0];
    const index = Math.abs(random) % letters.length;
    result += letters.charAt(index);
  }
  return result;
}

module.exports = {
    generateTransactionId,
    generateProductId,
    generateOrderId,
    generateWords
}