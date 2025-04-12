import React, { useState } from "react";
import "./modify-user-balance.css";
import { ClipLoader } from "react-spinners";
import { showToast } from "../toasts/ToastNotification";
import { modifyUserBalanceForAdmin } from "../../api/user.api";

const ModifyUserBalanceModal = ({userId, isOpen, onClose, message, title }) => {
    const [selectedOption, setSelectedOption] = useState("add");
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleModifyBalance = async() => {
        setLoading(true);

        if (amount <= 0) {
            setLoading(false);
            showToast("Số tiền phải lớn hơn 0", 'error');
            return;
        }
        try {
            const res = await modifyUserBalanceForAdmin(userId, selectedOption, amount);

            if (res.success) {
                showToast("Chỉnh sửa số dư thành công", "success");
                onClose();
            }
        } catch (error) {
            showToast(error.message, "error");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{ title}</h2>
                <p className="modal-message">{message || "Are you sure you want to proceed?"}</p>
                <select className="modal-selected-option" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                    <option className={`selected-option ${selectedOption === 'add' && 'display-selected'}`} value={'add'}>Thêm số dư</option>
                    <option className={`selected-option ${selectedOption === 'sub' && 'display-selected'}`} value={'sub'}>Trừ số dư</option>
                </select>
                <input
                    className="balance-input"
                    type="text"
                    value={amount.toLocaleString()}
                    placeholder="Nhập số tiền"
                    onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')))}
                />
                <div className="modal-buttons">
                    <button disabled={loading} className={`modify-balance-cancel-btn ${loading && "disabled-button"}`} onClick={onClose}>Hủy</button>
                    <button onClick={handleModifyBalance} disabled={loading} className={`modify-balance-confirm-btn ${loading && "disabled-button"}`}>
                        {loading ? <ClipLoader size={20} color="#fff" /> : "Chỉnh sửa"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModifyUserBalanceModal;