import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/transaction.css";
import AccountLayout from "../layouts/AccountLayout";
import { HashLoader } from "react-spinners";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { getTransactionHistoryList } from "../api/transaction.api";
import showToast from '../components/toasts/ToastNotification';
import { transactionHistoryPaymentMethodText } from "../utils";


const ITEMS_PER_PAGE = 8;

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const res = await getTransactionHistoryList(50);
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

    const statusClass = (status) => {
        switch (status) {
            case "pending":              
                return "pending-status";
            case "success":               
                return "success-status";
            case "failed":              
                return "failed-status";     
            default:
                return ""; 
        }
    };


    return (
        <AccountLayout title={'Lịch sử giao dịch'}>
            <div className="transaction-container">
                <h3 className="transaction-title">Lịch sử giao dịch</h3>
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
                                    <th>Số tiền</th>
                                    <th>Loại</th>
                                    <th>Nội dung</th>
                                    <th>Số dư</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTransactions.length > 0 ? (
                                    currentTransactions.map((tx) => (
                                        <tr key={tx.transactionId}>
                                            <td>{tx.transactionId}</td>
                                            {tx.transactionType === 'add' ?
                                                <td className="add-balance">+{tx.amount.toLocaleString() || 0}đ</td>
                                                :
                                                <td className="sub-balance">-{tx.amount.toLocaleString() || 0}đ</td>
                                            }
                                            <td>{tx.transactionType === 'add' ? "Tiền vào":"Tiền ra"}</td>
                                            <td>{tx.note}</td>
                                            <td className="transaction-balance">{tx.balance.toLocaleString() || 0}đ</td>
                                            <td>{new Date(tx.updatedAt).toLocaleString()}</td>
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

export default TransactionHistory;
