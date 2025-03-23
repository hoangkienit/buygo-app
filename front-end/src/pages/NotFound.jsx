import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/notfound.css"; // Import the CSS file

const NotFound = () => {
  useEffect(() => {
    document.title = '404'
  })
  return (
    <div className="not-found-container">
      <div className="not-found">
      <h1>404</h1>
      <p>Ồ! Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="home-button">Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default NotFound;

