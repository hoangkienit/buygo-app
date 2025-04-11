import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/register.css";
import { ClipLoader } from "react-spinners";
import { register } from "../api/auth.api";
import { useUser } from "../context/UserContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) navigate("/");
    document.title = "Đăng ký";
  }, []);

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError(null);

      if (
        username === " " ||
        email === " " ||
        password === " " ||
        confirmPassword === " "
      ) {
        setLoading(false);
        setError({ message: "Vui lòng điền vào các trường" });
        return;
      }

      await register(username, email, password);

      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError({ message: error.message });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Đăng ký</h2>
        <p className="register-second-title">
          Tham gia ngay – Nhận ưu đãi liền tay!
        </p>

        {error && <p className="error-text">*{error.message}</p>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={
              loading ? "disabled-btn register-button" : "register-button"
            }
          >
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <p className="submit-text">Đăng ký</p>
            )}
          </button>
        </form>

        <p className="login-text">
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
        <a className="back-to-dashboard-button" href="/">
          ← Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default Register;
