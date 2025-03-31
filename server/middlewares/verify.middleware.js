const JWT = require("jsonwebtoken");

const verifyMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized! No token provided." });
        }

        const token = authHeader.split(" ")[1];
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
            console.log("User:"+req.user);
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

const verifyAdminMiddleware = async (req, res, next) => {
    try {
        const role = req.user.role;
        console.log(role);
        if (role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "You don't have permission to access this",
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { verifyMiddleware, verifyAdminMiddleware };
