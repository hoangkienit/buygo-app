// EditProfilePage.jsx
import React, { useState, useEffect } from "react";
import "./admin-edit-user.css";
import { getUser, updateUserForAdmin } from "../../api/user.api";
import ToastNotification, {
  showToast,
} from "../../components/toasts/ToastNotification";
import { useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import ModifyUserBalanceModal from "../../components/modal/modify-user-balance";

export const AdminEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  // State for form validation
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    // Reset states
    setErrors({});

    // Validate form
    let formErrors = {};

    // if (!userData.fullName) {
    //   formErrors.fullName = "Họ tên đầy đủ là bắt buộc";
    // }

    if (!userData.email) {
      formErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      formErrors.email = "Email không hợp lệ";
    }

    if (userData.newPassword && userData.newPassword.length < 6) {
      formErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (
      userData.newPassword &&
      userData.newPassword !== userData.confirmPassword
    ) {
      formErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // If there are errors, show them
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }


    try {
      const res = await updateUserForAdmin(userId, userData);

      if (res?.success) {
        setUserData(res?.data?.updatedUser || null);
        showToast("Cập nhật thành công", "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
    finally{
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate(`/super-admin/users/view/${userId}`);
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
      <ModifyUserBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={'Chỉnh sửa số dư'}
        userId={userId}
        message={'Bạn đang chỉnh sửa số dư cho người dùng'}
      />
      <header className="user-detail-header">
        <h1>Chỉnh sửa hồ sơ</h1>
        <div>
          <button className="user-detail-action-button" onClick={handleCancel}>
            Quay lại hồ sơ
          </button>
        </div>
      </header>

      <form className="user-detail-edit-form" onSubmit={handleSubmit}>
        <div className="user-detail-edit-section">
          <div className="user-detail-avatar-section">
            <img
              src={userData?.profileImg}
              alt="Profile"
              className="user-detail-profile-image"
            />
            {/* <div className="user-detail-upload-btn-wrapper">
              <button className="user-detail-action-button user-detail-upload-btn">
                Change Photo
              </button>
              <input type="file" name="profileImg" onChange={() => console.log("File upload clicked")} />
            </div>
            <p className="user-detail-help-text">Upload a square image for best results</p> */}
            <button onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }} className="user-detail-action-button user-detail-upload-btn">
                Chỉnh sửa số dư
              </button>
          </div>

          <div className="user-detail-form-section">
            <h2>Thông tin cá nhân</h2>

            <div className="user-detail-form-group">
              <label className="user-detail-form-label">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={userData?.fullName}
                onChange={handleChange}
                className={`user-detail-form-input ${
                  errors.fullName ? "user-detail-input-error" : ""
                }`}
              />
              {errors.fullName && (
                <p className="user-detail-error-message">{errors.fullName}</p>
              )}
            </div>

            <div className="user-detail-form-group">
              <label className="user-detail-form-label">Tên người dùng</label>
              <input
                type="text"
                name="username"
                value={userData?.username}
                onChange={handleChange}
                className="user-detail-form-input user-detail-input-disabled"
                disabled
              />
              <p className="user-detail-help-text">
                Tên người dùng không thể thay đổi
              </p>
            </div>

            <div className="user-detail-form-group">
              <label className="user-detail-form-label">Email</label>
              <input
                type="email"
                name="email"
                value={userData?.email}
                onChange={handleChange}
                className={`user-detail-form-input ${
                  errors.email ? "user-detail-input-error" : ""
                }`}
              />
              {errors.email && (
                <p className="user-detail-error-message">{errors.email}</p>
              )}
            </div>

            <div className="user-detail-form-group">
              <label className="user-detail-form-label">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={userData?.phone || "Chưa cập nhật"}
                onChange={handleChange}
                className="user-detail-form-input"
                disabled
              />
              <p className="user-detail-help-text">
                Số điện thoại không thể thay đổi
              </p>
            </div>
          </div>
        </div>

        <div className="user-detail-edit-section">
          <div className="user-detail-form-section user-detail-password-section">
            <h2>Thay đổi mật khẩu</h2>
            <p className="user-detail-section-note">
              Để trống nếu bạn không muốn thay đổi
            </p>


            <div className="user-detail-form-group">
              <label className="user-detail-form-label">Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                value={userData?.newPassword}
                onChange={handleChange}
                className={`user-detail-form-input ${
                  errors.newPassword ? "user-detail-input-error" : ""
                }`}
              />
              {errors.newPassword && (
                <p className="user-detail-error-message">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="user-detail-form-group">
              <label className="user-detail-form-label">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={userData?.confirmPassword}
                onChange={handleChange}
                className={`user-detail-form-input ${
                  errors.confirmPassword ? "user-detail-input-error" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="user-detail-error-message">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="user-detail-form-actions">
          <button
            type="button"
            className="user-detail-secondary-button"
            onClick={handleCancel}
          >
            Hủy bỏ
          </button>
          <button type="submit" className="user-detail-action-button">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};
