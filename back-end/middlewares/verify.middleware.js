const JWT = require("jsonwebtoken");

const verifyMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized! No token provided.",
            });
        }

        // Verify token
        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        success: false,
                        message: "Session expired. Please log in again.",
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: "Invalid token!",
                });
            }

            req.body.id = decoded.id; // Attach user ID to request
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
