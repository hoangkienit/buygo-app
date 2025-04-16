import api from './../utils/api';


export const getAllUsersForAdmin = async () => {
  try {
    const response = await api.get(`/user/all-users`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await api.get(`/user/get-user/${userId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserTotalDeposit = async () => {
  try {
    const response = await api.get(`/user/get-total-deposit`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserForAdmin = async (userId, userData) => {
  try {
    const response = await api.put(`/user/update-user/${userId}`,
      {
        fullName: userData.fullName,
        email: userData.email,
        newPassword: userData.newPassword
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

export const modifyUserBalanceForAdmin = async (userId, modify_type, amount) => {
  try {
    const response = await api.patch(`/user/modify-balance/${userId}`,
      {
        modify_type,
        amount
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

export const deleteUserForAdmin = async (userId) => {
  try {
    const response = await api.delete(`/user/delete-user/${userId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
