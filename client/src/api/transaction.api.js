import axios from 'axios';
import { BASE_API_URL_V1 } from "../constants/constants";
import { handleError } from '../utils/handleError';
import api from './../utils/api'


export const createTransaction = async (amount, gateway, paymentMethod) => {
  try {
    const response = await api.post(`/transaction/create-transaction`, {
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
    throw error;
  }
};

export const getTransaction = async (transactionId) => {
  try {
    const response = await api.get(`/transaction/get-transaction/${transactionId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionList = async (limit = 20) => {
  try {
    const response = await api.get(`/transaction/get-transaction/transactions?limit=${limit}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelTransaction = async (transactionId) => {
  try {
    const response = await api.put(`/transaction/cancel-transaction/${transactionId}`,
      {},
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// For admin
export const getTransactionListForAdmin = async (limit = 20) => {
  try {
    const response = await api.get(`/transaction/admin/get-transaction/transactions?limit=${limit}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
