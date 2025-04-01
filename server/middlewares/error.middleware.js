const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message} | URL: ${req.originalUrl} | Method: ${req.method}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;
