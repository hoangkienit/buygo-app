import React, { useEffect, useRef, useState } from 'react'
import './admin-add-product.css'
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';


export const AdminAddProduct = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [displayPrice, setDisplayPrice] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        showToast("hello", "success");
        showToast("hello", "error");
    }, []);

    const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Generate preview
    }
    };
    
    const handleImgClick = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    const handleFormatPrice = (price) => {
        const numericValue = price.replace(/\D/g, "");

        if (numericValue === "") {
            setPrice("");
            setDisplayPrice("");
            return;
        }
    
        // Convert to number and format
        const formattedPrice = Number(numericValue).toLocaleString();

        setPrice(numericValue);
        setDisplayPrice(formattedPrice);
    }

    const handleAdd = async() => {
        try {
            
        } catch (error) {
            
        }
    }

    return (
        <div className='admin-add-product-container'>
            <span className='tab-nav-title'><a href='/super-admin/products'>Sản phẩm</a> / Thêm sản phẩm</span>
            <div className='product-info-container'>
                <div className='product-left-side'>
                    <div className='basic-info-container'>
                        <div className='basic-info-header-container'><h3 className='basic-info-title'>Thông tin cơ bản</h3></div>
                        <div className='input-container'>
                            <p className='input-title'>Tên sản phẩm</p>
                            <input required className='input-field' placeholder=''/>
                        </div>
                        <div className='input-container'>
                            <p className='input-title'>Mô tả sản phẩm</p>
                            <textarea required className='description-input-field' placeholder=''/>
                        </div>
                    </div>
                    <div className='add-image-container'>
                        <div className='basic-info-header-container'><h3 className='basic-info-title'>Chọn ảnh</h3></div>
                        <div className='upload-img-button-container'>
                            <a className='upload-img-button' onClick={handleImgClick}>
                                <p className='upload-img-text'>Chọn ảnh sản phẩm</p>
                            </a>
                            <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{ display: "none" }} // Hide input
                            onChange={handleFileChange}
                        />
                        </div>
                        <h4 style={{color: "red", fontFamily: 'montserrat-md', fontSize: "13px"}}>*Lưu ý khi tải ảnh lên ảnh sẽ xuất hiện phía dưới</h4>
                        {/* Preview Image */}
                        {preview && (
                            <div className="preview-container">
                                <img src={preview} alt="Preview" className="preview-image" />
                            </div>
                        )}
                    </div>
                </div>
                <div className='product-right-side'>
                    <div className='choose-category-price-container'>
                        <div className='basic-info-header-container'><h3 className='basic-info-title'>Danh mục</h3></div>
                        <select
                        className="category-selection"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                        }}
                        >
                        <option value="" disabled>Chọn danh mục sản phẩm</option>
                        <option value="topup_package">Gói nạp</option>
                        <option value="game_account">Tài khoản game</option>
                        </select>
                        <div className='pricing-container'>
                            <div className='price-side'>
                                <p className='pricing-input-title'>Giá</p>
                                <input inputMode="numeric" onChange={(e) => handleFormatPrice(e.target.value)} value={displayPrice} className='price-amount-input' required></input>
                            </div>
                            <div className='currency-side'>
                                <p className='pricing-input-title'>Tiền tệ</p>
                                <input className='price-currency-input' placeholder='đ' disabled/>
                            </div>
                            
                        </div>
                    </div>
                    <div className='select-item-status-stock-container'>
                        <div className='basic-info-header-container'><h3 className='basic-info-title'>Khác</h3></div>
                        <div className='select-item-status-container'>
                            <p className='select-item-status-title'>Trạng thái sản phẩm</p>
                            <select
                            className="status-selection"
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                            }}
                            >
                                <option value="" disabled>Chọn</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className='stock-container'>
                            <p className='select-item-status-title'>Tồn kho</p>
                            <input type='number' inputMode="numeric" onChange={(e) => setStock(e.target.value.replace(/\D/g, ''))} className='price-amount-input' required></input>
                        </div>
                    </div>
                    <div className='submit-discard-buttons-container'>
                        <button disabled={loading} className={`add-button ${loading ? "disabled-button" : ""}`}>{loading ? <ClipLoader color='#fff' size={20}/> : "Thêm" }</button>
                        <button className='discard-button' onClick={() => navigate('/super-admin/products')}>Hủy bỏ</button>
                    </div>
                </div>
            </div>
            {/** Toast */}
            <ToastNotification/>
        </div>
    )
}
