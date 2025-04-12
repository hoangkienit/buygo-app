import axios from "axios";
import { BASE_API_URL_V1 } from "../constants/constants";

const api = axios.create({
    baseURL: BASE_API_URL_V1,
    withCredentials: true,
});

// 🟢 Hàm refresh token
export const refreshAccessToken = async () => {
    try {
        const response = await axios.post(`${BASE_API_URL_V1}/auth/refresh-token`, {}, { withCredentials: true });
        return response.data.accessToken;
    } catch (error) {
        console.error("Refresh token expired! Logging out...");
        return null;
    }
};

// 🟢 Interceptor request: Thêm token vào header
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🟢 Interceptor response: Xử lý lỗi 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.warn("Access token expired, trying to refresh...");
                const newAccessToken = await refreshAccessToken();

                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api.request(error.config);
                } else {
                    console.error("Refresh token expired. Redirecting to login...");
                    window.location.href = "/logout";
                }
            }
            else if (status === 403 && error.response.data.code === 'USER_BANNED') {
                window.location.href = "/logout?reason=banned";
            }
            else {
                console.log(error);
                throw new Error(error.response.data.message || "Có lỗi xảy ra.")
            }
        } else if (error.request) {
            console.log(error);
            throw new Error("Lỗi kết nối. Vui lòng thử lại sau.");
        } else {
            throw new Error("Lỗi hệ thống");
        }
        

        return Promise.reject(error);
    }
);

export default api;
