const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie"); // For cookie parsing

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true, // Allow credentials (headers & cookies)
        },
    });

    console.log("🟢 Socket.io server initialized");

    // Middleware to authenticate using header or cookie
    io.use((socket, next) => {
        try {
            let token = socket.handshake.auth?.token;

            if (!token) {
                console.error("❌ Authentication error: No token provided");
                return next(new Error("Authentication error: No token provided"));
            }

            console.log("Toekn: ", token);
            // Verify JWT
            const user = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = user; // Attach user info to socket
            next();
        } catch (error) {
            console.error("❌ Authentication error:", error.message);
            return next(new Error("Token expired"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 New client connected: ${socket.id}, User: ${socket.user?.username}`);

        // This will join user to a room
        socket.on("join", (room) => {
            socket.join(room);
        });

        // This will join admins to a room
        socket.on("admin_join", () => {
            socket.join("admin_room");
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
