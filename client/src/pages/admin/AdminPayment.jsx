import React, { useEffect, useRef, useState } from "react";
import "./admin-payment.css";
import { FaSearch } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ToastNotification, {
  showToast,
} from "../../components/toasts/ToastNotification";
import {
  deleteTransactionForAdmin,
  getTransactionListForAdmin,
} from "./../../api/transaction.api";
import { paymentMethodText, statusText, statusType } from "../../utils";
import ConfirmModal from "../../components/modal/confirm-modal";

const ITEMS_PER_PAGE = 8;
export const AdminPayment = () => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedTransactionStatusType, setSelectedTransactionStatusType] =
    useState("all");
  const [transactions, setTransaction] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const modalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactionList();
    document.title = "Admin - Giao dịch nạp tiền";
  }, [currentPage, selectedTransactionStatusType, searchInput]);

  const fetchTransactionList = async () => {
    try {
      setLoading(true);

      const res = await getTransactionListForAdmin(ITEMS_PER_PAGE, currentPage);

      if (res.success) {
        let filtered = res.data.transactions;

        if (searchInput.trim()) {
          filtered = filtered.filter((od) =>
            od.transactionId.toLowerCase().includes(searchInput.toLowerCase())
          );
        }

        if (selectedTransactionStatusType !== "all") {
          filtered = filtered.filter(
            (od) => od.transactionStatus === selectedTransactionStatusType
          );
        }

        setTransaction(filtered);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenActionId(null);
      }
    };

    if (openActionId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleDeleteTransaction = async (transactionId) => {
    setLoading(true);
    setIsModalOpen(false);
    try {
      const res = await deleteTransactionForAdmin(transactionId);

      if (res.success) {
        showToast("Xóa giao dịch thành công", "success");
          setSelectedIdToDelete("");
          
          fetchTransactionList();
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
    <div className="admin-payment-container">
      <p className="tab-nav-title">Danh sách giao dịch</p>
      <div className="admin-product-header">
        <div className="search-filter-container">
          <div className="header-search-input-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã giao dịch"
              className="header-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <select
            className="filter-selection"
            value={selectedTransactionStatusType}
            onChange={(e) => {
              setSelectedTransactionStatusType(e.target.value);
            }}
          >
            <option value="" disabled>
              Bộ lọc
            </option>
            <option value="all">Tất cả</option>
            <option value="success">Thành công</option>
            <option value="pending">Đang chờ</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
        {/* <a href="/super-admin/products/add-product" className="add-product-button-container">
                          <MdOutlineAdd className="add-icon" />
                          <p className="add-text">Thêm sản phẩm</p>
                      </a> */}
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã giao dịch</th>
              <th>Tên người dùng</th>
              <th>Mệnh giá</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Ngân hàng</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <tr key={tx.transactionId}>
                  <td>{index + 1}</td>
                  <td>{tx.transactionId}</td>
                  <td>
                    <a className="table-product-name">{tx.userId?.username}</a>
                  </td>
                  <td className="transaction-price">
                    {tx.amount.toLocaleString() || 0}
                  </td>
                  <td style={{ color: "#3498db" }}>
                    {paymentMethodText(tx.paymentMethod)}
                  </td>
                  <td>
                    <div
                      className={`transaction-status ${statusType(
                        tx.transactionStatus
                      )}`}
                    >
                      {statusText(tx.transactionStatus)}
                    </div>
                  </td>
                  <td>{tx.gateway === "empty_gateway" ? "NA" : tx.gateway}</td>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="action-cell">
                    <div className="action-buttons-container">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setSelectedIdToDelete(tx.transactionId);
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
                <td colSpan="9">Không có giao dịch</td>
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
      <ToastNotification />
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={() => handleDeleteTransaction(selectedIdToDelete)}
        onClose={() => setIsModalOpen(false)}
        message={"Xác nhận bạn đang xóa một giao dịch"}
        title={"Xóa giao dịch"}
      />
    </div>
  );
};
