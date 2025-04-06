import React from 'react';
import { Link } from 'react-router-dom';
import './../styles/order-success.css';

const OrderSuccess = ({ orderId, productName, price, userName }) => {
  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <h2 className="success-title">Đơn Hàng Thành Công</h2>
        <div className="order-details">
          <p className="order-id">
            <strong>Mã đơn hàng:</strong> {orderId}
          </p>
          <p className="product-name">
            <strong>Sản phẩm:</strong> {productName}
          </p>
          <p className="price">
            <strong>Giá:</strong> {price}
          </p>
          <p className="user-name">
            <strong>Người mua:</strong> {userName}
          </p>
        </div>
        <div className="cta-container">
          <p className="success-message">
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!
          </p>
          <Link to={`/order/${orderId}`} className="view-order-btn">
            Xem Chi Tiết Đơn Hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

