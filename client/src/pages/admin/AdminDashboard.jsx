import React, { useEffect } from 'react'

export const AdminDashboard = () => {
    useEffect(() => {
      document.title = 'Admin - Trang chủ';
    }, []);
  return (
    <div className='app'>
        <h1> hello world</h1>
    </div>
  )
}
