const DiscountService = require("../services/discount.service");
const logger = require("../utils/logger");
const {
  validateCreateDiscountForAdmin,
  validateId,
} = require("../utils/validation");

class DiscountController {
  static async validateDiscount(req, res) {
    const { code, total } = req.body;

    try {
      const response = await DiscountService.validateDiscount(code, total);

      return res.status(200).json({
        success: true,
        message: "Applied discount code",
        data: response,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async createDiscountForAdmin(req, res) {
    const {
      code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      min_purchase,
      limit_usage,
      isActive,
    } = req.body;

    const errors = validateCreateDiscountForAdmin({
      code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      isActive,
    });
    if (errors && errors.length > 0)
      return res.status(400).json({
        success: false,
        message: errors[0].message,
      });

    try {
      const response = await DiscountService.createDiscountForAdmin({
        code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        min_purchase,
        limit_usage,
        isActive,
      });

      return res.status(201).json({
        success: true,
        message: "Created discount success",
        data: {
          newDiscount: response,
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

  static async getAllDiscountsForAdmin(req, res) {
    try {
      const response = await DiscountService.getAllDiscountsForAdmin();

      return res.status(200).json({
        success: true,
        message: "Get all discount success",
        data: response,
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getDiscount(req, res) {
    const { discountId } = req.params;

    const errors = validateId(discountId);
    if (errors && errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0].message,
      });
    }

    try {
      const response = await DiscountService.getDiscount(discountId);

      return res.status(200).json({
        success: true,
        message: "Get discount success",
        data: response,
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

module.exports = DiscountController;
