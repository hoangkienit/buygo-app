import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/login.css";
import { ClipLoader } from "react-spinners";
import { login } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { authenticatedUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
        document.title = 'Đăng nhập'
  }, []);

  const handleLogin = async(e) => {
    try {
      e.preventDefault();
      setError(null);
      setLoading(true);

      if (username === " " && password === " ") {
        setError({message: "Vui lòng điền vào các trường"})
        return;  
      }
      console.log("Logging in with:", username, password);
      const res = await login(username, password);
      console.log("Response received:", res);


      setLoading(false);
      authenticatedUser(res.data.user);
      navigate("/");
      
    } catch (error) {
      setLoading(false);
      setError({message: error.message})
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
          

          <button type="submit">
            {loading ? <ClipLoader size={20} color="#fff" /> : <i className="fas fa-arrow-right login-icon"></i>}
          </button>
        </form>

        <p className="register-text">
          Chưa có tài khoản? <a href="/register">Đăng kí ngay</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

