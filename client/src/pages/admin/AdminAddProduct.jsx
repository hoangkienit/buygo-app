import React, { useEffect, useRef, useState } from 'react'
import './admin-add-product.css'
import ToastNotification, { showToast } from '../../components/toasts/ToastNotification';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { addNewAccountProduct as addNewProduct } from '../../api/product.api';
import { getProductTypeObject } from '../../utils';


export const AdminAddProduct = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedType, setSelectedType] = useState("game_account");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [displayPrice, setDisplayPrice] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");

    const [amount, setAmount] = useState("");
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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

    useEffect(() => {
    const num = Number(amount);
        if (num > 0) {
            setFormData(() => 
                Array.from({ length: num }, () => getProductTypeObject(selectedType))
            );
        } else {
            setFormData([]);
        }
    }, [amount, selectedType]);  // Depend on selectedType



    const handleInputChange = (index, field, value) => {
        setFormData((prevData) =>
            prevData.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    };

    const handleAddProduct = async () => {
        setLoading(true);
        if (!image || !productName || !selectedType || !selectedStatus || !stock) {
            showToast("Bạn phải cung cấp đầy đủ thông tin");
            setLoading(false);
            return;
        }

        if (!validateInputs()) {
            showToast("Vui lòng điền đầy đủ thông tin tài khoản", "error");
            setLoading(false);
            return;
        }

        try {
            let response = null;
            response = await addNewProduct(
                    image,
                    productName,
                    productDescription,
                    selectedType,
                    "Mobile Game",
                    selectedStatus,
                    stock,
                    formData,
                    price
                );           

            if (response?.success) {
                showToast("Thêm sản phẩm thành công", "success");
                setProductName("");
                setProductDescription("");
                setPrice(0);
                setDisplayPrice("");
                setPreview(null);
                setImage(null);
                setSelectedStatus("");
                setAmount("");
                setStock(0);
            }
        }
        catch (error) {
            setLoading(false);
            showToast(error.message, "error");
        }
        finally {
            setLoading(false);

        }
    }

    const validateInputs = () => {
        const newErrors = formData.map((item) => {
        let error = {};
            if (selectedType === 'game_account') {
                if (!item.username) error.username = "Username is required.";
                if (!item.password) error.password = "Password is required.";
            }
            else if (selectedType === 'topup_package') {
                if (!item.name) error.username = "Username is required.";
                if (!item.price) error.password = "Password is required.";
            }
            return error;
            });
        return newErrors.every((error) => Object.keys(error).length === 0);
    };

    return (
        <div className='admin-add-product-container'>
            <span className='tab-nav-title'><a href='/super-admin/products'>Sản phẩm</a> / Thêm sản phẩm</span>
            <div className='product-info-container'>
                <div className='product-left-side'>
                    <div className='basic-info-container'>
                        <div className='basic-info-header-container'><h3 className='basic-info-title'>Thông tin cơ bản</h3></div>
                        <div className='input-container'>
                            <p className='input-title'>Tên sản phẩm</p>
                            <input value={productName} required className='input-field' placeholder='' onChange={(e) => setProductName(e.target.value)}/>
                        </div>
                        <div className='input-container'>
                            <p className='input-title'>Mô tả sản phẩm</p>
                            <textarea value={productDescription} required className='description-input-field' placeholder='' onChange={(e) =>setProductDescription(e.target.value)}/>
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
                        value={selectedType}
                        onChange={(e) => {
                            setSelectedType(e.target.value);
                            setAmount(0);
                        }}
                        >
                            <option value="" disabled>Loại sản phẩm</option>
                            <option value="topup_package">Gói nạp</option>
                            <option value="game_account">Tài khoản game</option>
                        </select>                   

                        {selectedType !== 'topup_package' ? <div className='pricing-container'>
                            <div className='price-side'>
                                <p className='pricing-input-title'>Giá</p>
                                <input inputMode="numeric" onChange={(e) => handleFormatPrice(e.target.value)} value={displayPrice} className='price-amount-input' required></input>
                            </div>
                            <div className='currency-side'>
                                <p className='pricing-input-title'>Tiền tệ</p>
                                <input className='price-currency-input' placeholder='đ' disabled/>
                            </div>
                            
                        </div> : null}
                    </div>
                    {/** This is for admin provide account info */}
                        {selectedType === "game_account" &&
                        <div className='add-product-account-container'>
                            <div className='basic-info-header-container'><h3 className='basic-info-title'>Thêm tài khoản</h3></div>
                            <input value={amount} onChange={(e) => {
                                setAmount(e.target.value);
                            }} type='number' className='account-number-input' placeholder='Nhập số lượng tài khoản'></input>
                            {formData.map((item, index) => (
                                <div key={index} className='account-input-container'>
                                    <p className='account-input-title'>Tài khoản {index + 1}</p>
                                    <div className='account-inputs'>
                                        <input
                                            onChange={(e) => handleInputChange(index, "username", e.target.value)}
                                            type='text'
                                            value={item.username}
                                            className='account-input'
                                            placeholder='Tài khoản'></input>
                                        <input
                                            onChange={(e) => handleInputChange(index, "password", e.target.value)}
                                            type='text'
                                            value={item.password}
                                            className='account-input'
                                            placeholder='Mật khẩu'></input>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                    {/* <button onClick={() => console.log(formData)}/> */}
                    {/** This is for admin provide top up package info */}
                        {selectedType === "topup_package" &&
                        <div className='add-product-account-container'>
                            <div className='basic-info-header-container'><h3 className='basic-info-title'>Thêm gói nạp</h3></div>
                            <input onChange={(e) => {
                                setAmount(e.target.value);
                            }} type='number' className='account-number-input' placeholder='Nhập số lượng gói nạp'></input>
                            {formData.map((item, index) => (
                                <div key={index} className='account-input-container'>
                                    <p className='account-input-title'>Gói nạp {index + 1}</p>
                                    <div className='account-inputs'>
                                        <input
                                            onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                            type='text'
                                            value={item.name}
                                            className='account-input'
                                            placeholder='Tên gói nạp'></input>
                                        <input
                                            onChange={(e) => handleInputChange(index, "price", Number(e.target.value.replace(/\D/g, '')))}
                                            // type='number'
                                            value={item.price ? item.price.toLocaleString('vi-VN') : 0}
                                            className='account-input'
                                            placeholder='Giá'></input>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                        }
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
                                <option value="active">Active (hiển thị)</option>
                                <option value="inactive">Inactive (không hiển thị)</option>
                            </select>
                        </div>
                        <div className='stock-container'>
                            <p className='select-item-status-title'>Tồn kho (số lượng)</p>
                            <input value={stock} placeholder='0' type='number' inputMode="numeric" onChange={(e) => setStock(Number(e.target.value.replace(/\D/g, '')))} className='price-amount-input' required></input>
                        </div>
                    </div>
                    <div className='submit-discard-buttons-container'>
                        <button onClick={handleAddProduct} disabled={loading} className={`add-button ${loading ? "disabled-button" : ""}`}>{loading ? <ClipLoader color='#fff' size={20}/> : "Thêm" }</button>
                        <button className='discard-button' onClick={() => navigate('/super-admin/products')}>Hủy bỏ</button>
                    </div>
                </div>
            </div>
            {/** Toast */}
            <ToastNotification/>
        </div>
    )
}
