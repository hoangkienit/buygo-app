import React, { useState } from "react";
import "./add-discount-modal.css";
import { ClipLoader } from "react-spinners";
import { showToast } from "../toasts/ToastNotification";

const AddDiscountModal = ({ isOpen, onClose, message, title }) => {
  const [selectedOption, setSelectedOption] = useState("percentage");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPurchase, setMinPurchase] = useState(0);
  const [limitUsage, setLimitUsage] = useState(0);

  if (!isOpen) return null;

  const handleAddDiscount = async () => {
    setLoading(true);

    if (amount <= 0) {
      setLoading(false);
      showToast("Giá trị phải lớn hơn 0", "error");
      return;
    }

    if (selectedOption === "percentage" && amount > 100) {
      setLoading(false);
      showToast("Phần trăm không được lớn hơn 100%", "error");
      return;
    }

    if (!startDate || !endDate) {
      setLoading(false);
      showToast("Vui lòng chọn ngày", "error");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setLoading(false);
      showToast("Ngày kết thúc không được trước ngày bắt đầu", "error");
      return;
    }

    if (limitUsage <= 0) {
      setLoading(false);
      showToast("Số lần sử dụng phải lớn hơn 0", "error");
      return;
    }

    if (minPurchase <= 0) {
      setLoading(false);
      showToast("Đơn hàng tối thiểu phải lớn hơn 0", "error");
      return;
    }
    try {
      const res = null;

      if (res.success) {
        showToast("Chỉnh sửa số dư thành công", "success");
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
        <select
          className="modal-selected-option"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option className={`selected-option`} value={"percentage"}>
            Phần trăm
          </option>
          <option className={`selected-option`} value={"fixed"}>
            Giá cố định
          </option>
        </select>
        <input
          className="balance-input"
          type="text"
          value={amount.toLocaleString()}
          placeholder="Nhập số tiền"
          onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")))}
        />
        <div className="discount-item-card">
          <p>Ngày bắt đầu</p>
          <input
            className="date-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="discount-item-card">
          <p>Ngày kết thúc</p>
          <input
            className="date-input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="discount-item-card">
          <p>Đơn hàng tối thiểu</p>
          <input
            className="date-input"
            type="text"
            value={minPurchase.toLocaleString() || 0}
            onChange={(e) =>
              setMinPurchase(Number(e.target.value.replace(/\D/g, "")))
            }
          />
        </div>
        <div className="discount-item-card">
          <p>Giới hạn sử dụng (số lần)</p>
          <input
            className="date-input"
            type="number"
            value={limitUsage}
            onChange={(e) =>
              setLimitUsage(Number(e.target.value.replace(/\D/g, "")))
            }
          />
        </div>
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

export default AddDiscountModal;
