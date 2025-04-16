import React, { useEffect, useState } from "react";
import "./admin-order.css";
import {
  deleteOrderForAdmin,
  getAllOrdersForAdmin,
} from "../../api/order.api";
import ToastNotification, { showToast } from "../../components/toasts/ToastNotification";
import { FaSearch } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import { productTypeText, statusText, statusType } from "../../utils";
import ConfirmModal from "../../components/modal/confirm-modal";
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa6";

const ITEMS_PER_PAGE = 8;

export const AdminOrder = () => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedIdToDelete, setSelectedIdToDelete] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin - Đơn hàng";
    fetchOrders();
  }, [currentPage, selected, searchInput]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrdersForAdmin(ITEMS_PER_PAGE, currentPage);

      if (res.success) {
        let filtered = res.data.orders;

        if (searchInput.trim()) {
          filtered = filtered.filter((od) =>
            od.orderId.toLowerCase().includes(searchInput.toLowerCase())
          );
        }

        if (selected !== "all") {
          filtered = filtered.filter((od) => od.order_status === selected);
        }

        setOrders(filtered);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleDeleteOrder = async () => {
    try {
      setLoading(true);
      setIsModalOpen(false);
      const res = await deleteOrderForAdmin(selectedIdToDelete);

      if (res.success) {
        showToast("Xóa đơn hàng thành công", "success");

        // refetch current page (in case order count changed)
        fetchOrders();
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-order-container">
      <ToastNotification />
      <p className="tab-nav-title">Danh sách đơn hàng</p>

      <div className="admin-product-header">
        <div className="search-filter-container">
          <div className="header-search-input-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng"
              className="header-search-input"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FaSearch className="search-icon" />
          </div>

          <select
            className="filter-selection"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả</option>
            <option value="success">Thành công</option>
            <option value="processing">Đang xử lí</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <HashLoader color="#092339" />
        </div>
      ) : (
        <>
          <div className="product-table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã giao dịch</th>
                  <th>Tên người dùng</th>
                  <th>Số tiền</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders?.length > 0 ? (
                  orders.map((tx, index) => (
                    <tr key={tx.orderId}>
                      <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                      <td>{tx.orderId}</td>
                      <td>{tx.userId?.username}</td>
                      <td className="order-price">{tx.order_final_amount.toLocaleString()}</td>
                      <td className="order-price">{productTypeText(tx.order_type)}</td>
                      <td>
                        <div className={`transaction-status ${statusType(tx.order_status)}`}>
                          {statusText(tx.order_status)}
                        </div>
                      </td>
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="action-cell">
                        <div className="action-buttons-container">
                          <button
                            className="action-button"
                            onClick={() => navigate(`/super-admin/orders/view/${tx.orderId}`)}
                          >
                            <FaEye className="action-icon" />
                          </button>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedIdToDelete(tx.orderId);
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
                    <td colSpan={8}>Không có đơn hàng</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
                <GrFormPrevious className="pagination-icon" />
              </button>
              <span className="pagination-info"><span className="pagination-text">{currentPage}/{totalPages}</span></span>
              <button className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <GrFormNext className="pagination-icon" />
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDeleteOrder}
        onClose={() => setIsModalOpen(false)}
        message={"Xác nhận bạn đang xóa một đơn hàng"}
        title={"Xóa đơn hàng"}
      />
    </div>
  );
};
