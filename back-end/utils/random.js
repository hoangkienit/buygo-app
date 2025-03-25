const generateTransactionId = () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `GD${randomNumber}`;
}

module.exports = {generateTransactionId}