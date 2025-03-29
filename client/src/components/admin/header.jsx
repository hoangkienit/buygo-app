import React, { useState, useRef, useEffect } from "react";
import { TiThMenu } from "react-icons/ti";
import "./../../styles/admin.css";
import { useUser } from "../../context/UserContext";
import { IoLogOutSharp } from "react-icons/io5";

export const AdminHeader = ({ isSidebarOpen, setSidebarOpen }) => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  // ✅ Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <header className="admin-header">
      <a className="toggle-menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
        <TiThMenu />
      </a>
      <h2>Quản lý</h2>

      {/* Admin Profile & Dropdown */}
      <div className="admin-profile-container" ref={modalRef}>
        <a className="admin-profile" onClick={() => setIsModalOpen(!isModalOpen)}>
          <span className="username">{user?.username }</span>
          <img className="user-img" src={user?.profileImg} alt="user-avatar" />
        </a>

        {/* Logout Modal */}
        {isModalOpen && (
          <div className="admin-dropdown">
            <a href="/logout" className="logout-button-container">
              <IoLogOutSharp className="logout-icon" />
              <p className="logout-text">Đăng xuất</p>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
