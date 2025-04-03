import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./../styles/admin.css"; // Import CSS file
import { Sidebar } from "../components/admin/sidebar";
import { AdminHeader } from "../components/admin/header";
import { useUser } from "../context/UserContext";
import ToastNotification from "../components/toasts/ToastNotification";


const AdminLayout = () => {
  const { user } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  

  if (user.role !== 'admin') {
    return <Navigate to={'/unauthorized'}/>
  }


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
      <ToastNotification/>
    </div>
  );
};

export default AdminLayout;
