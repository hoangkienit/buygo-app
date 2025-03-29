import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/notfound.css"; // Import the CSS file

const Unauthorized = () => {
  useEffect(() => {
    document.title = 'Không có quyền truy cập'
  })
  return (
    <div className="not-found-container">
      <div className="not-found">
      <h1>403</h1>
      <p>Bạn không có quyền truy cập tới trang này</p>
      <Link to="/" className="home-button">Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default Unauthorized;