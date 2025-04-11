
const User = require("../models/user.model");
const { convertToObjectId } = require("../utils/convert");

class UserService {
  // 🔹 Register a new user
  static async getAllUsersForAdmin() {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    
      if (!users) users = [];
    return {
      users: users,
    };
    }
    
    static async getUser(userId) {
        const user = await User.findOne({ _id: convertToObjectId(userId) }).lean();
        if (!user) throw new Error("User not found");

        return {
            message: "Get user success",
            user: user
        }
    }
}

module.exports = UserService;
