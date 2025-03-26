import React, { useEffect } from "react";
import "../styles/logout.css";
import { HashLoader } from "react-spinners";
import { logout } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
    const { removeUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Đăng xuất';
        logOutUser();
    }, []);

    const logOutUser = async() => {
        const res = await logout();

        if (res.success) {
            removeUser();
            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
    }
  return (
    <div className="logout-container">
      <HashLoader size={50} color="#fff"></HashLoader>
    </div>
  );
};

export default Logout;