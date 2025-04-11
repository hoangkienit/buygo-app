import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Register from "./pages/Register";
import { UserProvider } from "./context/UserContext";
import Recharge from "./pages/Recharge";
import Payment from "./pages/Payment";
import Logout from "./pages/Logout";
import Product from "./pages/Product";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import Unauthorized from "./pages/Unauthorized";
import { AdminPayment } from "./pages/admin/AdminPayment";
import { AdminProduct } from "./pages/admin/AdminProduct";
import { AdminAddProduct } from "./pages/admin/AdminAddProduct";
import { AdminProductDetail } from "./pages/admin/AdminProductDetail";
import { AdminEditProduct } from "./pages/admin/AdminEditProduct";
import Checkout from "./pages/Checkout";
import DepositHistory from "./pages/DepositHistory";
import TransactionHistory from "./pages/TransactionHistory";
import OrderSuccess from "./pages/OrderSuccess";
import { AdminOrder } from "./pages/admin/AdminOrder";
import { AdminOrderDetail } from "./pages/admin/AdminOrderDetail";
import Order from "./pages/Order";
import { OrderDetail } from "./pages/OrderDetail";
import { AdminUser } from "./pages/admin/AdminUser";
import { AdminUserDetail } from "./pages/admin/AdminUserDetail";
import { AdminEditUser } from "./pages/admin/AdminEditUser";

function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product/:product_slug" element={<Product />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/logout" element={<Logout />} />
              <Route element={<MainLayout />}>
                <Route path="/account" element={<Account />} />
                <Route path="/recharge" element={<Recharge />} />
                <Route path="/recharge/:transactionId" element={<Payment />} />
                <Route path="/deposit-history" element={<DepositHistory />} />
                <Route
                  path="/transaction-history"
                  element={<TransactionHistory />}
                />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order" element={<Order />} />
                <Route path="/order/:orderId" element={<OrderDetail />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route
                path="/super-admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route path="/super-admin/payment" element={<AdminPayment />} />

              <Route path="/super-admin/products" element={<AdminProduct />} />
              <Route
                path="/super-admin/products/add-product"
                element={<AdminAddProduct />}
              />
              <Route
                path="/super-admin/products/view/:productId"
                element={<AdminProductDetail />}
              />
              <Route
                path="/super-admin/products/edit/:productId"
                element={<AdminEditProduct />}
              />

              <Route path="/super-admin/orders" element={<AdminOrder />} />
              <Route
                path="/super-admin/orders/view/:orderId"
                element={<AdminOrderDetail />}
              />

              <Route path="/super-admin/users" element={<AdminUser />} />
              <Route
                path="/super-admin/users/view/:userId"
                element={<AdminUserDetail />}
              />
              <Route
                path="/super-admin/users/edit/:userId"
                element={<AdminEditUser />}
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;
