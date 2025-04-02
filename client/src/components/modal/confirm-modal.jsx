import React, { useState } from "react";
import "./confirm-modal.css";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, title }) => {
    if (!isOpen) return null;


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{ title}</h2>
                <p className="modal-message">{message || "Are you sure you want to proceed?"}</p>
                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={onClose}>Hủy</button>
                    <button className="confirm-btn" onClick={onConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;