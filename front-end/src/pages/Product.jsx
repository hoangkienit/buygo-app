import React from "react";
import "./../styles/product.css";
import { IoTicketSharp } from "react-icons/io5";

const Product = () => {
  return (
    <div className="product-container">
        <div className="product-left">
            <div className="breadcrumb">Trang chủ / Clash Royale / 80 Ngọc</div>
      <div className="content">
        {/* Main Product Section */}
        <div className="product">
          <div className="product-gallery">
            <img
              src="https://fontmeme.com/images/clash-royale-GAME-FONT.jpg"
              alt="Product"
              className="product-image"
            />
          </div>
          <div className="product-info">
            <h1 className="product-title">80 Ngọc Clash Royale - Bảo Hành</h1>
            <p className="price">Giá: <span>20.000 VND</span></p>
            <p className="description">
              Gói nạp 80 Ngọc Clash Royale, bảo hành uy tín. Nhận ngọc nhanh chóng trong vòng 5-10 phút.
            </p>
            <div className="product-actions">
              <button className="buy-button">Mua ngay</button>
              <button className="cart-button">Thêm vào giỏ</button>
            </div>
          </div>
        </div>  
        </div>
        {/* Product Details */}
      <div className="details">
        <h2>Chi tiết sản phẩm</h2>
        <ul>
          <li>✔ 80 Ngọc trong game Clash Royale.</li>
          <li>✔ Thời gian nạp: 5-10 phút.</li>
          <li>✔ Bảo hành 24h, hỗ trợ nhanh chóng.</li>
          <li>✔ Thanh toán an toàn qua nhiều phương thức.</li>
        </ul>
      </div>

      {/* Customer Reviews */}
      <div className="reviews">
        <h2>Đánh giá từ khách hàng</h2>
        <div className="review-item">
          <p><strong>Nguyễn Văn A:</strong> "Dịch vụ nạp nhanh, uy tín!" ⭐⭐⭐⭐⭐</p>
        </div>
        <div className="review-item">
          <p><strong>Trần B:</strong> "Hỗ trợ tốt, sẽ ủng hộ tiếp!" ⭐⭐⭐⭐</p>
        </div>
          </div>
        
      </div>

          <div className="product-right">
              {/* Aside Payment Section */}
        <aside className="payment-container">
          <h2 className="payment-title">Đơn hàng</h2>
            <div className="item-container">
                      <img className="item-image" src="https://c2c.fp.guinfra.com/file/64c929c4c106fee8a0ff28b9woDxPEfi03?fop=imageView/2/w/340/h/340" alt="topup"></img>
                      <div className="item-info-container">
                          <p className="item-coin">100RP</p>
                          <p className="item-price">200.000VND</p>
                      </div>
                      
                  </div>
                  <div className="price-container">
                      <p className="price-text">Giá tiền</p>
                      <p className="price-text">200.000VND</p>
                  </div>
                  <div className="price-container">
                      <p className="price-text">Giảm giá</p>
                      <p className="price-text">10.000VND</p>
                  </div>
           <div className="total-price-container">
                <p className="total-label">Tổng</p>
                <p className="total-amount">190.000VND</p>   
                  </div>
                  <div className="voucher-container">
                      <IoTicketSharp className="voucher-icon" />
                      <a className="voucher-button">Chọn mã giảm giá→</a>
                  </div>
          <button className="checkout-button">Thanh toán ngay</button>
        </aside>
          </div>
    </div>
  );
};

export default Product;
