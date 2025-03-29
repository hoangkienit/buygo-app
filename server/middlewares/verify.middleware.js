const JWT = require("jsonwebtoken");

const verifyMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found",
            });
        }

        // Verify token
        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        success: false,
                        message: "Session expired",
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: "Invalid token",
                });
            }
            req.user = decoded; // Attach user to request
            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { verifyMiddleware };
