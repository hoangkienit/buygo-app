import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUser, FaBox, FaGift, FaHistory, FaHeart, FaMoneyCheck } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import "../styles/account.css";

const AccountLayout = ({ title, children }) => {
  const location = useLocation();

    useEffect(() => {
        document.title = title;
    }, []);

  return (
    <div className="account-container">
      <aside className="account-sidebar">
        <ul>
          <li className={location.pathname === "/account" ? "active" : ""}>
            <NavLink to="/account" className={() => "navlink"}><FaUser /> Tài khoản của tôi</NavLink>
          </li>
          <li className={location.pathname === "/account/recharge" ? "active" : ""}>
            <NavLink to="/account/recharge" className={() => "navlink"}><FaMoneyCheck /> Nạp tiền</NavLink>
          </li>
          <li className={location.pathname === "/storage" ? "active" : ""}>
            <NavLink to="/storage" className={() => "navlink"}><FaBox /> Kho hàng</NavLink>
          </li>
          <li className={location.pathname === "/redeem" ? "active" : ""}>
            <NavLink to="/redeem" className={() => "navlink"}><FaGift /> Đổi điểm</NavLink>
          </li>
          <li className={location.pathname === "/history" ? "active" : ""}>
            <NavLink to="/history" className={() => "navlink"}><FaHistory /> Lịch sử giao dịch</NavLink>
          </li>
          <li className={location.pathname === "/favorites" ? "active" : ""}>
            <NavLink to="/favorites" className={() => "navlink"}><FaHeart /> Sản phẩm yêu thích</NavLink>
          </li>
        </ul>
      </aside>

      <main className="account-content">
        {children}
      </main>
    </div>
  );
};

export default AccountLayout;
