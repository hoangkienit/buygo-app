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
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Login function
export const logout = async () => {
  try {
    const response = await axios.post(`${BASE_API_URL_V1}/auth/logout`, {},
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    console.log("Log out error: " + error);
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
        withCredentials: true
      });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};
