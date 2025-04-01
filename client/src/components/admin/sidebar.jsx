import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './../../styles/admin.css';
import LOGO from './../../assets/images/BUYGO_LOGO.png';
import { AiFillHome } from "react-icons/ai";
import { BsCreditCard2FrontFill, BsBoxSeamFill, BsFillGiftFill } from "react-icons/bs";
import { IoReceipt, IoSettings } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { BiSolidCommentDetail } from "react-icons/bi";
import { MdAnalytics } from "react-icons/md";

export const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const isMobile = () => window.innerWidth <= 768;

  useEffect(() => {
    if (!isMobile()) return;
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const sidebarElement = document.querySelector('.sidebar');
        sidebarElement.classList.remove("open");
        sidebarElement.classList.add("closed");
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLinkClick = () => {
    if (!isMobile()) return;
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
      sidebarElement.classList.remove("open");
      sidebarElement.classList.add("closed");
    }
  };

  const links = [
    {
      to: "/super-admin/dashboard",
      icon: <AiFillHome />,
      label: "Trang chủ"
    },
    {
      to: "/super-admin/payment",
      icon: <BsCreditCard2FrontFill />,
      label: "Giao dịch nạp tiền",
      notification: "1"
    },
    {
      to: "/super-admin/products",
      icon: <BsBoxSeamFill />,
      label: "Sản phẩm"
    },
    {
      to: "/super-admin/orders",
      icon: <IoReceipt />,
      label: "Đơn hàng",
      notification: "1"
    },
    {
      to: "/super-admin/users",
      icon: <FaUserAlt />,
      label: "Người dùng"
    },
    {
      to: "/super-admin/giftcodes",
      icon: <BsFillGiftFill />,
      label: "Giftcode"
    },
    {
      to: "/super-admin/employees",
      icon: <RiTeamFill />,
      label: "Quản lí thành viên"
    },
    {
      to: "/super-admin/ratings",
      icon: <BiSolidCommentDetail />,
      label: "Đánh giá",
      notification: "1"
    },
    {
      to: "/super-admin/analytics",
      icon: <MdAnalytics />,
      label: "Phân tích"
    },
    {
      to: "/super-admin/settings",
      icon: <IoSettings />,
      label: "Cài đặt"
    }
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-logo-container">
        <img className="sidebar-logo" src={LOGO} alt="logo" />
      </div>

      <div className="sidebar-feature-container">
        <h3 className="feature-title">Chức năng chính</h3>
        <nav className="nav-selection-container">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`nav-selection-item ${isActive(link.to) ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <div className="nav-selection-icon-container">
                {link.icon}
                <p className="nav-selection-text">{link.label}</p>
              </div>
              {link.notification && (
                <div className="nav-selection-notification">
                  <p className="notification-count">{link.notification}</p>
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

