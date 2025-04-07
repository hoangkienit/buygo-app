import { io } from "socket.io-client";
import { refreshAccessToken } from "../utils/api";

const SOCKET_URL = "ws://localhost:5000/";
const socket = io(SOCKET_URL,
    {
        auth: {
            token: localStorage.getItem("accessToken"), // Or from cookies
        },  
        autoConnect: false,
        withCredentials: true,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
    }
);

socket.on("connect", () => {
    console.log("✅ Connected to WebSocket:");
});

socket.on("connect_error", async (error) => {
    console.error("❌ WebSocket Connection Error:", error.message);
    if (error.message === "Token expired" || error.message === "No token provided") {
        try {
            const newToken = await refreshAccessToken(); // Gọi API để lấy token mới
            if (newToken) {
                console.log("🔄 Token refreshed, reconnecting...");
                socket.auth.token = newToken; // Cập nhật token mới cho socket
                localStorage.setItem("accessToken", newToken);
                socket.connect(); // Kết nối lại WebSocket
            } else {
                console.error("🚨 Failed to refresh token, forcing logout.");
                window.location.href = "/logout";
            }
        } catch (err) {
            console.error("🚨 Token refresh error:", err);
            window.location.href = "/logout";
        }
    }
});

socket.on("disconnect", (reason) => {
    console.warn("⚠️ WebSocket Disconnected:", reason);
});

export default socket;
