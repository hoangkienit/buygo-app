// UserDetailsPage.jsx
import React, { useState, useEffect } from "react";
import "./admin-user-detail.css";
import { useNavigate, useParams } from "react-router-dom";
import ToastNotification, {
  showToast,
} from "../../components/toasts/ToastNotification";
import { getUser } from "../../api/user.api";
import { HashLoader } from "react-spinners";
import { getUserRankImageURL, userRankText, userStatusText } from "../../utils";

export const AdminUserDetail = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Admin - ${userId}`;
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);

    try {
      const res = await getUser(userId);

      if (res?.success) {
        setUserData(res.data.user || null);
        console.log(res);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle editing the profile (placeholder)
  const handleEditProfile = () => {
    navigate(`/super-admin/users/edit/${userId}`);
  };

  // Function to navigate back to dashboard (placeholder)
  const handleBackToDashboard = () => {
    navigate("/super-admin/users");
  };

  if (loading) {
    return (
      <div className="loader-container">
        <HashLoader color="#092339" />
      </div>
    );
  }

  return (
    <div className="user-detail-container">
      <ToastNotification />
      <header className="user-detail-header">
        <h1>#{userId}</h1>
        <div>
          <button
            className="user-detail-action-button"
            onClick={handleBackToDashboard}
          >
            Quay lại
          </button>
        </div>
      </header>

      <div className="user-detail-profile-section">
        <div className="user-detail-profile-card">
          <img
            src={userData?.profileImg}
            alt="Profile"
            className="user-detail-profile-image"
          />
          <h2 className="user-detail-user-name">{userData?.username}</h2>
          <p className="user-detail-user-username">{userData?.email}</p>

          <div
            className={`user-detail-status-badge user-detail-status-${userData?.status}`}
          >
            {userStatusText(userData?.status)}
          </div>

          <div
            className={`user-detail-user-rank user-detail-rank-${userData?.rank}`}
          >
            <div className="user-detail-rank-container">
              <img
                className="user-rank-icon"
                src={getUserRankImageURL(userData?.rank) || null}
                alt="User Rank"
              />
              <p>{userRankText(userData?.rank)}</p>
            </div>
          </div>

          <div className="user-detail-edit-button">
            <button
              className="user-detail-action-button"
              onClick={handleEditProfile}
            >
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        <div className="user-detail-profile-info">
          <div className="user-detail-info-section">
            <h2>Thông tin cơ bản</h2>
            <div className="user-detail-info-grid">
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Họ và tên</div>
                <div className="user-detail-info-value">
                  {userData?.fullName || "Chưa cung cấp"}
                </div>
              </div>
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Email</div>
                <div className="user-detail-info-value">{userData?.email}</div>
              </div>
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Số điện thoại</div>
                <div className="user-detail-info-value">
                  {userData?.phone || "Chưa cung cấp"}
                </div>
              </div>
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Vai trò</div>
                <div className="user-detail-info-value">
                  {userData?.role.charAt(0).toUpperCase() +
                    userData?.role.slice(1)}
                </div>
              </div>
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Thành viên từ</div>
                <div className="user-detail-info-value">
                  {new Date(userData?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="user-detail-info-section user-detail-financial-section">
            <h2>Thông tin tài chính</h2>
            <div className="user-detail-financial-grid">
              <div className="user-detail-financial-card">
                <div className="user-detail-financial-label">
                  Số dư hiện tại
                </div>
                <div className="user-detail-financial-value">
                  {userData?.balance.toLocaleString()}đ
                </div>
              </div>
              <div className="user-detail-financial-card">
                <div className="user-detail-financial-label">
                  Tổng tiền đã nạp
                </div>
                <div className="user-detail-financial-value">
                  {userData?.total_amount_deposited.toLocaleString()}đ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
