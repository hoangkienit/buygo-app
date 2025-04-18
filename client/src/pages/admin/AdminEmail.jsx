import { useEffect, useState } from "react";
import "./admin-email.css";
import { MdOutlineAdd } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import ToastNotification, {
  showToast,
} from "../../components/toasts/ToastNotification";
import AddEmailModal from "../../components/modal/add-email-modal";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { deleteEmailForAdmin, getAllEmailsForAdmin } from "../../api/gmail.api";
import ConfirmModal from "../../components/modal/confirm-modal";

const ITEMS_PER_PAGE = 8;

export const AdminEmail = () => {
  const [searchInput, setSearchInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState("");

  useEffect(() => {
    document.title = "Admin - Email";
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [currentPage, searchInput]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await getAllEmailsForAdmin(ITEMS_PER_PAGE, currentPage);

      if (response.success) {
        let filtered = response.data.emails;

        if (searchInput.trim()) {
          filtered = filtered.filter((em) =>
            em.email.toLowerCase().includes(searchInput.toLowerCase())
          );
        }
        setEmails(filtered);
        setTotalPages(response.data.totalPages || 1);
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

  const handleDeleteEmail = async () => {
    try {
      setLoading(true);
        setIsDeleteModalOpen(false);
      const res = await deleteEmailForAdmin(selectedIdToDelete);

      if (res.success) {
        showToast("Xóa email thành công", "success");
        setEmails(emails.filter((em) => em._id !== selectedIdToDelete));
        setSelectedIdToDelete("");
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
    <div className="admin-email-container">
      <ToastNotification />
      <AddEmailModal
        title="Thêm Email"
        message="Email và mật khẩu sẽ được tạo tự động"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setEmails={setEmails}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteEmail}
        onClose={() => setIsDeleteModalOpen(false)}
        message={"Xác nhận bạn đang xóa một email"}
        title={"Xóa email"}
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
              emails.map((email, index) => (
                <tr key={email._id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{email._id}</td>
                  <td>{email.email}</td>
                  <td>{email.password}</td>
                  <td>{new Date(email.createdAt).toLocaleString()}</td>
                  <td className="action-cell">
                    <div className="action-buttons-container">
                      <button
                        onClick={() => {
                          setSelectedIdToDelete(email._id);
                          setIsDeleteModalOpen(true);
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
                <td colSpan="6">Không có email</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
