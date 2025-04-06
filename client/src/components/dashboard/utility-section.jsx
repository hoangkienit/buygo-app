import './../../styles/dashboard.css';
import StarRating from '../star-rating/star-rating';
import { BsFillCartCheckFill, BsCartXFill } from "react-icons/bs";
import { productAttributesStatusText } from '../../utils';

const UtilitySection = ({ title, utilities }) => {
    const activeUtilities = utilities?.filter(util => util.product_status === 'active');

    return (
        <section className="account-section-container">
            <div className="account-category">
                <div className='category-title-container'>
                    <h2 className="category-title">{title}</h2>
                </div>
                <div className='account-info-container'>
                {activeUtilities?.map(util => <UtilityCard key={util._id} util={util}></UtilityCard>)}
                </div>
            </div>
        </section>
    );
};

const UtilityCard = ({ util }) => {
    return (
        <a href={`/product/${util?.product_slug}`} className='topup-item-container'>
            <img loading='lazy' className='topup-item-image' src={util?.product_imgs[0]} alt='Product Image' />
            <div className='topup-item-info'>
                <p className='item-name'>{util?.product_name || 'product' }</p>
                <div>
                    <div className='order-type-price-container'>
                    <div className='order-type-container'>
                        <BsFillCartCheckFill className="topup-item-order-icon stock" />
                        <p className={`available-text stock`}>{util?.product_status === 'active' ? 'Còn hàng':'Hết hàng'}</p>
                    </div>
                        <p className='sold-text'>Đã bán {util?.product_sold_amount || 0 }</p>
                </div>
                <div className='rating-sold-container'>
                        <p className='item-price'>{util?.product_attributes?.price.toLocaleString() || 0}đ</p>
                    <StarRating rating={util?.averageRating} />
                                
                </div>
                </div>
            </div>
        </a>
    );
}


export default UtilitySection;