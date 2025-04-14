import React, { useEffect, useState } from "react";
import "./admin-discount.css";
import ToastNotification, {
  showToast,
} from "../../components/toasts/ToastNotification";
import { FaEdit } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { deleteDiscountForAdmin, getAllDiscountsForAdmin } from "../../api/discount.api";
import AddDiscountModal from "../../components/modal/add-discount-modal";
import ConfirmModal from "../../components/modal/confirm-modal";

const ITEMS_PER_PAGE = 8;

export const AdminDiscount = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [discounts, setDiscounts] = useState([]);

  // Delete discount modal
  const [isDeleteDiscountModalOpen, setIsDeleteDiscountModalOpen] =
    useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState("");

  // Add discount modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin - Mã giảm giá";
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await getAllDiscountsForAdmin();

      if (res.success) {
        setDiscounts(res.data.discounts || null);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(discounts?.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    setLoading(true);
    setIsDeleteDiscountModalOpen(false);
    try {
      const res = await deleteDiscountForAdmin(discountId);
      if (res.success) {
        showToast("Xóa mã giảm giá thành công", "success");
        setDiscounts(discounts.filter((dis) => dis._id.toString() !== selectedIdToDelete))
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

  return (
    <div className="admin-order-container">
      <ToastNotification />
      <AddDiscountModal
        isOpen={isModalOpen}
        title={"Thêm mã giảm giá"}
        message={
          "Vui lòng điền số tiền theo lựa chọn VD: phần trăm thì là 10% còn giá cố định thì là 100.000đ hoặc 200.000đ"
        }
        onClose={() => setIsModalOpen(false)}
        setDiscounts={setDiscounts}
        discounts={discounts}
      />
      <ConfirmModal
        isOpen={isDeleteDiscountModalOpen}
        onConfirm={() => handleDeleteDiscount(selectedIdToDelete)}
        onClose={() => setIsDeleteDiscountModalOpen(false)}
        message={"Xác nhận bạn đang xóa một mã giảm giá"}
        title={"Xóa mã giảm giá"}
      />
      <p className="tab-nav-title">Danh sách mã giảm giá</p>

      <div className="admin-product-header">
        <button
          onClick={() => setIsModalOpen(true)}
          className="add-discount-button"
        >
          Thêm mã giảm giá
        </button>
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Code</th>
              <th>Giá trị</th>
              <th>Loại</th>
              <th>Bắt đầu lúc</th>
              <th>Kết thúc lúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {discounts?.length > 0 ? (
              discounts.map((tx, index) => (
                <tr key={tx?._id}>
                  <td>{index + 1}</td>
                  <td>{tx?.code}</td>
                  <td className="order-price">
                    {tx?.discount_value.toLocaleString() || 0}{tx?.discount_type === 'percentage' ? "%" :"đ"}
                  </td>
                  <td className="order-price">{tx?.discount_type}</td>
                  <td className="order-price">
                    {new Date(tx?.start_date).toLocaleDateString()}
                  </td>
                  <td>{new Date(tx?.end_date).toLocaleDateString()}</td>
                  <td>
                    <div
                      className={`transaction-status ${
                        tx?.isActive ? "product-active" : "product-inactive"
                      }`}
                    >
                      {tx?.isActive ? "Hoạt động" : "Không hoạt động"}
                    </div>
                  </td>
                  <td className="action-cell">
                    <div className="action-buttons-container">
                      <button
                        className="view-btn action-button"
                        onClick={() =>
                          navigate(`/super-admin/discounts/view/${tx?._id}`)
                        }
                      >
                        <FaEye className="action-icon" />
                      </button>
                      {/* <button
                        onClick={() =>
                          navigate(`/super-admin/discounts/edit/${tx?._id}`)
                        }
                        className="edit-btn action-button"
                      >
                        <FaEdit className="action-icon" />
                      </button> */}
                      <button
                        onClick={() => {
                          setIsDeleteDiscountModalOpen(true);
                          setSelectedIdToDelete(tx?._id);
                        }}
                        className="delete-btn action-button"
                      >
                        <MdDelete className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">Không có mã</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <GrFormPrevious className="pagination-icon" />
          </button>
          <span className="pagination-info">{currentPage}</span>
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
  );
};
