import { io } from "socket.io-client";

const SOCKET_URL = "wss://b542-2402-800-631c-64f9-b045-6676-ba86-6e13.ngrok-free.app/";

const socket = io(SOCKET_URL, {
    transports: ["websocket"], // Chỉ sử dụng WebSocket
    autoConnect: false, // Không kết nối ngay khi khởi động
    reconnectionAttempts: 5, // Thử kết nối lại tối đa 5 lần
    timeout: 5000, // Hủy nếu mất kết nối quá 5s
});

// 🔵 Log khi kết nối thành công
socket.on("connect", () => {
    console.log("✅ WebSocket connected:", socket.id);
});

// ❌ Log khi có lỗi kết nối
socket.on("connect_error", (error) => {
    console.error("❌ WebSocket connection error:", error.message);
});

// 🔴 Log khi mất kết nối
socket.on("disconnect", (reason) => {
    console.warn("🔴 WebSocket disconnected:", reason);
});

// 📢 Log khi server gửi tin nhắn
socket.on("message", (msg) => {
    console.log("📢 Server message:", msg);
});

export const connectSocket = (userId) => {
    console.log("🔵 Attempting to connect...");
    socket.connect();
    socket.emit("join", userId);
};

export const disconnectSocket = () => {
    socket.disconnect();
};

export const getSocket = () => socket;
