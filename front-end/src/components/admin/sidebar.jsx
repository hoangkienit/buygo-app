import React, {useEffect, useRef} from 'react';
import { Link, useLocation } from 'react-router-dom';
import './../../styles/admin.css';
import LOGO from './../../assets/images/BUYGO_LOGO.png';
import { AiFillHome } from "react-icons/ai";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import { IoReceipt } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { BsFillGiftFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { BiSolidCommentDetail } from "react-icons/bi";
import { MdAnalytics } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { BsBoxSeamFill } from "react-icons/bs";

export const Sidebar = ({ isSidebarOpen}) => {
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
        const sidebarElement = document.querySelector('.sidebar');
        if (sidebarElement) {
            sidebarElement.classList.remove("open");
            sidebarElement.classList.add("closed");
        }
    };

    return (
        <aside ref={isMobile() ? sidebarRef : null} className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <div className='sidebar-logo-container'>
                <img className='sidebar-logo' src={LOGO} alt='logo' />
            </div>

            <div className='sidebar-feature-container'>
                <nav className='nav-selection-container'>
                    <Link to="/super-admin/dashboard" className={`nav-selection-item ${location.pathname === "/super-admin/dashboard" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <AiFillHome />
                            <p className='nav-selection-text'>Trang chủ</p>
                        </div>
                        {/* <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                        </div> */}
                    </Link>
                </nav>
            </div>

            <div className='sidebar-feature-container'>
                <h3 className='feature-title'>Chức năng chính</h3>
                <nav className='nav-selection-container'>
                    <Link to="/super-admin/payment" className={`nav-selection-item ${location.pathname === "/super-admin/payment" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <BsCreditCard2FrontFill />
                            <p className='nav-selection-text'>Giao dịch nạp tiền</p>
                        </div>
                        <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                        </div>
                    </Link>

                    <Link to="/super-admin/products" className={`nav-selection-item ${location.pathname === "/super-admin/products" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <BsBoxSeamFill />
                            <p className='nav-selection-text'>Sản phẩm</p>
                        </div>
                        {/* <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                        </div> */}
                    </Link>

                    <Link to="/super-admin/orders" className={`nav-selection-item ${location.pathname === "/super-admin/orders" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <IoReceipt />
                            <p className='nav-selection-text'>Đơn hàng</p>
                        </div>
                        <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                        </div>
                    </Link>

                    <Link to="/super-admin/users" className={`nav-selection-item ${location.pathname === "/super-admin/users" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <FaUserAlt />
                            <p className='nav-selection-text'>Người dùng</p>
                        </div>
                    </Link>

                    <Link to="/super-admin/giftcodes" className={`nav-selection-item ${location.pathname === "/super-admin/giftcodes" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <BsFillGiftFill />
                            <p className='nav-selection-text'>Giftcode</p>
                        </div>
                    </Link>
                </nav>
            </div>

            <div className='sidebar-feature-container'>
                <h3 className='feature-title'>Chức năng khác</h3>
                <nav className='nav-selection-container'>
                    <Link to="/super-admin/employees" className={`nav-selection-item ${location.pathname === "/super-admin/employees" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <RiTeamFill />
                            <p className='nav-selection-text'>Quản lí thành viên</p>
                        </div>
                    </Link>

                    <Link to="/super-admin/ratings" className={`nav-selection-item ${location.pathname === "/super-admin/ratings" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <BiSolidCommentDetail />
                            <p className='nav-selection-text'>Đánh giá</p>
                        </div>
                        <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                        </div>
                    </Link>

                    <Link to="/super-admin/analytics" className={`nav-selection-item ${location.pathname === "/super-admin/analytics" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <MdAnalytics />
                            <p className='nav-selection-text'>Phân tích</p>
                        </div>
                        {/* <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                        </div> */}
                    </Link>

                    <Link to="/super-admin/settings" className={`nav-selection-item ${location.pathname === "/super-admin/settings" ? "active" : ""}`} onClick={handleLinkClick}>
                        <div className='nav-selection-icon-container'>
                            <IoSettings />
                            <p className='nav-selection-text'>Cài đặt</p>
                        </div>
                    </Link>
                </nav>
            </div>
        </aside>
    );
};
