import { io } from "socket.io-client";

const SOCKET_URL = "ws://localhost:5000/";
const socket = io(SOCKET_URL,
    {
        autoConnect: false,
        withCredentials: true,
        transports: ["websocket"],
    }
);

socket.on("connect", () => {
    console.log("✅ Connected to WebSocket:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("❌ WebSocket Connection Error:", error.message);
});

export default socket;
