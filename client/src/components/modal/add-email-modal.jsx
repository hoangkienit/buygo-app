import React, { useState } from "react";
import "./add-discount-modal.css";
import { ClipLoader } from "react-spinners";
import { showToast } from "../toasts/ToastNotification";
import { createNewEmailForAdmin } from "../../api/gmail.api";

const AddEmailModal = ({ isOpen, onClose, message, title, setEmails }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleAddEmail = async () => {
    setLoading(true);
    try {
      const res = await createNewEmailForAdmin();

      if (res.success) {
        const newEmail = res.data.newEmail;
        showToast("Thêm email thành công", "success");
          setEmails((prev) => [
              newEmail,
              ...prev
        ]);
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
            onClick={handleAddEmail}
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
