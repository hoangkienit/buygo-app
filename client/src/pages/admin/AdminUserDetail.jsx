// UserDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import './admin-user-detail.css';
import { useParams } from 'react-router-dom';
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { getUser } from '../../api/user.api';
import { HashLoader } from 'react-spinners';


export const AdminUserDetail = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        document.title = `Admin - ${userId}`;
        fetchUser();
    }, []);

    const fetchUser = async () => {
        setLoading(true);

        try {
            const res = await getUser(userId);

            if (res?.success) {
                setUserData(res.data.user || null);
                console.log(res);
            }
        } catch (error) {
            showToast(error.message, "error");
        }
        finally {
            setLoading(false);
        }
    }

  // Function to handle editing the profile (placeholder)
  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // Implement your edit logic here
  };

  // Function to navigate back to dashboard (placeholder)
  const handleBackToDashboard = () => {
    console.log("Back to dashboard clicked");
    // Implement your navigation logic here
    };
    
    if (loading) {
    return (
      <div className="loader-container">
        <HashLoader color="#092339" />
      </div>
    );
  }

  return (
      <div className="user-detail-container">
          <ToastNotification/>
      <header className="user-detail-header">
        <h1>User Profile</h1>
        <div>
          <button className="user-detail-action-button" onClick={handleBackToDashboard}>Quay lại</button>
        </div>
      </header>
      
      <div className="user-detail-profile-section">
        <div className="user-detail-profile-card">
          <img 
            src={userData?.profile_imgs[0]} 
            alt="Profile" 
            className="user-detail-profile-image" 
          />
          <h2 className="user-detail-user-name">{userData?.fullName}</h2>
          <p className="user-detail-user-username">@{userData?.username}</p>
          
          <div className={`user-detail-status-badge user-detail-status-${userData?.status}`}>
            {userData?.status + userData?.status}
          </div>
          
          <div className={`user-detail-user-rank user-detail-rank-${userData?.rank}`}>
            {userData?.rank + userData?.rank}
          </div>
          
          <div className="user-detail-edit-button">
            <button className="user-detail-action-button" onClick={handleEditProfile}>Edit Profile</button>
          </div>
        </div>
        
        <div className="user-detail-profile-info">
          <div className="user-detail-info-section">
            <h2>Basic Information</h2>
            <div className="user-detail-info-grid">
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Email</div>
                <div className="user-detail-info-value">{userData?.email}</div>
              </div>
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Phone</div>
                <div className="user-detail-info-value">{userData?.phone || "Not provided"}</div>
              </div>
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Role</div>
                <div className="user-detail-info-value">
                  {userData?.role.charAt(0).toUpperCase() + userData?.role.slice(1)}
                </div>
              </div>
              <div className="user-detail-info-item">
                <div className="user-detail-info-label">Member Since</div>
                <div className="user-detail-info-value">{userData?.createdAt}</div>
              </div>
            </div>
          </div>
          
          <div className="user-detail-info-section user-detail-financial-section">
            <h2>Financial Information</h2>
            <div className="user-detail-financial-grid">
              <div className="user-detail-financial-card">
                <div className="user-detail-financial-label">Current Balance</div>
                <div className="user-detail-financial-value">${userData?.balance.toLocaleString()}</div>
              </div>
              <div className="user-detail-financial-card">
                <div className="user-detail-financial-label">Total Deposited</div>
                <div className="user-detail-financial-value">${userData?.total_amount_deposited.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

