import React from 'react'
import { TiThMenu } from "react-icons/ti";
import './../../styles/admin.css'

export const AdminHeader = ({isSidebarOpen, setSidebarOpen}) => {
  return (
    <header className="admin-header">
        <a className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <TiThMenu />
        </a>
          <h2>Admin Panel</h2>
          <div className="admin-profile">
            <span className="username">Hello, Admin</span>
            <button className="logout-btn">Logout</button>
          </div>
        </header>
  )
}
