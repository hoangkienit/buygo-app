import { useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import './../styles/checkout.css';
import { useUser } from '../context/UserContext';
import ToastNotification, { showToast } from '../components/toasts/ToastNotification';
import { createNewOrder } from '../api/order.api';
import { ClipLoader } from 'react-spinners';

const Checkout = () => {
    const { user, updateBalance } = useUser();
    const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
    
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const location = useLocation();
    const state_data = location.state || {};

    const productId = params.get('productId');
    const product_type = params.get('product_type');

    const product = state_data.product || null;
    const product_package = state_data.product_package || null;

    const navigate = useNavigate();

    const subtotal = product_type === 'topup_package' ? product_package?.price : product?.product_attributes?.price;
    const totalAfterDiscount = subtotal - discount;
    const finalPayment = totalAfterDiscount;

  const checkBalance = () => user?.balance - finalPayment >= 0;
  

  const handleApplyCoupon = () => {
    if (coupon === 'GIAM10') {
      setDiscount(10000);
    } else {
      setDiscount(0);
      alert('Mã giảm giá không hợp lệ');
    }
  };
  
  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      let res = null;
      switch (product_type) {
        case "game_account":
          res = await createNewOrder(productId, product_type, finalPayment);
          break;
        case "utility_account":
          res = await createNewOrder(productId, product_type, finalPayment);
          break;
        case "topup_package":
          res = await createNewOrder(productId, product_type, finalPayment, product_package?._id);
          break;
        default:
          break;
      }

      if (res?.success) {
        navigate('/order-success',
          {
            state: {
              orderId: res.orderId,
              product_type: product_type,
              order_attributes: res.item,
              isValuable: res.isValuable
            }
          }
        )
      }
    }
    catch (error) {
      showToast(error.message, "error");
    }
    finally {
      setLoading(false);
    }
  }
    

  return (
    <div className='checkout-wrapper'>
      <ToastNotification/>
          <div className="check-out-container">
      <h1 className="check-out-title">Thanh toán</h1>

      {/* Thông tin khách hàng */}
      {/* <div className="check-out-section">
        <h2 className="check-out-section-title">Thông tin khách hàng</h2>
        <div className="check-out-row">
          <label>Họ tên:</label>
          <input type="text" placeholder="Nguyễn Văn A" />
        </div>
        <div className="check-out-row">
          <label>Email:</label>
          <input type="email" placeholder="email@example.com" />
        </div>
      </div> */}

      {/* Số dư tài khoản */}
      <div className="check-out-section">
        <h2 className="check-out-section-title">Số dư ví</h2>
                  <p className={`check-out-balance ${!checkBalance() && "lack-balance"}`}>💰 Số dư hiện tại: <strong>{user?.balance.toLocaleString()}đ</strong></p>
                  {!checkBalance() && <p onClick={() => navigate('/account/recharge')} className='check-out-balance deposit-button'>Nạp thêm tiền</p>}
      </div>

      {/* Mã giảm giá */}
      <div className="check-out-section">
        <h2 className="check-out-section-title">Mã giảm giá</h2>
        <div className="check-out-row">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
              placeholder="Nhập mã giảm giá..."
              style={{fontFamily: 'montserrat-md', outline: 'none'}}
          />
          <button className="check-out-btn apply-voucher-button" onClick={handleApplyCoupon}>Áp dụng</button>
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="check-out-section">
        <h2 className="check-out-section-title">Tóm tắt đơn hàng</h2>
        <div className='checkout-item'>
                      {product_type === 'topup_package' ?
                          <div className='checkout-item-container'>
                              <img loading='lazy' src={product_package?.product_img} className='checkout-item-img' alt='Checkout Item Image'/>
                              <div className='checkout-item-price-amount'>
                                  <span>{product_package?.name}</span>
                                  <span>x1</span>
                              </div>
                          </div> 
                          :
                          <div className='checkout-item-container'>
                              <img loading='lazy' src={product?.product_imgs[0]} className='checkout-item-img' alt='Checkout Item Image'/>
                              <div className='checkout-item-price-amount'>
                                  <span>{product?.product_name}</span>
                                  <span>x1</span>
                              </div>
                          </div> 
        }       
        </div>
        <div className="check-out-summary-line">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString()}đ</span>
        </div>
        <div className="check-out-summary-line">
          <span>Giảm giá:</span>
          <span>-{discount.toLocaleString()}đ</span>
        </div>
        {/* <div className="check-out-summary-line">
          <span>Số dư sử dụng:</span>
          <span>-{Math.min(balance, totalAfterDiscount).toLocaleString()}₫</span>
        </div> */}
        <div className="check-out-summary-total">
          <strong>Tổng cần thanh toán:</strong>
          <strong>{finalPayment.toLocaleString()}đ</strong>
        </div>
      </div>

      {/* Nút thanh toán */}
      <button onClick={handleCreateOrder} disabled={checkBalance() ? false:true} className={`check-out-btn check-out-pay-btn ${!checkBalance() && "disabled-button"}`}>
        {loading ? <ClipLoader color='#fff' size={20}/> : "Thanh toán ngay"}
          </button>
          <p className="check-out-disclaimer">
  Bằng cách bấm <strong>Thanh toán</strong>, tôi xác nhận rằng tôi đã đọc và đồng ý với
  các <a href="https://muakey.com/dieu-khoan" target="_blank" rel="noopener noreferrer">điều khoản và điều kiện</a> của Buygo.vn,
  <a href="https://muakey.com/dieu-khoan-su-dung" target="_blank" rel="noopener noreferrer"> Điều khoản sử dụng</a> và
  <a href="https://muakey.com/chinh-sach-bao-mat" target="_blank" rel="noopener noreferrer"> Chính sách quyền riêng tư</a>.
</p>
    </div>
    </div>
  );
};

export default Checkout;

