const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie"); // Parse cookies from headers

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true, // Allow cookies in requests
        },
    });

    console.log("🟢 Socket.io server initialized");

    // Middleware to authenticate using cookie
    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) return next(new Error("Authentication error: No cookies found"));

        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies.accessToken;

        if (!token) return next(new Error("Authentication error: No token provided"));

        try {
            const user = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
            socket.user = user; // Attach user data to socket
            next();
        } catch (error) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 New client connected: ${socket.id}, User: ${socket.user.username}`);

        socket.on("join", (room) => {
            socket.join(room);
        });

        socket.on("disconnect", () => {
            console.log("🔌 Client disconnected:", socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};

module.exports = { initializeSocket, getIO };
