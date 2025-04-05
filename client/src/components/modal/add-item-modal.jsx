import React, { useEffect, useState } from "react";
import "./add-item-modal.css";
import { getProductTypeObject } from "../../utils";
import { showToast } from "../toasts/ToastNotification";
import { ClipLoader } from "react-spinners";
import { addAccountToProductForAdmin, addPackageToProductForAdmin } from "../../api/product.api";

const AddItemModal = ({productId, isOpen, onClose, title, selectedType, setProduct, product }) => {
    const [formData, setFormData] = useState([]);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleUpdateProductAttributes = async () => {
        setLoading(true);

        if (!validateInputs()) {
            showToast("Vui lòng điền đầy đủ thông tin", "error");
            setLoading(false);
            return;
        }

        try {
            let res = null;
            if (selectedType === 'utility_account') {
                res = await addAccountToProductForAdmin(productId, formData);

                if (res.success) {
                    setProduct({
                        ...product,
                        product_attributes: {
                            price: product.product_attributes.price,
                            account: res.data.updatedAccounts
                        }
                    });

            }
            } else if (selectedType === 'topup_package') {
                res = await addPackageToProductForAdmin(productId, formData);

                if (res.success) {
                    setProduct({
                        ...product,
                        product_attributes: {
                            packages: res.data.updatedPackages
                        }
                    });
                }
            }
            
            showToast("Thêm mới thành công", "success");
            onClose();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    }
    
    if (!isOpen) return null;

    return (
        <div className="add-item-modal-overlay">
            <div className="add-item-modal-content">
                <h2 className="add-item-modal-title">{ title}</h2>
                {selectedType === "utility_account" &&
                        <div className='add-product-account-container'>
                            <div className='basic-info-header-container'><h3 className='basic-info-title'>Thêm tài khoản</h3></div>
                            <input value={amount} onChange={(e) => {
                                if (Number(e.target.value.replace(/\D/g, '')) > 5) {
                                    showToast("Tối đa là 5");
                                    setAmount(5);
                                }else setAmount(e.target.value);
                                
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
                
                <div className="add-item-modal-buttons">
                    <button disabled={loading} className="cancel-btn" onClick={onClose}>Hủy</button>
                    <button disabled={loading} className="confirm-btn update-button" onClick={handleUpdateProductAttributes}>{loading ? <ClipLoader size={20} color="#fff"/> : "Thêm" }</button>
                </div>
            </div>
        </div>
    );
};

export default AddItemModal;