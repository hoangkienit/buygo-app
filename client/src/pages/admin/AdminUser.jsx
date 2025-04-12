import React, { useEffect, useRef, useState } from "react";
import "./admin-payment.css";
import { FaSearch } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import { FaEye } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ToastNotification, {
  showToast,
} from "../../components/toasts/ToastNotification";
import { userStatusText } from "../../utils";
import ConfirmModal from "../../components/modal/confirm-modal";
import { getAllUsersForAdmin } from "../../api/user.api";
import "./admin-user.css";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;
export const AdminUser = () => {
  const { user } = useUser();
  const [searchInput, setSearchInput] = useState("");
  const [selectedUserStatusType, setSelectedUserStatusType] = useState("");
  const [users, setUsers] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState("");
  const navigate = useNavigate();

  const modalRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersForAdmin();

      console.log(res);
      if (res.success) {
        setUsers(res.data.users || []);
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

  // Filter products based on search & status selection
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user._id.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.username.toLowerCase().includes(searchInput.toLowerCase());
    const matchesStatus =
      selectedUserStatusType === "" ||
      selectedUserStatusType === "all" ||
      user.status === selectedUserStatusType;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers?.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers?.slice(
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

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    setIsModalOpen(false);
    try {
      //   const res = await deleteTransactionForAdmin(userId);
      //   if (res.success) {
      //     // Remove transaction from state
      //     setTransaction(
      //       transactions.filter(
      //         (transaction) => transaction.transactionId !== transactionId
      //       )
      //     );
      //     showToast("Xóa giao dịch thành công", "success");
      //     setSelectedIdToDelete("");
      //   }
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
      <p className="tab-nav-title">Danh sách người dùng</p>
      <div className="admin-product-header">
        <div className="search-filter-container">
          <div className="header-search-input-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng hoặc ID"
              className="header-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <select
            className="filter-selection"
            value={selectedUserStatusType}
            onChange={(e) => {
              setSelectedUserStatusType(e.target.value);
            }}
          >
            <option value="" disabled>
              Bộ lọc
            </option>
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Bị cấm</option>
          </select>
        </div>
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>Vai trò</th>
              <th>Số dư</th>
              <th>Trạng thái</th>
              <th>Tạo lúc</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((tx, index) => (
                <tr key={tx?._id}>
                  <td>{index + 1}</td>
                  <td>{tx?._id}</td>
                  <td>
                    <a onClick={() => tx?._id !== user?._id && navigate(`/super-admin/users/view/${tx?._id}`)} className="table-product-name">{tx?.username}</a>
                  </td>
                  <td>
                    <div className={`user-role-container ${tx?.role}`}>
                      {tx?.role}
                    </div>
                  </td>
                  <td style={{ color: "#3498db" }}>
                    {tx?.balance.toLocaleString() || 0}đ
                  </td>
                  <td>{userStatusText(tx?.status)}</td>
                  <td>{new Date(tx?.createdAt).toLocaleString()}</td>
                  <td className="action-cell">
                    <div className="action-buttons-container">
                      {tx?._id !== user?._id && (
                        <>
                          <button
                            onClick={() => navigate(`/super-admin/users/view/${tx?._id}`)}
                            className="view-btn action-button"
                          >
                            <FaEye className="action-icon" />
                          </button>
                          <button
                            onClick={() => navigate(`/super-admin/users/edit/${tx?._id}`)}
                            className="edit-btn action-button"
                          >
                            <FaEdit className="action-icon" />
                          </button>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedIdToDelete(tx?._id);
                            }}
                            className="delete-btn action-button"
                          >
                            <MdDelete className="action-icon" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">Không có người dùng</td>
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
      <ToastNotification />
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={() => handleDeleteUser(selectedIdToDelete)}
        onClose={() => setIsModalOpen(false)}
        message={"Hãy chắc chắn rằng bạn đang xóa một người dùng, điều này sẽ xóa tất cả những dữ liệu về người dùng này."}
        title={"Xóa người dùng"}
      />
    </div>
  );
};
