# BuyGO App

BuyGO is a full-stack e-commerce application for digital products, focused on game accounts and top-up packages.

## Overview

BuyGO allows users to browse, purchase digital products, and manage their accounts. Administrators can manage products, track transactions, and monitor sales.

## Features

### User Features
- Browse and purchase digital products (game accounts, top-up packages)
- User authentication and account management
- Transaction history and order tracking
- Wallet system for managing funds
- Notification system for order status updates

### Admin Features
- Dashboard with analytics
- Product management system
- Order processing and management
- User management
- Transaction history tracking
- Gift code generation and management
- Review management

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Socket.io client for real-time notifications
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB for database
- Socket.io for real-time communication

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/hoangkienit/buygo-app.git
cd buygo-app
```

2. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the application:
```bash
# Run in development mode
npm run dev

# Or run server and client separately
npm run server
npm run client
```

## Project Structure

```
buygo-app/
├── api/                  # API client functions
├── assets/               # Static assets like images
├── components/           # Reusable React components
│   ├── modal/            # Modal components
│   ├── toasts/           # Toast notification components
│   └── ui/               # UI components (sidebar, buttons, etc.)
├── context/              # React context providers
├── pages/                # Page components
├── services/             # Backend service connectors
├── styles/               # Global CSS styles
└── utils/                # Utility functions
```

## Socket Events

The application uses Socket.io for real-time communication:

### Client Events
- `admin_join`: Admin joins the admin room
- `user_join`: User joins their personal room

### Server Events
- `new_transaction`: Notifies admin of new payment transactions
- `new_order`: Notifies admin of new orders
- `recharge_success`: Notifies users of successful account recharge
- `order_success`: Notifies users of successful orders

## Known Issues

- Multiple toast notifications sometimes appear when receiving socket events

## Future Improvements

- Add support for more payment gateways
- Enhance analytics dashboard with more metrics
- Improve notification system
- Add multi-language support

## Contact

For questions or support, please contact kiennguyen4321abc@gmail.com.
