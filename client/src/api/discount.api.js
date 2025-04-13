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