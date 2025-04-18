import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useUser } from '../../context/UserContext';
import socket from '../../services/socket';
import { showTopCenterToast } from '../toasts/ToastNotification';
import { playNotificationSound } from '../../utils/audio';
import { MdEmail } from "react-icons/md";

export const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const isMobile = () => window.innerWidth <= 768;
  const { user } = useUser();

  // Retrieve notifications from localStorage on mount
  const getStoredNotifications = () => {
    const storedNotifications = localStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : { payment: 0, orders: 0, reviews: 0 };
  };

  const [notifications, setNotifications] = useState(getStoredNotifications);

  const handleNewTransaction = useCallback(({ type, count }) => {
    showTopCenterToast("Có một giao dịch nạp tiền mới", "success");
    playNotificationSound();
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications, [type]: (prevNotifications[type] || 0) + count };

      // Save updated notifications to localStorage
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

      return updatedNotifications;
    });
  }, []);

  const handleNewOrder = useCallback(({ type, count }) => {
    showTopCenterToast("Có một đơn hàng mới", "success");
    playNotificationSound();
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications, [type]: (prevNotifications[type] || 0) + count };

      // Save updated notifications to localStorage
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

      return updatedNotifications;
    });
  }, []);


  useEffect(() => {
    if (user?.role === 'admin' && socket) {
      socket.connect();
      socket.emit("admin_join", user?.id);
      
      socket.on("new_transaction", handleNewTransaction);
      socket.on("new_order", handleNewOrder);

      return () => {
        socket.off("new_transaction", handleNewTransaction);
        socket.off("new_order", handleNewOrder);
        socket.disconnect();
      };
    }
  }, [user?.role, socket]);

  const resetNotification = (path) => {
    const notificationResetMap = {
      "/super-admin/payment": "payment",
      "/super-admin/orders": "orders",
      "/super-admin/reviews": "reviews",
    };

    const matchedKey = Object.keys(notificationResetMap).find((key) => 
      path.includes(key)
    );

    if (matchedKey) {
      setNotifications((prev) => {
        const updatedNotifications = { ...prev, [notificationResetMap[matchedKey]]: 0 };

        // Save reset notifications to localStorage
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

        return updatedNotifications;
      });
    }
  };

  useEffect(() => {
    resetNotification(location.pathname);
  }, [location.pathname]);

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
      notificationKey: "payment"
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
      notificationKey: "orders"
    },
    {
      to: "/super-admin/users",
      icon: <FaUserAlt />,
      label: "Người dùng"
    },
    {
      to: "/super-admin/emails",
      icon: <MdEmail />,
      label: "Email"
    },
    {
      to: "/super-admin/discounts",
      icon: <BsFillGiftFill />,
      label: "Mã giảm giá"
    },
    {
      to: "/super-admin/reviews",
      icon: <BiSolidCommentDetail />,
      label: "Đánh giá",
      notificationKey: "reviews"
    },
    {
      to: "/super-admin/analytics",
      icon: <MdAnalytics />,
      label: "Phân tích"
    },
    {
      to: "/super-admin/employees",
      icon: <RiTeamFill />,
      label: "Quản lí nhân viên"
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
        {/* <h3 className="feature-title">Chức năng chính</h3> */}
        <nav className="nav-selection-container">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`nav-selection-item ${isActive(link.to) ? "admin-active" : ""}`}
              onClick={handleLinkClick}
            >
              <div className="nav-selection-icon-container">
                {link.icon}
                <p className="nav-selection-text">{link.label}</p>
              </div>
              {link.notificationKey && notifications[link.notificationKey] > 0 &&  (
                <div className="nav-selection-notification">
                  <p className="notification-count">{notifications[link.notificationKey]}</p>
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className='sidebar-author-container'>
          <p className='author-text'>© {new Date().getFullYear()} Hệ thống quản lý</p>
      </div>
    </aside>
  );
};
