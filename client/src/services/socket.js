import { io } from "socket.io-client";

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
    console.log("✅ Connected to WebSocket:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("❌ WebSocket Connection Error:", error.message);
});

socket.on("disconnect", (reason) => {
    console.warn("⚠️ WebSocket Disconnected:", reason);
});

export default socket;
