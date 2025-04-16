import api from './../utils/api';
import { nanoid } from 'nanoid';

export const createNewOrder = async (discountCode, productId, product_type, amount, packageId) => {
  try {
    const response = await api.post(`/order/create-order`, {
      discountCode, 
      productId,
      product_type,
      amount,
      requestId: nanoid(),
      packageId
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

export const getAllOrdersForAdmin = async (limit, page) => {
  try {
    const response = await api.get(`/order/admin/orders?limit=${limit}&page=${page}`,
    {
        withCredentials: true
    }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderForAdmin = async (orderId) => {
  try {
    const response = await api.get(`/order/admin/get-order/${orderId}`,
    {
        withCredentials: true
    }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllOrders = async (limit) => {
  try {
    const response = await api.get(`/order/all-orders?limit=${limit}`,
    {
        withCredentials: true
    }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/order/get-order/${orderId}`,
    {
        withCredentials: true
    }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOrderForAdmin = async (orderId) => {
  try {
    const response = await api.delete(`/order/admin/delete-order/${orderId}`,
    {
        withCredentials: true
    }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsSuccessForAdmin = async (orderId, authorId) => {
  try {
    const response = await api.patch(`/order/admin/mark-as-success/${orderId}?authorId=${authorId}`,
    {
        withCredentials: true
    }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsFailedForAdmin = async (orderId, authorId) => {
  try {
    const response = await api.patch(`/order/admin/mark-as-failed/${orderId}?authorId=${authorId}`,
    {
        withCredentials: true
    }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};