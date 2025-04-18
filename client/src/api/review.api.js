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

export const deleteReviewForAdmin = async (reviewId) => {
  try {
    const response = await api.delete(`/review/delete/${reviewId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewReview = async (productId, orderId, rating, comment) => {
  try {
    const response = await api.post(`/review/create`,
      {
        productId,
        orderId,
        rating,
        comment
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

export const getProductReviewsBySlug = async (product_slug, limit) => {
  try {
    const response = await api.get(`/review/get-reviews/${product_slug}?limit=${limit}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};