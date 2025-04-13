const Discount = require("./../models/discount.model");

class DiscountService {
  static async validateDiscount(code, orderTotal) {
    const discount = await Discount.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!discount) {
      throw new Error("Mã giảm giá không hợp lệ hoặc không hoạt động");
    }

    const now = new Date();

    if (discount.start_date && now < discount.start_date) {
      throw new Error("Mã giảm giá này chưa có hiệu lực");
    }

    if (discount.end_date && now > discount.end_date) {
      throw new Error("Mã giảm giá này đã hết hạn");
    }

    if (orderTotal <= discount.min_purchase) {
      throw new Error(
        `Đơn hàng tối thiểu là ${discount.min_purchase.toLocaleString()}đ`
      );
      }
      
      if (discount.usedCount >= discount.limitUsage) {
          throw new Error("Mã giảm giá đã hết");
      }

    let discountAmount = 0;

    if (discount.discount_type === "percentage") {
      discountAmount = (orderTotal * discount.discount_value) / 100;
    } else if (discount.discount_type === "fixed") {
      discountAmount = discount.discount_value;
    }

    const finalTotal = Math.max(orderTotal - discountAmount, 0);

    return {
      discountAmount,
      finalTotal,
      discountId: discount._id,
      description: discount.description,
      discountCode: discount.code,
    };
  }

  static async createDiscountForAdmin({
    code,
    discount_type,
    discount_value,
    start_date,
    end_date,
    min_purchase,
    limit_usage,
    isActive,
  }) {
    const now = new Date();
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (start < now) {
      throw new Error("Start date must be in the future or today");
    }

    if (end <= start) {
      throw new Error("End date must be after start date");
    }

    const existing = await Discount.findOne({
      code: code.trim().toUpperCase(),
    });
    if (existing) {
      throw new Error("Discount code already exists");
    }

    const discount = new Discount({
      code: code.trim().toUpperCase(),
      discount_type,
      discount_value,
      start_date: start,
      end_date: end,
      min_purchase: min_purchase,
      limitUsage: limit_usage,
      isActive: isActive !== undefined ? isActive : true,
    });

    await discount.save();

    return discount;
  }
}

module.exports = DiscountService;
