import './../../styles/dashboard.css';
import StarRating from '../star-rating/star-rating';
import { BsFillCartCheckFill, BsCartXFill } from "react-icons/bs";
import { productAttributesStatusText } from '../../utils';

const TopUpSection = ({ title, packages }) => {
    const activePackages = packages?.filter(pack => pack.product_status === 'active');

    return (
        <section className="account-section-container">
            <div className="account-category">
                <div className='category-title-container'>
                    <h2 className="category-title">{title}</h2>
                </div>
                <div className='account-info-container'>
                {activePackages?.map(pack => <TopUpCard pack={pack}></TopUpCard>)}
                </div>
            </div>
        </section>
    );
};

const TopUpCard = ({ pack }) => {
    const prices = pack?.product_attributes?.packages.map(pkg => pkg.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return (
        <a href={`/product/${pack?.product_slug}`} className='topup-item-container'>
            <img loading='lazy' className='topup-item-image' src={pack?.product_imgs[0]} alt='Product Image' />
            <div className='topup-item-info'>
                <p className='item-name'>{ pack?.product_name}</p>
                <div>
                    <div className='order-type-price-container'>
                    <div className='order-type-container'>
                        <BsFillCartCheckFill className="topup-item-order-icon stock" />
                            <p className='available-text stock'>{productAttributesStatusText(pack?.product_attributes?.packages[0].status) }</p>
                    </div>
                        <p className='sold-text'>Đã bán { pack?.product_sold_amount}</p>
                </div>
                <div className='rating-sold-container'>
                        <p className='item-price'>{minPrice.toLocaleString()}đ ~ {maxPrice.toLocaleString() }đ</p>
                    <StarRating rating={pack?.averageRating} />
                                
                </div>
                </div>
            </div>
        </a>
    );
}


export default TopUpSection;