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

// Login function
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_API_URL_V1}/auth/login`, {
      username,
      password,
    },
      {
        credentials: true
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Register function
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${BASE_API_URL_V1}/auth/register`, {
      username,
      email,
      password,
    },{
        credentials: true
      });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};
