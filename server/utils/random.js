const generateTransactionId = () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `GD${randomNumber}`;
}

const generateProductId = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `SP${randomNumber}`;
}

module.exports = {generateTransactionId, generateProductId}