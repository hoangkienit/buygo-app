import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { HashLoader } from 'react-spinners';
import { deleteOrderForAdmin, getOrderForAdmin } from '../../api/order.api';
import './admin-order-detail.css'
import { FaCheckCircle } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { OrderStepper } from '../../components/stepper/OrderStepper';
import ConfirmModal from '../../components/modal/confirm-modal';

export const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin - Chi tiết đơn hàng';
    fetchOrder();
    console.log(order)
  }, [orderId]);
  
  
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderForAdmin(orderId);

      if (res?.success) {
        setOrder(res.data.order || null);
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  const order_package = order?.product?.product_attributes?.packages?.find(
  (pack) => String(pack._id) === String(order?.order_attributes?.packageId)
  );
  
  const handleDeleteOrder = async () => {
          setLoading(true);
          setIsModalOpen(false);
          try {
              const res = await deleteOrderForAdmin(orderId);
  
              if (res?.success) {
                  showToast("Xóa đơn hàng thành công", "success");
                navigate('/super-admin/orders');
              }
          } catch (error) {
              showToast(error.message, "success");
          }
          finally {
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
      <ToastNotification />
      <ConfirmModal
                    isOpen={isModalOpen}
                    onConfirm={() => handleDeleteOrder()}
                    onClose={() => setIsModalOpen(false)}
                    message={'Xác nhận bạn đang xóa một đơn hàng'}
                    title={'Xóa đơn hàng'} />
      <span className='tab-nav-title'><a href='/super-admin/orders'>Danh sách đơn hàng</a> / {order?.orderId}</span>
      <div className='order-container'>
        <div className='order-left'>
          <div className='order-header-container'>
            <p className='order-detail-orderId'>Đơn hàng #{order?.orderId}</p>
            <div className='admin-action-buttons-container'>
              <button onClick={() => setIsModalOpen(true)} className='admin-action-button delete-button'><MdDelete className='admin-action-icon'/></button>
              <button className='admin-action-button failed-button'><FaBan className='admin-action-icon'/></button>
              <button className='admin-action-button success-button'><FaCheckCircle className='admin-action-icon'/></button>
            </div>
          </div>
          <OrderStepper currentStep={1} order_status={order?.order_status} />
          <div className='user-product-container'>
            <div className='user-info-container'>
              <img className='order-detail-user-avatar' src={order?.userId?.profileImg} alt='user-avatar'></img>
              <div className='name-container'>
                <p className='order-detail-username'>{order?.userId.username}</p>
                <button className='view-user-detail-button'>Xem thông tin</button>
              </div>
            </div>
            <div className='order-detail-product-container'>
              <img className='order-detail-product-image' src={order?.product?.product_imgs[0]} alt='product-img'></img>
              <div className='order-detail-name-container'>
                <p className='order-detail-username'>{order?.product?.product_name}</p>
                {order?.order_type === 'topup_package' && <p className='order-attribute-text'>{order_package.name}</p>}
                {order?.order_type === 'utility_account' &&
                  <>
                  <p className='order-attribute-text'>{order?.order_attributes?.username}</p>
                  <p className='order-attribute-text'>{order?.order_attributes?.password}</p>
                  </>
                }
              </div>
            </div>
          </div>
          
        </div>
        <div className='order-right'>
          <div className='order-log-container'>
            <p className='order-log'>
              Đơn hàng được tạo vào lúc <span className='order-time'>{new Date(order?.createdAt).toLocaleString()}</span></p>
            <p className='order-log'>
              Đơn hàng cập nhật vào lúc <span className='order-time'>{new Date(order?.updatedAt).toLocaleString()}</span></p>
            <p className='order-log'>
              Đơn hàng được xử lí bởi <span className='order-time'>{order?.processed_by || ""}</span></p>
            
            <div className='order-summary-container'>
              <div className="order-summary-line">
            <span>Tạm tính:</span>
            <span>{order?.order_amount?.toLocaleString()}đ</span>
            </div>
            <div className="order-summary-line">
            <span>Giảm giá:</span>
            <span>-{0}đ</span>
            </div>
            <div className="order-summary-total">
            <strong>Tổng đã thanh toán:</strong>
            <strong>{order?.order_amount?.toLocaleString()}đ</strong>
            </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
