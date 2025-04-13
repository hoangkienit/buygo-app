import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { HashLoader } from 'react-spinners';
import { deleteOrderForAdmin, getOrderForAdmin, markAsFailedForAdmin, markAsSuccessForAdmin } from '../../api/order.api';
import './admin-order-detail.css'
import { FaCheckCircle } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { OrderStepper } from '../../components/stepper/OrderStepper';
import ConfirmModal from '../../components/modal/confirm-modal';
import { orderStatusStep } from '../../utils';
import { useUser } from '../../context/UserContext';

export const AdminOrderDetail = () => {
  const { user } = useUser();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin - Chi tiết đơn hàng';
    fetchOrder();
  }, [orderId]);
  
  
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderForAdmin(orderId);

      if (res?.success) {
        setOrder(res?.data?.order || null);
        setCurrentStep(orderStatusStep(res?.data?.order?.order_status));
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
  
  const markAsSuccessOrder = async () => {
    setLoading(true);
    try {
      const res = await markAsSuccessForAdmin(orderId, user?._id);
  
      if (res?.success) {
        showToast("Bạn đã hoàn thành đơn", "success");
        setCurrentStep(orderStatusStep(res?.data?.order_status));
        setOrder({
          ...order,
          order_status: res?.data?.order_status,
          processed_by: res?.data?.processed_by
        });
      }
    } catch (error) {
      showToast(error.message, "error");
    }
    finally {
      setLoading(false);
    }
  }

  const markAsFailedOrder = async () => {
    setLoading(true);
    try {
      const res = await markAsFailedForAdmin(orderId, user?._id);
  
      if (res?.success) {
        showToast("Bạn đã hủy đơn", "warn");
        setCurrentStep(orderStatusStep(res?.data?.order_status));
        setOrder({
          ...order,
          order_status: res?.data?.order_status,
          processed_by: res?.data?.processed_by
        });
      }
    } catch (error) {
      showToast(error.message, "error");
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
              <button onClick={markAsFailedOrder} className={`admin-action-button order-failed-button ${(order?.order_status === 'success' || order?.order_status === "failed") && "order-disabled-button"}`}><FaBan className='admin-action-icon'/></button>
              <button onClick={markAsSuccessOrder} className={`admin-action-button order-success-button ${(order?.order_status === 'success' || order?.order_status === "failed") && "order-disabled-button"}`}><FaCheckCircle className='admin-action-icon'/></button>
            </div>
          </div>
          <OrderStepper currentStep={currentStep} order_status={order?.order_status} />
          <div className='user-product-container'>
            <div className='user-info-container'>
              <img className='order-detail-user-avatar' src={order?.userId?.profileImg} alt='user-avatar'></img>
              <div className='name-container'>
                <p className='order-detail-username'>{order?.userId.username}</p>
                <button onClick={() => navigate(`/super-admin/users/view/${order?.userId?._id}`)} className='view-user-detail-button'>Xem thông tin</button>
              </div>
            </div>
            <div className='order-detail-product-container'>
              <img className='order-detail-product-image' src={order?.product?.product_imgs[0]} alt='product-img'></img>
              <div className='order-detail-name-container'>
                <p className='order-detail-username'>{order?.product?.product_name}</p>
                {order?.order_type === 'topup_package' && <p className='order-attribute-text'>{order_package?.name}</p>}
                {(order?.order_type === 'utility_account' || (order?.order_type === 'game_account' && !order?.product?.isValuable)) &&
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
            <span>{order?.order_base_amount?.toLocaleString()}đ</span>
            </div>
            <div className="order-summary-line">
            <span>Giảm giá:</span>
            <span>-{order?.order_discount_amount?.toLocaleString()}đ</span>
            </div>
            <div className="order-summary-total">
            <strong>Tổng đã thanh toán:</strong>
            <strong>{order?.order_final_amount?.toLocaleString()}đ</strong>
            </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
