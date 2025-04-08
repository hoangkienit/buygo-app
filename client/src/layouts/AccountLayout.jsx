import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUser, FaBox, FaGift, FaHistory, FaHeart, FaMoneyCheck } from "react-icons/fa";
import { PiBankFill } from "react-icons/pi";
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
          <li className={location.pathname === "/account" ? "sidebar-active" : ""}>
            <NavLink to="/account" className={() => "navlink"}><FaUser /> Tài khoản của tôi</NavLink>
          </li>
          <li className={location.pathname === "/account/recharge" ? "sidebar-active" : ""}>
            <NavLink to="/account/recharge" className={() => "navlink"}><FaMoneyCheck /> Nạp tiền</NavLink>
          </li>
          <li className={location.pathname === "/deposit-history" ? "sidebar-active" : ""}>
            <NavLink to="/deposit-history" className={() => "navlink"}><PiBankFill /> Lịch sử nạp tiền</NavLink>
          </li>
          <li className={location.pathname === "/transaction-history" ? "sidebar-active" : ""}>
            <NavLink to="/transaction-history" className={() => "navlink"}><FaHistory /> Lịch sử giao dịch</NavLink>
          </li>
          <li className={location.pathname === "/order" ? "sidebar-active" : ""}>
            <NavLink to="/order" className={() => "navlink"}><FaBox /> Đơn hàng</NavLink>
          </li>
          <li className={location.pathname === "/redeem" ? "sidebar-active" : ""}>
            <NavLink to="/redeem" className={() => "navlink"}><FaGift /> Đổi điểm</NavLink>
          </li>
          <li className={location.pathname === "/favorites" ? "sidebar-active" : ""}>
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
