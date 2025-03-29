const AuthService = require("../services/auth.service");
const { validateLogin, validateRegister } = require("../utils/validation");

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
        console.log(error);
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
      res.cookie("accessToken", response.accessToken, {
        httpOnly: true,
        secure: true,  // Set to true in production (HTTPS required)
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({ success: true, message: "Đăng nhập thành công", data: response });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 🔹 Logout User
  static async logout(req, res) {
    // Clear cookie
    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "Lax" });
    return res.status(200).json({ success: true, message: "Logout successfully" });
  }
}

module.exports = AuthController;
