import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './admin-product-detail.css';
import './admin-edit-product.css';
import { HashLoader } from 'react-spinners';
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { deleteAccountFromProductForAdmin, deletePackageFromProductForAdmin, getProductForAdmin, updateAccountProductForAdmin, updateTopUpProductForAdmin } from '../../api/product.api';
import { FaCopy } from "react-icons/fa6";
import { productAttributesStatusText, productTypeText } from '../../utils';
import { MdDelete } from "react-icons/md";
import { MdOutlineAdd } from "react-icons/md";
import AddItemModal from '../../components/modal/add-item-modal';
import ConfirmModal from '../../components/modal/confirm-modal';

export const AdminEditProduct = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productStock, setProductStock] = useState(0);
    const [productStatus, setProductStatus] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false); // Add item modal
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Delete item modal

    const [selectedItemToDelete, setSelectedItemToDelete] = useState("");

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

                setProductName(res.data.product.product_name);
                setProductDescription(res.data.product.product_description);
                setProductStatus(res.data.product.product_status);
                setProductStock(res.data.product.product_stock);

                if (res.data.product.product_type === 'game_account') {
                    setProductPrice(res.data.product.product_attributes.price);
                }
            }
        }
        catch (error) {
            navigate("/super-admin/products");
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

    const handleUpdateProduct = async () => {
        setLoading(true);
        try {
            let res = null;
            if (product?.product_type === 'game_account') {
                res = await updateAccountProductForAdmin(
                    productId,
                    productName,
                    productDescription,
                    productStatus,
                    productPrice,
                    productStock
                );        
            } else if (product?.product_type === 'utility_account') {
                res = await updateAccountProductForAdmin(
                    productId,
                    productName,
                    productDescription,
                    productStatus,
                    productPrice,
                    1
                ); 
            }
            
            else if (product?.product_type === 'topup_package') {
                res = await updateTopUpProductForAdmin(
                    productId,
                    productName,
                    productDescription,
                    productStatus,
                );
            }
                    
            if (res.success) {
                showToast("Cập nhật sản phẩm thành công", "success");
                setProduct(res.data.updatedProduct);
            }
        } catch (error) {
            showToast(error.message, "error");
        }
        finally {
                setLoading(false);
        }
    }

    const handleDeleteProductAttributes = async () => {
        setLoading(true);
        setIsConfirmModalOpen(false);
        try {
            let res = null;
            if (product?.product_type === 'utility_account') {
                res = await deleteAccountFromProductForAdmin(productId, selectedItemToDelete);
                setProduct({
                    ...product,
                    product_attributes: {
                        ...product.product_attributes,
                        account: res.data.updatedAccounts
                    }
                })
            } else if (product?.product_type === 'topup_package') {
                res = await deletePackageFromProductForAdmin(productId, selectedItemToDelete);
                setProduct({
                    ...product,
                    product_attributes: {
                        ...product.product_attributes,
                        packages: res.data.updatedPackages
                    }
                })
            }
            
            if (res.success) {
                showToast("Xóa thành công", "success");
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
            <span className='tab-nav-title'><a href='/super-admin/products'>Danh sách sản phẩm</a> / {product?.product_name}</span>
            <div className='product-detail-info-container'>
                <div className='product-detail-left-side'>
                    <img loading='lazy' className='product-detail-image' src={require('./../../assets/images/test-img.jpg')} alt='product-img'></img>
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
                        <input onChange={(e) => setProductName(e.target.value)} placeholder={product?.product_name} className='product-detail-input' value={productName} />
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_name}`)}/> */}
                    </div>

                    {/** Product Des */}
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Mô tả`} disabled />
                        <input className='product-detail-input' placeholder={product?.product_description} value={productDescription} onChange={(e) => setProductDescription(e.target.value)}/>
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_description}`)}/> */}
                    </div>

                    {/** Product Price */}
                    {product?.product_type === 'game_account' || product?.product_type === 'utility_account' &&
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Giá`} disabled />
                        <input type='text' className='product-detail-input' placeholder={product?.product_attributes?.price?.toLocaleString()} value={productPrice.toLocaleString('vi-VN')} onChange={(e) => setProductPrice(Number(e.target.value.replace(/\D/g, '')))}/>
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_description}`)}/> */}
                    </div>
                    }

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
                        <select onChange={(e) => setProductStatus(e.target.value)} className='product-detail-input' value={productStatus} placeholder={product?.product_status}>
                            <option value={'active'}>Hoạt động</option>
                            <option value={'inactive'}>Không hoạt động</option>
                        </select>
                    </div>

                    {/** Product Stock */}
                    {
                        product?.product_type === 'game_account' &&
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Số lượng tài khoản`} disabled />
                        <input className='product-detail-input' value={productStock} onChange={(e) => setProductStock(Number(e.target.value.replace(/\D/g, '')))}/>
                        {/* <FaCopy className='product-detail-copy-icon' onClick={() => copyToClipboard(`${product?.product_category}`)}/> */}
                    </div>
                    }

                    {
                        product?.product_type === 'utility_account' &&
                    <div className='product-detail-input-container'>
                        <input className='product-detail-input-title' value={`Số lượng tài khoản`} disabled />
                        <input className='product-detail-input' value={product?.product_attributes?.account.length} disabled/>
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
                    <div className='product-attribute-title-button-container'>
                        <p className='attribute-title'>{productTypeText(product?.product_type) }</p>
                        {product?.product_type !== 'game_account' &&
                            <a style={{cursor: "pointer"}} onClick={() => setIsModalOpen(true)} className="add-product-button-container">
                                <MdOutlineAdd className="add-icon" />
                                <p className="add-text">Thêm mới</p>
                            </a>
                        }
                    </div>
                    {product?.product_type === 'game_account' &&
                        <table className='product-attributes-table'>
                        <thead className='product-attributes-table-thead'>
                            <tr>
                                <th>STT</th>
                                <th>Tài khoản</th>
                                <th>Mật khẩu</th>
                                <th>Tình trạng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className='product-attributes-table-tbody'>
                            <td colSpan={5}>Không có tài khoản</td>
                        </tbody>
                    </table>
                    }

                    {product?.product_type === 'utility_account' &&
                        <table className='product-attributes-table'>
                        <thead className='product-attributes-table-thead'>
                            <tr>
                                <th>STT</th>
                                <th>Tài khoản</th>
                                <th>Mật khẩu</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className='product-attributes-table-tbody'>
                                {product?.product_attributes?.account?.map((acc, index) => (
                                <tr key={index}>
                                    <td>{ index+1 }</td>
                                    <td>{ acc.username}</td>
                                    <td>{ acc.password}</td>
                                    <td>{acc.sold ? "Đã bán" : "Chưa bán"}</td>
                                    <td><button onClick={() => {
                                        setIsConfirmModalOpen(true);
                                        setSelectedItemToDelete(acc._id);
                                    }} className='delete-btn action-button'><MdDelete className="action-icon" /></button></td>
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
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className='product-attributes-table-tbody'>
                                {product?.product_attributes?.packages?.map((pack, index) => (
                                <tr key={index}>
                                    <td>{ index+1 }</td>
                                    <td>{ pack.name}</td>
                                    <td>{ pack.price.toLocaleString()}</td>
                                        <td>{productAttributesStatusText(pack.status)}</td>
                                        <td><button onClick={() => {
                                            setIsConfirmModalOpen(true);
                                            setSelectedItemToDelete(pack._id);
                                        }} className='delete-btn action-button'><MdDelete className="action-icon" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }
                </div>

                <div className='product-transactions-container'>
                    <div className='action-button-container'>
                        <button onClick={handleUpdateProduct} className='edit-product-update-button'>Cập nhật</button>
                        <button className='edit-product-discard-button'>Hủy bỏ</button>
                    </div>
                </div>
            </div>
            <ToastNotification></ToastNotification>
            <AddItemModal productId={productId} isOpen={isModalOpen} selectedType={product?.product_type} onClose={() => setIsModalOpen(false)} setProduct={setProduct} product={product}/>
            <ConfirmModal isOpen={isConfirmModalOpen} onConfirm={handleDeleteProductAttributes} onClose={() => setIsConfirmModalOpen(false)} message={'Bạn có chắc chắn muốn tiếp tục không?'} title={''}/>
        </div>
    )
}
