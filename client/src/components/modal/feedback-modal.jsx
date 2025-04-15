import React, { useState } from "react";
import "./feedback-modal.css";
import { IoClose } from "react-icons/io5";
import { showToast } from "../toasts/ToastNotification";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const handleRating = (val) => {
    setRating(val);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    if (message.trim() === "") {
      setError({ message: "Không được để trống đánh giá" });
      return;
      }
      
      if (message.trim().length > 300) {
          setError({ message: "Đánh giá tối đa là 300 ký tự" });
        return;
      } else if (message.trim().length < 50) {
          setError({ message: "Đánh giá tối thiểu là 50 ký tự" });
        return;
      }
    console.log({ rating, message });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="modal-header">
          <h2>Gửi cho chúng tôi đánh giá của bạn</h2>
          <button className="feedback-modal-close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="rating-section">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? "filled" : ""}`}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="feedback-textarea"
          placeholder="Hãy để lại trải nghiệm của bạn về đơn hàng..."
          value={message}
          minlength="50"
          maxlength="300"
          required
          onChange={(e) => setMessage(e.target.value)}
        />
        <p className="char-count">{message.length} / 300 ký tự</p>
        {error && (
          <p className="feedback-modal-error-message">*{error?.message}</p>
        )}
        <button className="submit-btn" onClick={handleSubmit}>
          Gửi đánh giá
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
