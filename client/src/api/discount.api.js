import api from './../utils/api';

export const applyDiscount = async (code, total) => {
  try {
    const response = await api.post(`/discount/apply-discount`, {
        code,
        total
    },
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllDiscountsForAdmin = async () => {
  try {
    const response = await api.get(`/discount/all-discounts`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDiscount = async (discountId) => {
  try {
    const response = await api.get(`/discount/get-discount/${discountId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};