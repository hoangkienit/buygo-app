import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './../styles/order-success.css';
import { Copy } from "lucide-react";
import ToastNotification, { showToast } from '../components/toasts/ToastNotification';
import { FaFacebookMessenger } from "react-icons/fa";
import { FaShoppingBasket } from "react-icons/fa";
import { IoReceiptSharp } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
  const { state } = useLocation();
  const { orderId, product_type, order_attributes, isValuable } = state || {};
  const navigate = useNavigate();
  
  const copyToClipboard = (text) => {
      showToast("Copy thành công", "success");
          navigator.clipboard.writeText(text);
  };
  
  return (
    <div className="order-success-container">
      <ToastNotification/>
      <div className="order-success-card">
        {/* <img className='success-icon' src={ORDER_SUCCESS} alt='Success Order Image'/> */}
        <FaRegCheckCircle className='order-success-icon'/>
        <h2 className="success-title">Đơn Hàng Thành Công</h2>
        <div className="order-details">
          <p className="order-id">
            <strong>Mã đơn hàng: <span className='orderId'>{orderId }</span></strong>
            <Copy className="copy-icon" onClick={() => copyToClipboard(orderId)} />
          </p>
          {(product_type === 'utility_account' || (product_type === 'game_account' && !isValuable)) &&
            <div className='order-attributes-container'>
              <div className="order-success-product-username">
                <strong>Tên đăng nhập:</strong>
                <strong className='order-success-product-attributes-text'>{order_attributes?.username}</strong>
              </div>
              <p className="order-success-product-password">
                <strong>Mật khẩu:</strong>
                <strong className='order-success-product-attributes-text'>{order_attributes?.password}</strong>
              </p>
            </div>
          }
        </div>
          <p className="success-message">
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!
          </p>
        <div className="cta-container">
          {(product_type === 'utility_account' || (product_type === 'game_account' && !isValuable)) ?
            <button onClick={() => navigate('/')} className="view-order-btn">
              <FaShoppingBasket />Mua tiếp
            </button>
            :
            <button className="view-order-btn">
              <FaFacebookMessenger />Liên hệ qua Messenger
            </button>
          }
                    
          <button onClick={() => navigate(`/order/${orderId}`)} className="view-order-btn">
            <IoReceiptSharp />Xem chi tiết đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

