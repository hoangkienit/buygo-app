import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/transaction.css";
import AccountLayout from "../layouts/AccountLayout";
import { HashLoader } from "react-spinners";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { getTransactionHistoryList } from "../api/transaction.api";
import showToast from "../components/toasts/ToastNotification";
import {
  productTypeText,
  statusClass,
  statusText,
  transactionHistoryPaymentMethodText,
} from "../utils";
import { getAllOrders } from "../api/order.api";
import { useUser } from "../context/UserContext";
import { FaEye } from "react-icons/fa6";

const ITEMS_PER_PAGE = 8;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrders(100);
        if (res.success) {
          setOrders(res.data.orders || []);
        }
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const currentOrders = orders.slice(
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

  return (
    <AccountLayout title={"Đơn hàng"}>
      <div className="transaction-container">
        <h3 className="transaction-title">Đơn hàng của bạn</h3>
        {loading ? (
          <div className="loader-container">
            <HashLoader color="#fff" size={30} />
          </div>
        ) : (
          <>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã đơn hàng</th>
                  <th>Số tiền</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th>Nội dung</th>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((tx, index) => (
                    <tr key={tx.orderId}>
                      <td>{index + 1}</td>
                      <td>{tx.orderId}</td>
                      <td>{tx.order_final_amount.toLocaleString() || 0}đ</td>
                      <td>{productTypeText(tx.order_type)}</td>
                      <td
                        className={`${statusClass(
                          tx.order_status
                        )} transaction-status`}
                      >
                        {statusText(tx.order_status)}
                      </td>
                      <td>{tx.note}</td>
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="action-button"
                          onClick={() => navigate(`/order/${tx.orderId}`)}
                        >
                          <FaEye className="action-icon" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">Không có đơn hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>

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
          </>
        )}
      </div>
    </AccountLayout>
  );
};

export default Order;
