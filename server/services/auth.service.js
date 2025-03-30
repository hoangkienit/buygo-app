const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model");

class AuthService {
  // 🔹 Register a new user
  static async register({ username, email, password}) {
    // 🛑 Check if user already exists
    const existEmail = await User.findOne({ email }).lean();
    if (existEmail) {
      throw new Error("Email đã tồn tại");
    }
      
      // 🛑 Check if user already exists
    const existUsername = await User.findOne({ username }).lean();
    if (existUsername) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }

    // 🔒 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create user
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return { message: "Đăng ký thành công" };
  }

  // 🔹 Login user and generate JWT
  static async login({ username, password }) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // 🔑 Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Sai mật khẩu");
    }

    // 📲 Generate Access Token
    const accessToken = JWT.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "7d",
    });

    user.password = undefined;

    return {
      user: user,
      accessToken,
    };
  }
}

module.exports = AuthService;
