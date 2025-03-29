import React, { useState, useEffect } from "react";
import "./confirm-box.css";
import { IoWarningSharp } from "react-icons/io5";

const ConfirmationModal = ({ message, onClose, onConfirm }) => {
  const [countdown, setCountdown] = useState(5);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setIsDisabled(false); // Enable button when countdown reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <IoWarningSharp className="modal-icon"/>
        <p className="modal-message">{message}</p>
        <div className="buttons">
          <button onClick={onClose} className="cancel">Quay lại</button>
          <button onClick={onConfirm} disabled={isDisabled} className="ok">Hủy {countdown > 0 ? `(${countdown})` : ""}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
