// src/layouts/MainLayout.js
import { Link, Outlet } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import ChatButton from "../components/chat-button/ChatButton";
import BottomNavbar from "../components/bottom-navbar/bottom-navbar";

const MainLayout = () => {
  return (
    <div className="container">
      {/* Sidebar
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <Link to="/">🏠 Home</Link>
          <Link to="/profile">👤 Profile</Link>
          <Link to="/settings">⚙️ Settings</Link>
        </nav>
      </aside> */}

      {/* Main Content */}
        <main className="content">
          <Header/>
          <Outlet />
          <Footer />
          <ChatButton />
          <BottomNavbar/>
        </main>
    </div>
  );
};

export default MainLayout;
