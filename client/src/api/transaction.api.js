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

export const getDepositHistoryList = async (limit = 50) => {
  try {
    const response = await api.get(`/transaction/deposit-history?limit=${limit}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionHistoryList = async (limit = 50) => {
  try {
    const response = await api.get(`/transaction/transaction-history?limit=${limit}`,
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
export const getTransactionListForAdmin = async (limit = 50) => {
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

export const deleteTransactionForAdmin = async (transactionId) => {
  try {
    const response = await api.post(`/transaction/admin/delete-transaction/${transactionId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
