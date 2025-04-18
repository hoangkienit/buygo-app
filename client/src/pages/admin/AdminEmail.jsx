import { useEffect, useState } from "react";
import "./admin-email.css";
import { MdOutlineAdd } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import ToastNotification from "../../components/toasts/ToastNotification";
import AddEmailModal from "../../components/modal/add-email-modal";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

export const AdminEmail = () => {
  const [searchInput, setSearchInput] = useState("");
  const [emails, setEmails] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIdToDelete, setSelectedIdToDelete] = useState("");

  useEffect(() => {
    document.title = "Admin - Email";
  }, [currentPage, searchInput]);
    
    const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <HashLoader color="#092339" />
      </div>
    );
  }

  return (
    <div className="admin-email-container">
      <ToastNotification />
      <AddEmailModal
        title={"Thêm Email"}
        message={
          "Thêm một email mới. Bạn chỉ cần nhập mật khẩu cho email này vì email sẽ được tạo tự động."
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <p className="tab-nav-title">Danh sách email</p>
      <div className="admin-product-header">
        <div className="search-filter-container">
          <div className="header-search-input-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo email"
              className="header-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
          className="add-product-button-container"
        >
          <MdOutlineAdd className="add-icon" />
          <p className="add-text">Thêm email mới</p>
        </a>
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>Email</th>
              <th>Mật khẩu</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {emails.length > 0 ? (
              emails.map((tx, index) => (
                <tr key={tx._id}>
                  <td>{index + 1}</td>
                  <td>{tx.transactionId}</td>
                  <td>
                    <a className="table-product-name">{tx.userId?.username}</a>
                  </td>
                  <td className="transaction-price">
                    {tx.amount.toLocaleString() || 0}
                  </td>
                  <td style={{ color: "#3498db" }}>
                    {}
                  </td>
                  <td>
                    <div
                      className={`transaction-status`}
                    >
                      {}
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
                <td colSpan="9">Không có email</td>
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
    </div>
  );
};
