const AuthService = require("../services/auth.service");
const logger = require("../utils/logger");
const { validateLogin, validateRegister } = require("../utils/validation");
const jwt = require("jsonwebtoken");

class AuthController {
  // 🔹 Register User
  static async register(req, res) {
    const { username, email, password } = req.body;

    // ✅ Validate input
    const errors = validateRegister(req.body);
      if (errors && errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }

    try {
      const response = await AuthService.register({ username, email, password });
      return res.status(201).json({ success: true, message: response.message });
    } catch (error) {
        logger.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 🔹 Login User
  static async login(req, res) {
      const { username, password } = req.body;
      
    // ✅ Validate input
    const errors = validateLogin(req.body);
    if (errors && errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }

    try {
      const response = await AuthService.login({ username, password });

      // Set cookie
      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: true,  // Set to true in production (HTTPS required)
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          user: response.user,
          accessToken: response.accessToken
        }
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 🔹 Logout User
  static async logout(req, res) {
    // Clear cookie
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Lax" });
    return res.status(200).json({ success: true, message: "Logout successfully" });
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided." });
    }

     try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        // Generate a new access token
        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

       console.log("Refresh new token");
       return res.json({
         success: true,
         message: "Refresh new access token successfully",
         accessToken: newAccessToken
       });
     } catch (error) {
        logger.error(error);
        return res.status(401).json({ message: "Invalid or expired refresh token!" });
    }
  }
}

module.exports = AuthController;
