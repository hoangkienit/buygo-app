import api from './../utils/api';

export const getAllReviewsForAdmin = async (limit, page) => {
  try {
    const response = await api.get(`/review/all-reviews?limit=${limit}&page=${page}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReviewStatusForAdmin = async (reviewId, status) => {
  try {
    const response = await api.patch(`/review/update-status/${reviewId}?status=${status}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};