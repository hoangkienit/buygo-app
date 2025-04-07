import React, { useEffect, useState } from 'react';
import './admin-order.css';
import { deleteOrderForAdmin, getAllOrdersForAdmin } from '../../api/order.api';
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { FaSearch } from 'react-icons/fa';
import { HashLoader } from 'react-spinners';
import { statusText, statusType } from '../../utils';
import ConfirmModal from '../../components/modal/confirm-modal';
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa6";

const ITEMS_PER_PAGE = 8;
const DATA_LIMIT = 200;

export const AdminOrder = () => {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [orders, setOrders] = useState(null);
    
    const [selectedIdToDelete, setSelectedIdToDelete] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin - Đơn hàng';
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrdersForAdmin(DATA_LIMIT);

      if (res.success) {
        setOrders(res.data.orders || null);
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders?.filter((od) => {
    const matchesSearch = od.orderId.toLowerCase().includes(searchInput.toLowerCase());
    const matchesStatus = selected === '' || selected === 'all' || od.order_status === selected;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders?.length / ITEMS_PER_PAGE);
  const currentOrders = filteredOrders?.slice(
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

    const handleDeleteOrder = async () => {
        setLoading(true);
        setIsModalOpen(false);
        try {
            const res = await deleteOrderForAdmin(selectedIdToDelete);

            if (res?.success) {
                showToast("Xóa đơn hàng thành công", "success");
                setOrders(orders.filter((od) => od.orderId !== selectedIdToDelete));
            }
        } catch (error) {
            showToast(error.message, "success");
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
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <select
            className="filter-selection"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setCurrentPage(1); // Reset pagination on filter change
            }}
          >
            <option value="" disabled>
              Bộ lọc
            </option>
            <option value="all">Tất cả</option>
            <option value="success">Thành công</option>
            <option value="processing">Đang xử lí</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
          </div>
        <div className="product-table-container">
                              <table className="product-table">
                              <thead>
                              <tr>
                                  <th>STT</th>
                                      <th>Mã giao dịch</th>
                                      <th>Tên người dùng</th>
                                      <th>Số tiền</th>
                                      <th>Trạng thái</th>
                                      <th>Thời gian</th>
                                      <th>Thao tác</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {currentOrders?.length > 0 ? (
                  currentOrders
                      .map((tx, index) => (
                          <tr key={tx.orderId}>
                              <td>{index + 1}</td>
                              <td>{tx.orderId}</td>
                              <td>{tx.userId.username}</td>
                              <td className='order-price'>{tx.order_amount.toLocaleString()|| 0}</td>
                              <td>
                                  <div className={`transaction-status ${statusType(tx.order_status)}`}>
                                      {statusText(tx.order_status)}
                                  </div>
                          </td>
                              <td>{new Date(tx.createdAt).toLocaleString()}</td>
                              <td className="action-cell">
                                  <div className="action-buttons-container">
                                      <button className="action-button" onClick={() => navigate(`/super-admin/orders/view/${tx.orderId}`)}><FaEye className="action-icon" /></button>
                                      <button onClick={() => {
                                          setIsModalOpen(true);
                                          setSelectedIdToDelete(tx.orderId);
                                      }} className="delete-btn action-button"><MdDelete className="action-icon" /></button>
                                                  </div>
                                              </td>
                          </tr>
                      ))
              ) : (
                  <tr>
                      <td colSpan="9">Không có đơn hàng</td>
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
          <ConfirmModal
              isOpen={isModalOpen}
              onConfirm={() => handleDeleteOrder(selectedIdToDelete)}
              onClose={() => setIsModalOpen(false)}
              message={'Xác nhận bạn đang xóa một giao dịch'}
              title={'Xóa giao dịch'} />
    </div>
  );
};
