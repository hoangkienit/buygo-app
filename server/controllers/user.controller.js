
const UserService = require("../services/user.service");
const logger = require("../utils/logger");
const { validateId, validateUpdateUserForAdmin } = require("../utils/validation");

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

  static async updateUserForAdmin(req, res) {
    const { userId } = req.params;
    const { fullName, email, newPassword } = req.body;

    const errors = validateUpdateUserForAdmin({
      fullName,
      email,
      newPassword
    });
    if (errors && errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0].message
      });
    }

    try {
      const response = await UserService.updateUserForAdmin(
        userId,
        fullName,
        email,
        newPassword);
      return res.status(200).json({
        success: true,
        message: "Update user success",
        data: {
          updatedUser: response.updatedUser
        }
      })
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async modifyUserBalanceForAdmin(req, res) {
    const { userId } = req.params;
    const { modify_type, amount } = req.body;

    try {
      const response = await UserService.modifyUserBalanceForAdmin(
        userId,
        modify_type,
        Number(amount)
      );

      return res.status(200).json({
        success: true,
        message: response.message,
        data: null
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  static async deleteUserForAdmin(req, res) {
    const { userId } = req.params;

    const errors = validateId({ userId });
    if (errors && errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0].message
      });
    }

    try {
      const response = await UserService.deleteUserForAdmin(userId);

      return res.status(200).json({
        success: true,
        message: response.message
      })
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getUserTotalDeposit(req, res) {
    const userId = req.user?.id;

    try {
      const response = await UserService.getUserTotalDeposit(userId);

      return res.status(200).json({
        success: true,
        message: "Get user total deposit amount",
        data: {
          totalDeposit: response
        }
      })
    } catch (error) {
      logger.error(error);
      return res.status(200).json({
        success: false,
        message: error.message
      })
    }
  }
}

module.exports = UserController;
