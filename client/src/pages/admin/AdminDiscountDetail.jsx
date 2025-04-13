import React, { useState, useEffect } from "react";
import "./admin-discount-detail.css";
import { useNavigate, useParams } from "react-router-dom";
import { getDiscount } from "../../api/discount.api";
import { showToast } from "../../components/toasts/ToastNotification";
import { HashLoader } from "react-spinners";

const AdminDiscountDetail = () => {
  const { discountId } = useParams();
  const [discount, setDiscount] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscountDetails = async () => {
      try {
        setLoading(true);

        const res = await getDiscount(discountId);

        if (res?.success) {
          setDiscount(res.data.discount);
        }
      } catch (err) {
          showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    if (discountId) {
      fetchDiscountDetails();
    }
  }, [discountId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="loader-container">
        <HashLoader color="#092339" />
      </div>
    );
  }

  if (!discount) {
    return <div className="discount-detail-not-found">Không tìm thấy mã giảm giá</div>;
  }

  return (
    <div className="discount-detail-container">
      <div className="discount-detail-header">
        <h1 className="discount-detail-title">Chi tiết mã giảm giá</h1>
        <div className="discount-detail-status">
          <span
            className={`discount-detail-badge ${
              discount.isActive ? "active" : "inactive"
            }`}
          >
            {discount.isActive ? "Hoạt động" : "Không hoạt động"}
          </span>
        </div>
      </div>

      <div className="discount-detail-card">
        <div className="discount-detail-section">
          <h2 className="discount-detail-section-title">Thông tin cơ bản</h2>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Mã</div>
            <div className="discount-detail-value">{discount.code}</div>
          </div>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Loại</div>
            <div className="discount-detail-value capitalize">
              {discount.discount_type}
              {discount.discount_type === "percentage" ? " (%)" : " (đ)"}
            </div>
          </div>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Giá trị</div>
            <div className="discount-detail-value">
              {discount.discount_type === "percentage"
                ? `${discount.discount_value}%`
                : `$${discount.discount_value.toFixed(2)}`}
            </div>
          </div>
        </div>

        <div className="discount-detail-section">
          <h2 className="discount-detail-section-title">Thời hạn hiệu lực</h2>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Ngày bắt đầu</div>
            <div className="discount-detail-value">
              {new Date(discount.start_date).toLocaleDateString()}
            </div>
          </div>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Ngày kết thúc</div>
            <div className="discount-detail-value">
              {new Date(discount.end_date).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="discount-detail-section">
          <h2 className="discount-detail-section-title">Điều kiện sử dụng</h2>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Mua tối thiểu</div>
            <div className="discount-detail-value">
              {discount.min_purchase.toLocaleString()}đ
            </div>
          </div>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Giới hạn sử dụng</div>
            <div className="discount-detail-value">{discount.limitUsage}</div>
          </div>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Số lần sử dụng</div>
            <div className="discount-detail-value">{discount.usedCount}</div>
          </div>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Sử dụng còn lại</div>
            <div className="discount-detail-value">
              {discount.limitUsage - discount.usedCount}
            </div>
          </div>
        </div>

        <div className="discount-detail-section">
          <h2 className="discount-detail-section-title">Metadata</h2>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Tạo lúc</div>
            <div className="discount-detail-value">
              {new Date(discount.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="discount-detail-row">
            <div className="discount-detail-label">Cập nhật lúc</div>
            <div className="discount-detail-value">
              {new Date(discount.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="discount-detail-actions">
          <button onClick={() => navigate('/super-admin/discounts')} className="discount-detail-btn back">
            Quay lại
          </button>
          <button className="discount-detail-btn edit">Chỉnh sửa</button>
          <button className="discount-detail-btn toggle">
            {discount.isActive ? "Hủy kích hoạt" : "Kích hoạt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscountDetail;
