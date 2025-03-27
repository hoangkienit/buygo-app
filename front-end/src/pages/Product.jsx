import React, { useEffect, useState } from "react";
import "./../styles/product.css";
import { IoTicketSharp } from "react-icons/io5";
import StarRating from "../components/star-rating/star-rating";
import { BsFillCartCheckFill, BsCartXFill } from "react-icons/bs";
import RankingIcon from "../components/ranking/ranking";

const Product = () => {
  const [isViewImage, setIsViewImage] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

   useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="product-container">
      <div className="product-left">
        <div className="content">
          {/* Main Product Section */}
          <div className="product">
            <div className="product-gallery">
              <img
                src="https://fontmeme.com/images/clash-royale-GAME-FONT.jpg"
                alt="Product"
                className="product-image"
                onClick={() => setIsViewImage(true)}
              />
            </div>
            <div className="product-info">
              <h1 className="product-title">80 Ngọc Clash Royale - Bảo Hành</h1>
              <div className="star-container">
                <StarRating rating={4.5} />
                <p className="sell-amount">Đã bán 50</p>
              </div>
              <div className="product-description-container">
                <h3 className="product-description-title">Mô tả</h3>
                <p className="product-description">
                  Clash Royale là một trò chơi chiến thuật thời gian thực do Supercell phát hành, kết hợp giữa thể loại thẻ bài, phòng thủ tháp và đấu trường trực tuyến. Trò chơi ra mắt vào năm 2016 và nhanh chóng trở thành một trong những game di động phổ biến nhất trên thế giới.
                </p>
              </div>
              <div className="tutorial-button-container">
                <button className="tutorial-button">Hướng dẫn lấy ID</button>
                <button className="tutorial-button">Hướng dẫn nạp</button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="product-topup-package-container">
          <h3 className="product-topup-package-title">Chọn gói nạp</h3>
          <div className="product-item-container">
            <div className="product-item">
            <img className="product-item-img" alt="package-img" src="https://img.redbull.com/images/c_fill,g_auto,w_450,h_600/q_auto:low,f_auto/redbullcom/2016/05/10/1331793850853_2/clash-royale-trucchi-e-consigli-1"></img>
            <div className="product-item-info">
              <p className="product-item-name">SIÊU PHẨM KHUNG NGON VÀ VIP PRO MS 755</p>
              <div className="product-item-order-type-container">
                <div className="product-item-order-type">
                  <BsFillCartCheckFill className="product-item-order-icon stock" />
                  <p className="product-item-order-value stock">Có sẵn</p>
                </div>
                <div className="product-item-price-discount-container">
                  <p className="product-item-discount">20.000VND</p>
                  <p className="product-item-price">2.900.000VND</p>
                </div>
              </div>
            </div>
          </div>
          <div className="product-item">
            <img className="product-item-img" alt="package-img" src="https://img.redbull.com/images/c_fill,g_auto,w_450,h_600/q_auto:low,f_auto/redbullcom/2016/05/10/1331793850853_2/clash-royale-trucchi-e-consigli-1"></img>
            <div className="product-item-info">
              <p className="product-item-name">SIÊU PHẨM KHUNG NGON VÀ VIP PRO MS 755</p>
              <div className="product-item-order-type-container">
                <div className="product-item-order-type">
                  <BsCartXFill className="product-item-order-icon sold"/>
                  <p className="product-item-order-value sold">Hết hàng</p>
                </div>
                <div className="product-item-price-discount-container">
                  <p className="product-item-discount">20.000VND</p>
                  <p className="product-item-price">2.900.000VND</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

         {/* Payment only display on mobile */}
        <aside className={`payment-container ${isMobile ? "enable" : "disable"}`}>
          <h2 className="payment-title">Đơn hàng</h2>
          <div className="item-container">
            <img 
              className="item-image" 
              src="https://c2c.fp.guinfra.com/file/64c929c4c106fee8a0ff28b9woDxPEfi03?fop=imageView/2/w/340/h/340" 
              alt="topup" 
            />
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
            <a href="/" className="voucher-button">Chọn mã giảm giá→</a>
          </div>
          <button className="checkout-button">Thanh toán ngay</button>
        </aside>

        {/* Customer Reviews */}
        <div className="reviews">
          <h2 className="reviews-title">Đánh giá từ khách hàng</h2>
          <div className="review-item-container">
            <div className="review-item">
              <img className="review-item-user-avatar" src="https://i.pravatar.cc/300" alt="user-avatar"></img>
              <div className="review-item-user-info-container">
                <div className="review-item-username-rating">
                  <p className="review-item-username">Trần Văn A</p>
                  <StarRating rating={3.5}/>
                </div>
                <div className="review-item-ranking-container">
                  <RankingIcon rank={'bronze'} />
                  <p className="user-rank-text">Đồng</p>
                </div>
                <div className="review-item-user-comment-container">
                  <p className="user-comment">Sản phẩm tốt, nạp tiền nhanh</p>
                  <p className="comment-date">27/03/2025</p>
                </div>
              </div>
            </div>
            <div className="review-item">
              <img className="review-item-user-avatar" src="https://i.pravatar.cc/300" alt="user-avatar"></img>
              <div className="review-item-user-info-container">
                <div className="review-item-username-rating">
                  <p className="review-item-username">Nguyễn Hoàng B</p>
                  <StarRating rating={5}/>
                </div>
                <div className="review-item-ranking-container">
                  <RankingIcon rank={'diamond'} />
                  <p className="user-rank-text">Kim Cương</p>
                </div>
                <div className="review-item-user-comment-container">
                  <p className="user-comment">Mình mua rất nhiều ở đây rồi</p>
                  <p className="comment-date">27/03/2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-right">
        {/* Aside Payment Section */}
        <aside className={`payment-container ${isMobile ? "disable" : "enable"}`}>
          <h2 className="payment-title">Đơn hàng</h2>
          <div className="item-container">
            <img 
              className="item-image" 
              src="https://c2c.fp.guinfra.com/file/64c929c4c106fee8a0ff28b9woDxPEfi03?fop=imageView/2/w/340/h/340" 
              alt="topup" 
            />
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

      {isViewImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsViewImage(false)}
        >
          <img 
            src="https://fontmeme.com/images/clash-royale-GAME-FONT.jpg" 
            alt="Full View" 
            style={{ maxWidth: "90%", maxHeight: "90%" }} 
          />
        </div>
      )}
    </div>
  );
};

export default Product;