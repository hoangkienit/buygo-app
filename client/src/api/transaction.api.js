import axios from 'axios';
import { BASE_API_URL_V1 } from "../constants/constants";
import { handleError } from '../utils/handleError';


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
    const response = await axios.get(`${BASE_API_URL_V1}/transaction/get-transaction/${transactionId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getTransactionList = async (limit = 20) => {
  try {
    const response = await axios.get(`${BASE_API_URL_V1}/transaction/get-transaction/transactions?limit=${limit}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    console.log(error)
    handleError(error);
  }
};

export const cancelTransaction = async (transactionId) => {
  try {
    const response = await axios.put(`${BASE_API_URL_V1}/transaction/cancel-transaction/${transactionId}`,
      {},
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};
