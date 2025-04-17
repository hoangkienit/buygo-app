const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const cookieParser = require("cookie-parser");
const http = require("http");
const multer = require('multer');
const { initializeSocket } = require("./services/socket.service");
const requestLogger = require('./middlewares/request.middleware');
const errorHandler = require('./middlewares/error.middleware');
require("./jobs/transactionQueue");
require('./jobs/clearUploads');
// Load environment variables
dotenv.config();

const telegramBot = require('./bot/telegram_bot');


// Connect to Database
connectDb();

const app = express();
const server = http.createServer(app);
initializeSocket(server);

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Sanitize data against NoSQL injection
app.use(xss()); // Sanitize data against XSS attacks
app.use(hpp()); // Protect against HTTP Parameter Pollution

// Middlewares
app.use(cors({
  origin: "http://localhost:3000", // Adjust based on frontend URL http://localhost:3000
  credentials: true, // ✅ Allow cookies
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(requestLogger);
app.use(compression());

const upload = multer({ dest: "uploads/" });

app.use(express.json());

// Telegram
const WEBHOOK_PATH = "/telegram/webhook";

app.use(WEBHOOK_PATH, telegramBot.webhookCallback(WEBHOOK_PATH));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes'
});
// app.use('/api/v1', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => res.status(200).send("Hello world!"));

app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/user', require('./routes/user.route'));
app.use('/api/v1/payment', require('./routes/payment.route'));
app.use('/api/v1/transaction', require('./routes/transaction.route'));
app.use('/api/v1/product', require('./routes/product.route'));
app.use('/api/v1/order', require('./routes/order.route'));
app.use('/api/v1/discount', require('./routes/discount.route'));
app.use('/api/v1/review', require('./routes/review.route'));
app.use('/api/v1/telegram', require('./routes/telegram.route'));

// Error handling middleware
app.use(errorHandler);

// Global error handlers for unexpected errors
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`.white.bgBlue));