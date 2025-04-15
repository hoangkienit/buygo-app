import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/account.css";
import { useUser } from "../context/UserContext";
import AccountLayout from "../layouts/AccountLayout";
import CURRENCY from "./../assets/images/currency_icon.png";
import { userRankText } from "../utils";

const AccountPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };
  return (
    <AccountLayout title="Tài khoản của tôi">
      <div className="account-information-container">
        <section className="account-grid account-card">
          <div className="profile-info">
            <img
              className="profile-avatar"
              src={
                user?.profileImg ||
                "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"
              }
              alt="User Avatar"
            ></img>
            <div>
              <h2>{user?.username || "User"}</h2>
              <span className="user-rank">{userRankText(user?.rank)}</span>
            </div>
            <button className="update-btn">Cập nhật tài khoản</button>
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/super-admin/dashboard")}
                className="update-btn"
              >
                Trang Admin
              </button>
            )}
          </div>
        </section>

        <section className="account-grid">
          <div className="account-card balance-card">
            <p>Số dư</p>
            <div className="user-balance-container">
              <img className="currency" src={CURRENCY} alt="currency"></img>
              <h3 className="user-balance">
                {user?.balance.toLocaleString() || 0}đ
              </h3>
            </div>
            <div className="button-group">
              <button onClick={() => navigate("/account/recharge")}>
                Nạp tiền
              </button>
            </div>
          </div>

          <div className="account-card storage-card">
            <p>Kho hàng</p>
            <div className="storage-stats">
              <span>0 Chờ xử lý</span>
              <span>0 Đang xử lý</span>
              <span>0 Hoàn thành</span>
              <span>0 Bị hủy</span>
            </div>
          </div>

          <div className="account-card password-card">
            <p>Đổi mật khẩu</p>
            <input type="password" value="********" disabled />
            <div className="button-group">
              <button>Đổi mật khẩu</button>
            </div>
          </div>
          <div className="account-card password-card">
            <p>Đăng xuất</p>
            <div className="button-group">
              <button className="logout-button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        </section>
      </div>
    </AccountLayout>
  );
};

export default AccountPage;
