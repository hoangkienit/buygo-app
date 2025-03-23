import { useState } from "react";
import { FaComments, FaFacebookMessenger, FaPhoneAlt } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import './chat-button.css'

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-container">
      {/* Floating Chat Button */}
      <div className="chat-button" onClick={togglePopup}>
        <FaComments className="chat-icon" />
        <span className="chat-text">Chat ngay</span>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chat-popup">
          <a
            href="https://zalo.me/yourZaloID"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-option"
          >
            <SiZalo className="chat-option-icon" />
            Liên hệ qua Zalo
          </a>
          <a
            href="https://m.me/yourMessengerID"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-option"
          >
            <FaFacebookMessenger className="chat-option-icon" />
            Liên hệ qua Messenger
          </a>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-option"
          >
            <FaPhoneAlt className="chat-option-icon" />
            0903148910
          </a>
        </div>
      )}
    </div>
  );
};

export default ChatButton;
