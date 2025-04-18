import { useEffect, useState } from "react";
import {
  Star,
  Flag,
  ThumbsUp,
  X,
  Filter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./admin-reviews.css";
import { HashLoader } from "react-spinners";
import ToastNotification, {
  showToast,
} from "../../components/toasts/ToastNotification";
import {
  deleteReviewForAdmin,
  getAllReviewsForAdmin,
  updateReviewStatusForAdmin,
} from "../../api/review.api";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import ConfirmModal from "../../components/modal/confirm-modal";

const ITEMS_PER_PAGE = 5;

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getAllReviewsForAdmin(ITEMS_PER_PAGE, currentPage);
      const data = res.data;
      setReviews(
        data.reviews.map((r) => ({
          id: r._id,
          username: r.userId?.username || "Người dùng không xác định",
          avatar: r.userId?.profileImg || "/api/placeholder/40/40",
          rating: r.rating,
          comment: r.comment,
          time: r.createdAt,
          orderId: r.orderId,
          status: r.status || "show",
        }))
      );
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      showToast(error.message || "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    document.title = 'Admin - Đánh giá';
  }, [currentPage]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const changeStatus = async (id, newStatus) => {
    setLoading(true);

    try {
      const res = await updateReviewStatusForAdmin(id, newStatus);

      if (res?.success) {
        setReviews(
          reviews.map((review) =>
            review.id === res.data.updatedReview?._id ? { ...review, status: res.data.updatedReview?.status } : review
          )
          );
          
          showToast("Cập nhật trạng thái thành công", "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = () => {
    let filtered = reviews;

    switch (filterType) {
      case "high":
        filtered = filtered.filter((review) => review.rating >= 4);
        break;
      case "low":
        filtered = filtered.filter((review) => review.rating <= 2);
        break;
      default:
        break;
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter);
    }

    return filtered;
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < rating ? "#FFD700" : "none"}
          stroke={i < rating ? "#FFD700" : "#ccc"}
        />
      ));
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "show":
        return (
          <CheckCircle
            size={16}
            className="admin-review-status-icon admin-review-show"
          />
        );
      case "hide":
        return (
          <X size={16} className="admin-review-status-icon admin-review-hide" />
        );
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "show":
        return "Hiển thị";
      case "hide":
        return "Bị ẩn";
      default:
        return "";
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleFilterChange = (type, value) => {
    if (type === "type") setFilterType(value);
    else setStatusFilter(value);
    setCurrentPage(1); // reset page when filters change
  };


  const handleDeleteReview = async () => {
    setLoading(true);
    setIsModalOpen(false);

    try {
      const res = await deleteReviewForAdmin(selectedIdToDelete);

      if (res.success) {
        showToast("Xóa đánh giá thành công", "success");

        fetchReviews();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
    finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loader-container">
        <HashLoader color="#092339" />
      </div>
    );
  }

  return (
    <div className="admin-review-container">
      <ToastNotification />
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDeleteReview}
        onClose={() => setIsModalOpen(false)}
        message={"Xác nhận bạn đang xóa một đánh giá của khách hàng"}
        title={"Xóa đánh giá"}
      />
      <header className="admin-review-header">
        <h1>Đánh giá của khách hàng</h1>
        <div className="admin-review-filter-container">
          <div className="admin-review-filter-controls">
            <Filter size={18} />
            <select
              value={filterType}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="admin-review-filter-select"
            >
              <option value="all">Tất cả</option>
              <option value="high">Đánh giá cao (4-5)</option>
              <option value="low">Đánh giá thấp (1-2)</option>
            </select>
          </div>

          <div className="admin-review-filter-controls">
            <AlertCircle size={18} />
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="admin-review-filter-select"
            >
              <option value="all">Tất cả</option>
              <option value="show">Hiển thị</option>
              <option value="hide">Bị ẩn</option>
            </select>
          </div>
        </div>
      </header>

      <div className="admin-review-reviews-count">
        Hiển thị {filteredReviews().length} trên {ITEMS_PER_PAGE} đánh giá
      </div>

      <div className="admin-review-reviews-list">
        {filteredReviews().map((review) => (
          <div
            key={review.id}
            className={`admin-review-card admin-review-${review.status} ${
              review.flagged ? "admin-review-flagged" : ""
            }`}
          >
            <div className="admin-review-review-header">
              <div className="admin-review-user-info">
                <img
                  src={review.avatar}
                  alt={review.username}
                  className="admin-review-avatar"
                />
                <span className="admin-review-username">{review.username}</span>
              </div>
              <div className="admin-review-review-actions">
                <button
                  className="admin-review-action-button admin-review-delete-button"
                  onClick={() => {
                    setSelectedIdToDelete(review.id);
                    setIsModalOpen(true);
                  }}
                >
                  <MdDelete
                    className="delete-icon-button"
                    size={16}
                    stroke="#ff4d4d"
                  />
                </button>
              </div>
            </div>

            <div className="admin-review-rating-container">
              <div className="admin-review-stars">
                {renderStars(review.rating)}
              </div>
              <span className="admin-review-time">
                {formatDate(review.time)}
              </span>
            </div>

            <p className="admin-review-comment">{review.comment}</p>

            <div className="admin-review-review-footer">
              <div className="admin-review-helpful">
                <IoMdMail size={14} />
                <span>Đánh giá từ đơn hàng <span className="admin-review-orderId">#{review.orderId}</span></span>
              </div>

              <div className="admin-review-status-controls">
                <div className="admin-review-status-indicator">
                  {renderStatusIcon(review.status)}
                  <span
                    className={`admin-review-status-text admin-review-${review.status}`}
                  >
                    {getStatusLabel(review.status)}
                  </span>
                </div>
                <div className="admin-review-status-actions">
                  <button
                    className={`admin-review-status-button admin-review-show ${
                      review.status === "show" ? "admin-review-active" : ""
                    }`}
                    onClick={() => changeStatus(review.id, "show")}
                  >
                    Hiển thị
                  </button>
                  <button
                    className={`admin-review-status-button admin-review-hide ${
                      review.status === "hide" ? "admin-review-active" : ""
                    }`}
                    onClick={() => changeStatus(review.id, "hide")}
                  >
                    Ẩn
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-container">
        {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <GrFormPrevious className="pagination-icon" />
          </button>
          <span className="pagination-info">
            <span className="pagination-text">
              {currentPage}/{totalPages}
            </span>
          </span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <GrFormNext className="pagination-icon" />
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
