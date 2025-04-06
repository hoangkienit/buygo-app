import api from './../utils/api';

export const createNewOrder = async (productId, product_type, amount) => {
  try {
    const response = await api.post(`/order/create-order`, {
        productId,
        product_type,
        amount
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};