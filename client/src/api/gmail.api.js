import api from './../utils/api';


export const createNewEmailForAdmin = async () => {
  try {
    const response = await api.post(`/gmail/create`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmailsByAlias = async (alias) => {
  try {
    const response = await api.get(`/gmail/get-emails/${alias}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllEmailsForAdmin = async (limit, page) => {
  try {
    const response = await api.get(`/gmail/all-emails?limit=${limit}&page=${page}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEmailForAdmin = async (emailId) => {
  try {
    const response = await api.delete(`/gmail/delete/${emailId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};