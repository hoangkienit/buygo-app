import React, { useState } from "react";
import "./add-discount-modal.css";
import { ClipLoader } from "react-spinners";
import { showToast } from "../toasts/ToastNotification";
import { createDiscountForAdmin } from "../../api/discount.api";

const AddEmailModal = ({
  isOpen,
  onClose,
  message,
  title,
}) => {

    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleAddDiscount = async () => {
    setLoading(true);
    try {
        const res = null;

      if (res.success) {
        showToast("Thêm mã giảm giá thành công", "success");
        
        onClose();
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">
          {message || "Are you sure you want to proceed?"}
        </p>
        <input
          className="balance-input"
          type="text"
          value={password}
          placeholder="Nhập mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="modal-buttons">
          <button
            disabled={loading}
            className={`modify-balance-cancel-btn ${
              loading && "disabled-button"
            }`}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            onClick={handleAddDiscount}
            disabled={loading}
            className={`modify-balance-confirm-btn ${
              loading && "disabled-button"
            }`}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmailModal;
