import api from "./../utils/api";

export const applyDiscount = async (code, total) => {
  try {
    const response = await api.post(
      `/discount/apply-discount`,
      {
        code,
        total,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllDiscountsForAdmin = async () => {
  try {
    const response = await api.get(`/discount/all-discounts`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDiscount = async (discountId) => {
  try {
    const response = await api.get(`/discount/get-discount/${discountId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const switchDiscountStatus = async (discountId, status) => {
  try {
    const response = await api.patch(`/discount/switch-status/${discountId}?status=${status}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDiscountForAdmin = async (
  code,
  discount_type,
  discount_value,
  start_date,
  end_date,
  min_purchase,
  limit_usage,
  isActive
) => {
  try {
    const response = await api.post(
      `/discount/create-discount`,
      {
        code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        min_purchase,
        limit_usage,
        isActive,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDiscountForAdmin = async (discountId) => {
  try {
    const response = await api.delete(`/discount/delete-discount/${discountId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
