import './../../styles/dashboard.css';
import test from './../../assets/images/test-img.jpg'
import test2 from './../../assets/images/test-img2.jpg'
import StarRating from '../star-rating/star-rating';
import { BsFillCartCheckFill, BsCartXFill } from "react-icons/bs";

const AccountSection = ({title}) => {
    return (
        <section className="account-section-container">
            <div className="account-category">
                <div className='category-title-container'>
                    <h2 className="category-title">{title}</h2>
                </div>
                <div className='account-info-container'>
                    <AccountCard />
                    <AccountCard2 />
                    <AccountCard />
                    <AccountCard />
                    <AccountCard />
                    <AccountCard />
                    <AccountCard />
                    <AccountCard />
                    <AccountCard/>
                </div>
            </div>
        </section>
    );
};

const AccountCard = () => {
    return (
        <a className='account-item-container'>
                        <img className='account-item-image' src={test} alt='product-img' />
                        <div className='account-item-info'>
                            <p className='item-name'>SIÊU PHẨM KHUNG NGON VÀ VIP PRO MS 795</p>
                            <div className='order-type-price-container'>
                                <div className='order-type-container'>
                                    <BsFillCartCheckFill className="account-item-order-icon stock" />
                                    <p className='available-text stock'>Có sẵn</p>
                                </div>
                                <p className='item-price'>2.900.000đ</p>
                            </div>
                            <div className='rating-sold-container'>
                                <StarRating rating={4.5} />
                                <p className='sold-text'>Đã bán 0</p>
                            </div>
                        </div>
                    </a>
    );
}
const AccountCard2 = () => {
    return (
        <a className='account-item-container'>
                        <img className='account-item-image' src={test2} alt='product-img' />
                        <div className='account-item-info'>
                            <p className='item-name'>SIÊU PHẨM KHUNG NGON VÀ VIP PRO MS 795</p>
                            <div className='order-type-price-container'>
                                <div className='order-type-container'>
                                    <BsFillCartCheckFill className="account-item-order-icon stock" />
                                    <p className='available-text stock'>Có sẵn</p>
                                </div>
                                <p className='item-price'>2.900.000đ</p>
                            </div>
                            <div className='rating-sold-container'>
                                <StarRating rating={5} />
                                <p className='sold-text'>Đã bán 0</p>
                            </div>
                        </div>
                    </a>
    );
}

export default AccountSection;