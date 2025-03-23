const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    console.log("🟢 Socket.io server initialized");
    io.on("connection", (socket) => {
        console.log("🔌 New client connected:", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId); // User joins their unique room (user ID)
        });

        socket.on("disconnect", () => {
            console.log("🔌 Client disconnected");
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initializeSocket, getIO };
