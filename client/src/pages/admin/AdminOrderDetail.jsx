import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ToastNotification from '../../components/toasts/ToastNotification';
import { HashLoader } from 'react-spinners';
import { getOrderForAdmin } from '../../api/order.api';

export const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    document.title = 'Admin - Chi tiết đơn hàng';
    fetchOrder();
  }, [orderId]);
  
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderForAdmin(orderId);

      if (res?.success) {
        console.log(res.data.order);
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loader-container">
      <HashLoader color="#092339"/>
    </div>
  } 
  return (
    <div className='order-detail-container'>
      <ToastNotification/>
      AdminOrderDetail {orderId}
    </div>
  )
}
