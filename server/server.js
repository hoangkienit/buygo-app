const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const cookieParser = require("cookie-parser");
const http = require("http");
const { initializeSocket } = require("./services/socket.service");
require("./jobs/transactionQueue");

// Load environment variables
dotenv.config();

// Connect to Database
connectDb();

const app = express();
const server = http.createServer(app);
initializeSocket(server);

// Middlewares
app.use(cors({
  origin: "http://localhost:3000", // Adjust based on frontend URL
  credentials: true, // ✅ Allow cookies
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => res.status(200).send("Hello world!"));

app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/user', require('./routes/user.route'));
app.use('/api/v1/payment', require('./routes/payment.route'));
app.use('/api/v1/transaction', require('./routes/transaction.route'));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`.white.bgBlue));