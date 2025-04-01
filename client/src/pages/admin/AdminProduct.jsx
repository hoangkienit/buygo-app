import React, { useEffect, useRef, useState } from "react";
import "./admin-product.css";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAdd } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { HashLoader } from "react-spinners";
import { getProducts } from "../../api/product.api";
import { FaEye } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { showToast } from "../../components/toasts/ToastNotification";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

export const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState("");
    const [selectedProductType, setSelectedProductType] = useState("game_account");
    const [searchInput, setSearchInput] = useState("");
    const [openActionId, setOpenActionId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProductData();
        document.title = 'Admin - Sản phẩm'
    }, []);

    const fetchProductData = async () => {
        try {
            setLoading(true);

            const res = await getProducts();

            if (res.success) {
                setProducts(res.data.products);
            }
        }
        catch (error) {
            console.log(error);
            showToast(error.message, "error");
        }
        finally {
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
    // Filter products based on search & status selection
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.productId.toLowerCase().includes(searchInput.toLowerCase());
        const matchesStatus = selected === "" || selected === "all" || product.product_status === selected;
        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const currentProducts = filteredProducts.slice(
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

    if (loading) {
        return <div className="loader-container">
            <HashLoader color="#092339"/>
        </div>
    }

    return (
        <div className="admin-product-container">
            <p className="tab-nav-title">Sản phẩm</p>
            <div className="admin-product-header">
                <div className="search-filter-container">
                    <div className="header-search-input-container">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã sản phẩm"
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
                        <option value="" disabled>Bộ lọc</option>
                        <option value="all">Tất cả</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                    <select
                        className="filter-selection"
                        value={selectedProductType}
                        onChange={(e) => {
                            setSelectedProductType(e.target.value);
                        }}
                    >
                        <option value="game_account">Tài khoản game</option>
                        <option value="topup_package">Gói nạp</option>
                    </select>
                </div>
                <a href="/super-admin/products/add-product" className="add-product-button-container">
                    <MdOutlineAdd className="add-icon" />
                    <p className="add-text">Thêm sản phẩm</p>
                </a>
            </div>

            <div className="product-table-container">
                <table className="product-table">
                <thead>
                    <tr>
                            {selectedProductType === 'game_account' &&
                                <>
                                <th>Hình ảnh</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Số tiền</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                        <th>Thao tác</th>
                                </>
                            }
                            
                            {selectedProductType === 'topup_package' &&
                                <>
                                <th>Hình ảnh</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng gói nạp</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                        <th>Thao tác</th>
                                </>
                        }
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.length > 0 ? (
    currentProducts
        .filter((tx) => tx.product_type === selectedProductType)
        .map((tx) => (
            <tr key={tx.productId}>
                <td>
                    <img
                        className="table-product-img"
                        src={require("./../../assets/images/test-img.jpg")}
                        alt="product-img"
                        loading="lazy"
                    />
                </td>
                <td className="productId">{tx.productId}</td>
                <td><a className="table-product-name">{tx.product_name}</a></td>
                {selectedProductType === 'game_account' &&
                    <>
                  <td>{tx.product_attributes?.price?.toLocaleString()}</td>
                <td>{tx.product_stock}</td>  
                </>
                }

                {selectedProductType === 'topup_package' &&
                    <>
                <td>{tx.product_attributes?.packages?.length}</td>  
                </>
                }
                <td>
                    <div className={`transaction-status ${tx.product_status === "active" ? "product-active" : "product-inactive"}`}>
                        {tx.product_status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </div>
                </td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="action-cell">
                    <div className="action-buttons-container">
                            <button onClick={() => navigate(`/super-admin/products/view/${tx.productId}`)} className="view-btn action-button"><FaEye className="action-icon" /></button>
                            <button className="edit-btn action-button"><FaEdit className="action-icon" /></button>
                            <button className="delete-btn action-button"><MdDelete className="action-icon" /></button>
                    </div>
                </td>
            </tr>
        ))
) : (
    <tr>
        <td colSpan="8">Không có sản phẩm nào</td>
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
        </div>
    );
};
