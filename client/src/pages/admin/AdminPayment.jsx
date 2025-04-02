import React, { useEffect, useRef, useState } from 'react'
import './admin-payment.css';
import { FaSearch } from "react-icons/fa";
import { MdOutlineAdd } from "react-icons/md";
import { HashLoader } from 'react-spinners';
import { FaEye } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { deleteTransactionForAdmin, getTransactionListForAdmin } from './../../api/transaction.api';
import { paymentMethodText, statusText, statusType } from '../../utils';
import ConfirmModal from '../../components/modal/confirm-modal';

const ITEMS_PER_PAGE = 8;
export const AdminPayment = () => {
    const [searchInput, setSearchInput] = useState("");
    const [selectedTransactionStatusType, setSelectedTransactionStatusType] = useState("");
    const [transactions, setTransaction] = useState([]);
    const [openActionId, setOpenActionId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedIdToDelete, setSelectedIdToDelete] = useState("");
    
    const modalRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactionList();
  }, []);

  const fetchTransactionList = async () => {
    try {
      setLoading(true);

      const res = await getTransactionListForAdmin(50);

      if (res.success) {
        setTransaction(res.data.transactions);
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

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
  
  // Filter products based on search & status selection
      const filteredTransactions = transactions.filter((transaction) => {
          const matchesSearch = transaction.transactionId.toLowerCase().includes(searchInput.toLowerCase());
          const matchesStatus = selectedTransactionStatusType === "" || selectedTransactionStatusType === "all" || transaction.transactionStatus === selectedTransactionStatusType;
          return matchesSearch && matchesStatus;
      });
  
      // Pagination logic
      const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
      const currentTransactions = filteredTransactions.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
      );
  
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

    const handleDeleteTransaction = async (transactionId) => {
        setLoading(true);
        setIsModalOpen(false);
        try {
            const res = await deleteTransactionForAdmin(transactionId);

            if (res.success) {
                // Remove transaction from state
                setTransaction(transactions.filter((transaction) => transaction.transactionId !== transactionId));
                showToast("Xóa giao dịch thành công", "success");
                setSelectedIdToDelete("");
            }
        } catch (error) {
            showToast(error.message, "error");
        }
        finally {
            setLoading(false);
        }
    }
  
  
      if (loading) {
          return <div className="loader-container">
              <HashLoader color="#092339"/>
          </div>
      }

  return (
    <div className='admin-payment-container'>
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
                              <option value="" disabled>Bộ lọc</option>
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
                          {currentTransactions.length > 0 ? (
          currentTransactions
              .map((tx, index) => (
                  <tr key={tx.transactionId}>
                      <td>{index + 1}</td>
                      <td>{tx.transactionId}</td>
                      <td><a className="table-product-name">{tx.userId.username}</a></td>
                      <td className='transaction-price'>{tx.amount.toLocaleString()|| 0}</td>
                      <td style={{color: "#3498db"}}>{paymentMethodText(tx.paymentMethod)}</td>
                      <td>
                          <div className={`transaction-status ${statusType(tx.transactionStatus)}`}>
                              {statusText(tx.transactionStatus)}
                          </div>
                  </td>
                  <td>{tx.gateway === 'empty_gateway' ? "NA" : tx.gateway }</td>
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="action-cell">
                                          <div className="action-buttons-container">
                              <button onClick={() => {
                                  setIsModalOpen(true);
                                  setSelectedIdToDelete(tx.transactionId);
                              }} className="delete-btn action-button"><MdDelete className="action-icon" /></button>
                                          </div>
                                      </td>
                  </tr>
              ))
      ) : (
          <tr>
              <td colSpan="9">Không có sản phẩm nào</td>
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
                              <GrFormPrevious className="pagination-icon"/>
                          </button>
                          <span className="pagination-info">{currentPage}</span>
                          <button
                              className="pagination-btn"
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                          >
                              <GrFormNext className="pagination-icon"/>
                          </button>
                      </div>
          )}
          <ToastNotification />
          <ConfirmModal isOpen={isModalOpen} onConfirm={() => handleDeleteTransaction(selectedIdToDelete)} onClose={() => setIsModalOpen(false)} message={'Xác nhận bạn đang xóa một giao dịch'} title={'Xóa giao dịch'}/>
    </div>
  )
}
