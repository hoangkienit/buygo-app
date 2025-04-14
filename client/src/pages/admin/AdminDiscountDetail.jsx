import React, { useState, useEffect } from "react";
import "./admin-discount-detail.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteDiscountForAdmin,
  getDiscount,
  switchDiscountStatus,
} from "../../api/discount.api";
import ToastNotification, {
  showToast,
} from "../../components/toasts/ToastNotification";
import { HashLoader } from "react-spinners";
import ConfirmModal from "../../components/modal/confirm-modal";

const AdminDiscountDetail = () => {
  const { discountId } = useParams();
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isDeleteDiscountModalOpen, setIsDeleteDiscountModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchDiscountDetails = async () => {
      try {
        setLoading(true);

        const res = await getDiscount(discountId);

        if (res?.success) {
          setDiscount(res.data.discount);
          document.title = `Code: ${res.data.discount?.code}`;
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

  const handleSwitchDiscountStatus = async () => {
    setLoading(true);

    try {
      const status = discount?.isActive;

      const res = await switchDiscountStatus(discountId, !status);

      if (res.success) {
        showToast("Cập nhật thành công", "success");
        setDiscount({
          ...discount,
          isActive: res.data.newStatus,
        });
      } else {
        showToast("Lỗi hệ thống xin vui lòng thử lại", "error");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async () => {
    setLoading(true);
    setIsDeleteDiscountModalOpen(false);
    try {
      const res = await deleteDiscountForAdmin(discountId);
      if (res.success) {
        navigate('/super-admin/discounts');
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <HashLoader color="#092339" />
      </div>
    );
  }

  if (!discount) {
    return (
      <div className="discount-detail-not-found">
        Không tìm thấy mã giảm giá
      </div>
    );
  }

  return (
    <div className="discount-detail-container">
      <ToastNotification />
      <ConfirmModal
        isOpen={isDeleteDiscountModalOpen}
        onConfirm={handleDeleteDiscount}
        onClose={() => setIsDeleteDiscountModalOpen(false)}
        message={`Xác nhận bạn đang xóa mã ${discount?.code}`}
        title={"Xóa mã giảm giá"}
      />
      <div className="discount-detail-header">
        <span className="tab-nav-title">
          <a href="/super-admin/discounts">Danh sách mã giảm giá</a> /{" "}
          {discount?.code}
        </span>
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
          <button
            onClick={() => setIsDeleteDiscountModalOpen(true)}
            className="discount-detail-btn delete"
          >
            Xóa mã giảm giá
          </button>
          {/* <button className="discount-detail-btn edit">Chỉnh sửa</button> */}
          <button
            onClick={handleSwitchDiscountStatus}
            className={`discount-detail-btn toggle ${
              !discount.isActive
                ? "discount-active-button"
                : "discount-deactive-button"
            }`}
          >
            {discount.isActive ? "Hủy kích hoạt" : "Kích hoạt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscountDetail;
