const JWT = require("jsonwebtoken");
const User = require("../models/user.model");
const { convertToObjectId } = require("../utils/convert");

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
        JWT.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
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
            const user = await User.findById(convertToObjectId(decoded.id));
            req.user = {
                ...user,
                id: user._id
            }; // Attach user to request
            console.log(req.user);
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

const checkBanned = (req, res, next) => {
  const status = req.user._doc.status; // Assuming you attach the user object after token verification
  if (status === 'banned') {
    return res.status(403).json({ error: 'User is banned', code: 'USER_BANNED' });
  }

  next();
};

module.exports = { verifyMiddleware, verifyAdminMiddleware, checkBanned };
