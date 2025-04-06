import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaComments, FaUser } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import "./bottom-navbar.css";
import MESSENGER_LOGO from './../../assets/images/messenger-icon.png'
import ZALO_LOGO from './../../assets/images/zalo-icon.png'
import PHONE_LOGO from './../../assets/images/phone-icon.png'
import CURRENCY from './../../assets/images/currency_icon.png'
import { useUser } from "../../context/UserContext";

const BottomNavbar = () => {
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activePopup, setActivePopup] = useState(null); // Controls which popup is open

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) return null; // Hide navbar on desktop

  return (
    <>
      {/* Bottom Navbar */}
      <nav className="bottom-navbar">
        <button className="nav-item" onClick={() => setActivePopup(activePopup === "category" ? null : "category")}>
          <BiSolidCategory className="nav-icon" />
          <span>Danh mục</span>
        </button>

        {/* <button className="nav-item" onClick={() => setActivePopup(activePopup === "inventory" ? null : "inventory")}>
          <FaBoxOpen className="nav-icon" />
          <span>Kho hàng</span>
        </button> */}

        <button className="nav-item" onClick={() => setActivePopup(activePopup === "chat" ? null : "chat")}>
          <FaComments className="nav-icon" />
          <span>Chat ngay</span>
        </button>

        <button className="nav-item" onClick={() => setActivePopup(activePopup === "account" ? null : "account")}>
          <FaUser className="nav-icon" />
          <span>Tài khoản</span>
        </button>
      </nav>

      {/* Popups */}
      <div className={`popup popup-left ${activePopup === "category" ? "popup-active" : ""}`}>
        <div className="popup-content">
          <h3>Danh mục</h3>
          <ul>
            <li><a href="/account">Trò chơi</a></li>
            <li><a href="/account">Gifts Card</a></li>
            <li><a href="/account">Tiện ích</a></li>
            <li><a href="/account">Liên hệ</a></li>
          </ul>
        </div>
      </div>

      <div className={`popup popup-right ${activePopup === "account" ? "popup-active" : ""}`}>
        <div className="popup-content">
          {user ? 
            <>
              <h3>Tài khoản</h3>
              <div className="user-popup-info-container">
                <img className="avatar" src={user?.profileImg || null} alt="User avatar"></img>
                <div className="username-currency">
                  <p className="name">{user?.username || "User"}</p>
                  <div className="currency-container">
                    <img src={CURRENCY} alt="Currency" className="currency-icon"></img>
                    <p className="balance">{user?.balance.toLocaleString() || 0 }</p>
                  </div>
                </div>
              </div>
              <ul>
                <li><a href="/account">Tài khoản của tôi</a></li>
                <li><a href="/account/recharge">Nạp tiền</a></li>
                <li><a href="/account">Đơn hàng</a></li>
                <li><a href="/deposit-history">Lịch sử nạp tiền</a></li>
                <li><a href="/transaction-history">Lịch sử giao dịch</a></li>
                <li><a href="/account">Sản phẩm yêu thích</a></li>
                <li><a href="/logout">Đăng xuất</a></li>
              </ul>
            </>
            :
            <ul>
                <li><a href="/login">Đăng nhập</a></li>
                <li><a href="/register">Đăng ký</a></li>
            </ul>
          }
        </div>
      </div>

      <div className={`popup popup-bottom ${activePopup === "chat" ? "popup-active" : ""}`}>
        <div className="popup-content">
          <h3>Liên hệ</h3>
            <a href="https://zalo.me/yourZaloID" target="_blank" rel="noopener noreferrer" className="popup-contact">
                <img src={ZALO_LOGO} alt="Zalo" className="popup-logo" />
                <span>Liên hệ qua Zalo</span>
            </a>
            <a href="https://m.me/yourMessengerID" target="_blank" rel="noopener noreferrer" className="popup-contact">
                <img src={MESSENGER_LOGO} alt="Messenger" className="popup-logo" />
                <span>Liên hệ qua Messenger</span>
            </a>
            <a href="https://m.me/yourMessengerID" target="_blank" rel="noopener noreferrer" className="popup-contact">
                <img src={PHONE_LOGO} alt="Hotline" className="popup-logo" />
                <span>0903148910 (8h-22h, T2-CN)</span>
            </a>
        </div>
      </div>

      {/* Overlay when popup is open */}
      {activePopup && <div className="popup-overlay" onClick={() => setActivePopup(null)} />}
    </>
  );
};

export default BottomNavbar;
