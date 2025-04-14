import "./../../styles/dashboard.css";
import test from "./../../assets/images/test-img.jpg";
import test2 from "./../../assets/images/test-img2.jpg";
import StarRating from "../star-rating/star-rating";
import { BsFillCartCheckFill, BsCartXFill } from "react-icons/bs";

const AccountSection = ({ title, accounts }) => {
  const activeAccounts = accounts?.filter(
    (acc) => acc.product_status === "active"
  );

  return (
    <section className="account-section-container">
      <div className="account-category">
        <div className="category-title-container">
          <h2 className="category-title">{title}</h2>
        </div>
        <div className="account-info-container">
          {activeAccounts?.map((acc) => (
            <AccountCard key={acc._id} acc={acc}></AccountCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const AccountCard = ({ acc }) => {
  return (
    <a
      href={`/product/${acc?.product_slug}`}
      className="account-item-container"
    >
      <img
        loading="lazy"
        className="account-item-image"
        src={acc?.product_imgs[0]}
        alt="product-img"
      />
      <div className="account-item-info">
        <p className="item-name">{acc?.product_name}</p>
        <div className="order-type-price-container">
          <div className="order-type-container">
            {acc?.product_stock > 0 ? (
              <BsFillCartCheckFill className="account-item-order-icon stock" />
            ) : (
              <BsCartXFill className="account-item-order-icon sold" />
            )}
            <p
              className={`available-text ${
                acc?.product_stock > 0 ? "stock" : "sold"
              }`}
            >
              {acc?.product_stock > 0 ? "Còn hàng" : "Hết hàng"}
            </p>
          </div>
          <p className="item-price">
            {acc?.product_attributes?.price.toLocaleString()}đ
          </p>
        </div>
        <div className="rating-sold-container">
          <StarRating rating={acc?.averageRating} />
          <p className="sold-text">Đã bán {acc?.product_sold_amount}</p>
        </div>
      </div>
    </a>
  );
};

export default AccountSection;
