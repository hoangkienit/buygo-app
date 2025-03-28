import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./../styles/admin.css"; // Import CSS file
import { Sidebar } from "../components/admin/sidebar";
import { AdminHeader } from "../components/admin/header";


const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="admin-container">
      {/* Sidebar */}
          <Sidebar isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <div className="main-area">
            {/* Header */}
            <AdminHeader isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>

            {/* Page Content */}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    </div>
  );
};

export default AdminLayout;
