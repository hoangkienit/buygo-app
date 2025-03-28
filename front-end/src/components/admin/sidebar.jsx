import React, { useState } from 'react'
import './../../styles/admin.css'
import LOGO from './../../assets/images/BUYGO_LOGO.png'
import { AiFillHome } from "react-icons/ai";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";
import { IoReceipt } from "react-icons/io5";

export const Sidebar = ({isSidebarOpen}) => {
    
    return (
        <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <div className='sidebar-logo-container'>
                <img className='sidebar-logo' src={LOGO} alt='logo'/>
            </div>
            <div className='sidebar-feature-container'>
                <nav className='nav-selection-container'>
                <a href="/admin" className='nav-selection-item'>
                    <div className='nav-selection-icon-container'>
                        <AiFillHome />
                        <p className='nav-selection-text'>Trang chủ</p>
                    </div>
                    {/* <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                    </div> */}
                </a>
                </nav>
            </div>
            <div className='sidebar-feature-container'>
                <h3 className='feature-title'>Chức năng chính</h3>
                <nav className='nav-selection-container'>
                <a href="/admin" className='nav-selection-item'>
                    <div className='nav-selection-icon-container'>
                        <BsCreditCard2FrontFill />
                        <p className='nav-selection-text'>Giao dịch nạp tiền</p>
                    </div>
                    <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                    </div>
                </a>
                <a href="/admin" className='nav-selection-item'>
                    <div className='nav-selection-icon-container'>
                        <AiFillProduct />
                        <p className='nav-selection-text'>Sản phẩm</p>
                    </div>
                    {/* <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                    </div> */}
                </a>
                <a href="/admin" className='nav-selection-item'>
                    <div className='nav-selection-icon-container'>
                        <IoReceipt />
                        <p className='nav-selection-text'>Đơn hàng</p>
                    </div>
                    <div className='nav-selection-notification'>
                        <p className='notification-count'>1</p>
                    </div>
                </a>
                </nav>
            </div>
        </aside>
    )
}
