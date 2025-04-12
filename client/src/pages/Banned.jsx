import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/notfound.css"; // Import the CSS file

const Banned = () => {
  useEffect(() => {
    document.title = "404";
  });
  return (
    <div className="not-found-container">
      <div className="not-found">
              <h1 style={{
            fontFamily: "montserrat-bold"
        }}>Bạn đã bị cấm</h1>
        <p>Nếu có thắc mắc vui lòng liên hệ Admin để giải quyết.</p>
        <Link to="/" className="home-button">
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Banned;
