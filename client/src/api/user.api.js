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