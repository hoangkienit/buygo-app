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
import Transaction from "./pages/Transaction";
import Product from "./pages/Product";


function App() {
  return (
    <UserProvider>
      <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product" element={<Product />} />
              {/* Not Found Page */}
              <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />

          {/* Protected Routes */}
          <Route element={<AuthLayout />}>
              {/* Auth Routes */}
              <Route path="/logout" element={<Logout/>} />
              <Route element={<MainLayout />}>                             
                {/* Account Routes */}
                <Route path="/account" element={<Account />} />
                <Route path="/account/recharge" element={<Recharge />} />
                <Route path="/account/recharge/:transactionId" element={<Payment />} />
                
                <Route path="/transaction" element={<Transaction/>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </UserProvider>
  );
}

export default App;
