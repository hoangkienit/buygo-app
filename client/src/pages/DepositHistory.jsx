import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/transaction.css";
import AccountLayout from "../layouts/AccountLayout";
import { HashLoader } from "react-spinners";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { getDepositHistoryList } from "../api/transaction.api";
import showToast from '../components/toasts/ToastNotification';
import { statusClass, transactionHistoryPaymentMethodText } from "../utils";


const ITEMS_PER_PAGE = 8;

const DepositHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const res = await getDepositHistoryList(50);
                if (res.success) {
                    setTransactions(res.data.transactions);
                }
            } catch (error) {
                showToast(error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [navigate]);

    const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
    const currentTransactions = transactions.slice(
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

    const formatStatus = (status) => {
        switch (status) {
            case "pending":              
                return "Đang chờ";
            case "success":               
                return "Thành công";
            case "failed":              
                return "Thất bại";     
            default:
                return "Empty status"; 
        }
    };


    return (
        <AccountLayout title={'Lịch sử nạp tiền'}>
            <div className="transaction-container">
                <h3 className="transaction-title">Lịch sử nạp tiền</h3>
                {loading ? (
                    <div className="loader-container">
                        <HashLoader color="#fff" size={30} />
                    </div>
                ) : (
                    <>
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Mã giao dịch</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                    <th>Số tiền</th>
                                    <th>Phương thức</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTransactions.length > 0 ? (
                                    currentTransactions.map((tx) => (
                                        <tr key={tx.transactionId}>
                                            <td>{tx.transactionId}</td>
                                            <td className={`${statusClass(tx.transactionStatus)} transaction-status`}>{formatStatus(tx.transactionStatus)}</td>
                                            <td>{new Date(tx.updatedAt).toLocaleString()}</td>
                                            <td>{tx.amount.toLocaleString()}đ</td>
                                            <td>{transactionHistoryPaymentMethodText(tx.paymentMethod)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Không có giao dịch nào.</td>
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
                                    <GrFormPrevious className="pagination-icon"/>
                                </button>
                                <span className="pagination-info">
                                    {currentPage}
                                </span>
                                <button
                                    className="pagination-btn"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    <GrFormNext className="pagination-icon"/>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AccountLayout>
    );
};

export default DepositHistory;
