

class UserController { 
  // 🔹 Login User
  static async getProtectedData(req, res) {
      return res.status(200).json({
          success: true,
          message: "Success",
          data: "Protected data"
      });
  }
}

module.exports = UserController;
