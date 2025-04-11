const UserService = require("../services/user.service");
const logger = require("../utils/logger");
const { validateId } = require("../utils/validation");

class UserController {
  // 🔹 Get All Users For Admin
  static async getAllUserForAdmin(req, res) {
    const response = await UserService.getAllUsersForAdmin();
    return res.status(200).json({
      success: true,
      message: "Get all users successfully",
      data: {
        users: response.users,
      },
    });
  }

  static async getUser(req, res) {
    const { userId } = req.params;

    const errors = validateId(userId);
    if (errors && errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0].message,
      });
    }

    try {
      const response = await UserService.getUser(userId);
      return res.status(200).json({
        success: true,
        message: "Get user successfully",
        data: {
          user: response.user,
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = UserController;
