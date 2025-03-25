import axios from 'axios';
import { BASE_API_URL_V1 } from "../constants/constants";

// Centralized error handler
const handleError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || "Có lỗi xảy ra.");
  } else if (error.request) {
    throw new Error("Lỗi mạng! Vui lòng kiểm tra kết nối của bạn.");
  } else {
    throw new Error(error);
  }
};

export const createTransaction = async (amount, gateway, paymentMethod) => {
  try {
    const response = await axios.post(`${BASE_API_URL_V1}/transaction/create-transaction`, {
        amount,
        paymentMethod,
        gateway
    },
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getTransaction = async (transactionId) => {
  try {
    const response = await axios.get(`${BASE_API_URL_V1}/transaction/${transactionId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};
