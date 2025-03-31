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

const ITEMS_PER_PAGE = 8;

export const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState("");
    const [selectedProductType, setSelectedProductType] = useState("game_account");
    const [searchInput, setSearchInput] = useState("");
    const [openActionId, setOpenActionId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        const matchesStatus = selected === "" || selected === "all" || product.productStatus === selected;
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
                        <th>Hình ảnh</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Số tiền</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.length > 0 ? (
    currentProducts
        .filter((tx) => tx.product_type === "game_account") // Only include game_account products
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
                <td>{tx.productId}</td>
                <td><a className="table-product-name">{tx.product_name}</a></td>
                <td>{tx.product_attributes?.price?.toLocaleString()}đ</td>
                <td>{tx.product_stock}</td>
                <td>
                    <div className={`transaction-status ${tx.product_status === "active" ? "product-active" : "product-inactive"}`}>
                        {tx.product_status}
                    </div>
                </td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="action-cell">
                    {
                        isMobile ? 
                            <div className="action-buttons-container">
                        <FaEye className="view-btn action-button"/>
                        <FaEdit  className="edit-btn action-button"/>
                        <MdDelete className="delete-btn action-button"/>
                            </div> 
                            :
                            <>
                                <button
                        className="action-container"
                        onClick={() => setOpenActionId(openActionId === tx.productId ? null : tx.productId)}
                    >
                        <HiDotsVertical />
                    </button>
                    {openActionId === tx.productId && (
                        <div ref={modalRef} className="action-modal">
                            <button className="view-btn">Xem</button>
                            <button className="edit-btn">Chỉnh sửa</button>
                            <button className="delete-btn">Xóa</button>
                        </div>
                    )}
                            </>
                    }
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
