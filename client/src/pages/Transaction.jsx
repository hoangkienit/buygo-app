import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/transaction.css";
import AccountLayout from "../layouts/AccountLayout";
import { HashLoader } from "react-spinners";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { handleUnauthorizedError } from "../utils/handleError";
import { getTransactionList } from "../api/transaction.api";

const transactionsData = [
    { transactionId: "GD56789", amount: 50000, date: Date.now(), status: "pending", gateway: "Vietcombank" },
    { transactionId: "GD543678", amount: 100000, date: Date.now(), status: "success", gateway: "TP BANK" },
    { transactionId: "GD34521", amount: 1000000, date: Date.now(), status: "failed", gateway: "Sacombank" },
    { transactionId: "GD56421", amount: 200000, date: Date.now(), status: "success", gateway: "Agribank" },
    { transactionId: "GD12543", amount: 75000, date: Date.now(), status: "pending", gateway: "MB Bank" },
    { transactionId: "GD87654", amount: 850000, date: Date.now(), status: "failed", gateway: "Vietinbank" },
    { transactionId: "GD43567", amount: 120000, date: Date.now(), status: "success", gateway: "BIDV" },
    { transactionId: "GD98432", amount: 55000, date: Date.now(), status: "pending", gateway: "Techcombank" },
    { transactionId: "GD76432", amount: 340000, date: Date.now(), status: "success", gateway: "TP BANK" },
    { transactionId: "GD87432", amount: 130000, date: Date.now(), status: "pending", gateway: "Vietcombank" }
];

const ITEMS_PER_PAGE = 8;

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const res = await getTransactionList(20);
                if (res.success) {
                    setTransactions(res.data.transactions);
                }
            } catch (error) {
                console.log(error);
                handleUnauthorizedError(error.message, navigate);
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
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                    <th>Số tiền</th>
                                    <th>Ngân hàng</th>
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
                                            <td>{tx.gateway === 'empty_gateway' ? "NA" : tx.gateway}</td>
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

export default Transaction;
