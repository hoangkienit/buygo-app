import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './admin-product-detail.css'
import { HashLoader } from 'react-spinners';
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { deleteProductForAdmin, getProductForAdmin } from '../../api/product.api';
import { FaCopy } from "react-icons/fa6";
import { productAttributesStatusText, productTypeText } from '../../utils';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ConfirmModal from '../../components/modal/confirm-modal';
import Slider from "react-slick";
import { sliderSettings } from '../../utils/slider-settings';

export const AdminProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Admin - ${productId}`;
        fetchProductData();
    }, [productId]);
    
    const fetchProductData = async () => {
        setLoading(true);
        try {
            const res = await getProductForAdmin(productId);

            if (res.success) {
                setProduct(res.data.product);
            }
        }
        catch (error) {
            showToast(error.message, "error");
        }
        finally {
            setLoading(false);
        }
    }

    const copyToClipboard = async(text) => {
        const permission = await navigator.permissions.query({ name: "clipboard-write" });
        if (permission.state === "denied") {
        console.warn("Clipboard permission denied.");
            return;
        }

        await navigator.clipboard.writeText(text);
        showToast("Đã copy dữ liệu", "success");
    };

    const handleDeleteProduct = async (productId) => {
                setLoading(true);
                setIsModalOpen(false);
                try {
                    const res = await deleteProductForAdmin(productId);
        
                    if (res.success) {
                        navigate("/super-admin/products")
                        showToast("Xóa sản phẩm thành công", "success");
                    }
                } catch (error) {
                    showToast(error.message, "error");
                }
                finally {
                    setLoading(false);
                }
            }

    if (loading) {
        return (
            <div className="loader-container">
            <HashLoader color="#092339"/>
        </div>
        )
    }
    
    return (
        <div className='admin-product-detail-container'>
            <span className='tab-nav-title'><a href='/super-admin/products'>Sản phẩm</a> / {product?.product_name}</span>
            <div className='action-button-container'>
                                            <button onClick={() => navigate(`/super-admin/products/edit/${productId}`)} className="edit-btn product-detail-action-button"><FaEdit className="action-icon" /></button>
                                        <button onClick={() => { 
                                            setIsModalOpen(true);
                                        }} className="delete-btn product-detail-action-button"><MdDelete className="action-icon" /></button>

            </div>
            <div className='product-detail-info-container'>
                <div className='product-detail-left-side'>
                    {/* <div className='product-detail-img-slider'>
                        <Slider {...sliderSettings}>
                        {product?.product_imgs.map((banner, index) => (
                        <div key={index} className='img-container'>
                            <img src={banner} alt={`Banner ${index + 1}`} className="product-detail-image" />
                        </div>
                        ))}
                    </Slider>
                    </div> */}
                    {/* <img loading='lazy' className='product-detail-image' src={require('./../../assets/images/test-img.jpg')} alt='product-img'></img> */}
                </div>
                <div className='product-detail-right-side'>
                    <h3 className='product-detail-title'>Thông tin sản phẩm</h3>
                    {/** Product ID */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Mã sản phẩm`} disabled />
                        <input className='product-detail-input' value={`${product?.productId}`} disabled />
                        <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.productId}`)}/>
                    </div>

                    {/** Product Name */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Tên sản phẩm`} disabled />
                        <input className='product-detail-input' value={`${product?.product_name}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_name}`)}/> */}
                    </div>

                    {/** Product Des */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Mô tả`} disabled />
                        <input className='product-detail-input' value={`${product?.product_description}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_description}`)}/> */}
                    </div>

                    {/** Product Type */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Loại sản phẩm`} disabled />
                        <input className='product-detail-input' value={`${productTypeText(product?.product_type)}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_type}`)}/> */}
                    </div>

                    {/** Product Category */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Danh mục`} disabled />
                        <input className='product-detail-input' value={`${product?.product_category}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_category}`)}/> */}
                    </div>

                    {/** Product Status */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Trạng thái`} disabled />
                        <input className='product-detail-input' value={`${product?.product_status === 'active' ? "Hoạt động" : "Không hoạt động"}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_category}`)}/> */}
                    </div>

                    {/** Product Stock */}
                    {
                        product?.product_type === 'game_account' &&
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Số lượng tài khoản`} disabled />
                        <input className='product-detail-input' value={`${product?.product_attributes?.account?.length}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_category}`)}/> */}
                    </div>
                    }

                    {
                        product?.product_type === 'topup_package' &&
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Số lượng gói nạp`} disabled />
                        <input className='product-detail-input' value={`${product?.product_attributes?.packages?.length}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_category}`)}/> */}
                    </div>
                    }

                    {/** Product Sold Amount */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Đã bán`} disabled />
                        <input className='product-detail-input' value={`${product?.product_sold_amount}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_category}`)}/> */}
                    </div>

                    {/** Product Total Review */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Tổng đánh giá`} disabled />
                        <input className='product-detail-input' value={`${product?.totalReviews}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_category}`)}/> */}
                    </div>

                    {/** Product Avg Rating */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Đánh giá`} disabled />
                        <input className='product-detail-input' value={`${product?.averageRating}`} disabled />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_category}`)}/> */}
                    </div>

                </div>
            </div>
            <div className='product-attributes-transactions-container'>
                <div className='product-attributes-container'>
                    {product?.product_type === 'game_account' ? <p className='attribute-title'>Tài khoản</p> : <p className='attribute-title'>Gói nạp</p>}
                    {product?.product_type === 'game_account' &&
                        <table className='product-attributes-table'>
                        <thead className='product-attributes-table-thead'>
                            <tr>
                                <th>STT</th>
                                <th>Tài khoản</th>
                                <th>Mật khẩu</th>
                                <th>Tình trạng</th>
                            </tr>
                        </thead>
                        <tbody className='product-attributes-table-tbody'>
                                {product?.product_attributes?.account?.map((acc, index) => (
                                <tr key={index}>
                                    <td>{ index+1}</td>
                                    <td>{acc.username }</td>
                                    <td>{acc.password }</td>
                                    <td>{acc.sold ? "Đã bán" : "Chưa bán"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }

                    {product?.product_type === 'topup_package' &&
                        <table className='product-attributes-table'>
                        <thead className='product-attributes-table-thead'>
                            <tr>
                                <th>STT</th>
                                <th>Tên gói nạp</th>
                                <th>Giá</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className='product-attributes-table-tbody'>
                                {product?.product_attributes?.packages?.map((pack, index) => (
                                <tr key={index}>
                                    <td>{ index+1 }</td>
                                    <td>{ pack.name}</td>
                                    <td>{ pack.price.toLocaleString()}</td>
                                    <td>{ productAttributesStatusText(pack.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }
                </div>

                <div className='product-transactions-container'>
                    <p className='attribute-title'>Đơn hàng gần đây</p>
                </div>
            </div>
            <ToastNotification></ToastNotification>
            <ConfirmModal isOpen={isModalOpen} onConfirm={() => handleDeleteProduct(productId)} onClose={() => setIsModalOpen(false)} message={'Xác nhận bạn đang xóa một sản phẩm'} title={'Xóa sản phẩm'}/>
        </div>
    )
}
