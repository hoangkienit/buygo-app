import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <h3>Buygo.vn</h3>
          <p>Nạp nhanh – Chơi liền – An toàn tuyệt đối.</p>
        </div>

        {/* Column 2: Navigation */}
        <div className="footer-links">
          <h3>Liên kết</h3>
          <ul>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/services">Điều khoản dịch vụ</a></li>
            <li><a href="/blog">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-contact">
          <h3>Liên hệ</h3>
          <p>Email: <span className="contact">support@buygo.com</span></p>
          <p>Hotline: <span className="contact">0903148910</span>(8h - 24h, T2 - CN)</p>
          <p>Địa chỉ: 123 Street, City, Country</p>
        </div>

        {/* Column 4: Social Media */}
        <div className="footer-social">
          <h3>Theo dõi chúng tôi trên</h3>
          <div className="social-icons">
            <a href="https://facebook.com"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
            <a href="https://linkedin.com"><i className="fab fa-linkedin-in"></i></a>
            <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2025 Buygo.com, all rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
