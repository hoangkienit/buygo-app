import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/login.css";
import { ClipLoader } from "react-spinners";
import { login } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

const Login = () => {
  const { authenticatedUser } = useAuth();
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) navigate('/');
    document.title = 'Đăng nhập';
  }, []);

  const handleLogin = async(e) => {
    try {
      e.preventDefault();
      setError(null);
      setLoading(true);

      if (username === " " && password === " ") {
        setLoading(false);
        setError({message: "Vui lòng điền vào các trường"})
        return;  
      }
      const res = await login(username, password);

      // Checking banned
      if (res.data.user?.status === 'banned') {
        navigate('/banned');
        return;
      }

      authenticatedUser(res.data.user);
      
      if (res.data.user.role === 'admin') {
        navigate("/super-admin/dashboard");
      }else navigate("/");
      
    } catch (error) {
      setError({message: error.message})
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Đăng nhập</h2>
        <p className="login-second-title">Chào mừng đến với thế giới game</p>

        {error && <p className="error-text">*{error.message}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
            />
          </div>
          

          <p className="reset-password">
            <a className="reset-password-text" href="/reset-password">Quên mật khẩu</a>
          </p>

          <button type="submit" disabled={loading} className={`login-button ${loading ? "disabled-btn": ""}`}>
            {loading ? <ClipLoader size={20} color="#fff" /> : <i className="fas fa-arrow-right login-icon"></i>}
          </button>
        </form>

        <p className="register-text">
          Chưa có tài khoản? <a href="/register">Đăng kí ngay</a>
        </p>
        <a className="back-to-dashboard-button" href="/">
          ← Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default Login;

