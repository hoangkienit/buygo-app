import React, { useEffect } from "react";
import Slider from "react-slick";
import "../styles/dashboard.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fakeData } from "../data/fake";
import AccountSection from "../components/dashboard/account-section";

const banners = [
  "https://elements-resized.envatousercontent.com/elements-preview-images/29961ce9-4919-49b0-a72d-fd9104b7042d?w=632&cf_fit=scale-down&q=85&format=auto&s=fbd666bd56dbb781cc84d18ff9d6d4e9a60a88293c5e9ba895b60afe320e9ab3",
  "https://elements-resized.envatousercontent.com/elements-preview-images/7c17a291-a60a-438d-9a20-aa543d296b0f?w=632&cf_fit=scale-down&q=85&format=auto&s=b3b9c6a5bb23a6fd505d3779145261af7ccca3363fce8737d10068c2e552cf96",
  "https://elements-resized.envatousercontent.com/elements-preview-images/0f55ce01-8e93-4543-8064-19c012365008?w=632&cf_fit=scale-down&q=85&format=auto&s=2db5e7dc66724f37d793fbad1234f05cdd2c891aa471708a9a5c2c353e29f3c7"
];

const categories = [
  { name: "Game Mobile", image: require('../assets/images/mobile_game.png') },
  { name: "Game PC", image: require('../assets/images/pc_game.png') },
  { name: "Gifts Card", image: require('../assets/images/gift_card.png') },
  { name: "Tài khoản", image: require('../assets/images/account.png') },
  { name: "Tiện ích", image: require('../assets/images/utility.png') }
];


const Dashboard = () => {
  useEffect(() => {
      document.title = "Buygo.vn";
  }, []);
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: dots => (
    <div className="custom-dots-container">
      <ul> {dots} </ul>
    </div>
    ),
    customPaging: i => (
      <div className="custom-dot"></div> // Custom dot styling
    ),
    arrows: false
  };

  return (
    <div className="dashboard-container">
      {/* Banner Slider */}
      <div className="banner-slider">
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <div key={index}>
              <img src={banner} alt={`Banner ${index + 1}`} className="banner-image" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <a href="/">
                <img src={category.image} alt={category.name} className="category-image" />
                <p className="category-name">{category.name}</p>
              </a>
            </div>
          ))}
        </div>
      </div>

      <AccountSection title={'eFootball'}/>

      <section className="fake-data-section">
  {Array.from(new Set(fakeData.map(item => item.category))).map(category => (
    <div key={category} className="fake-data-category">
      <h2 className="category-title">{category}</h2>

      <div className="fake-data-grid">
        {fakeData.filter(item => item.category === category).map((item, index) => (
          <a href="/product" key={index} className="fake-data-item">
            {/* Image on the Left */}
            <img src={item.image} alt={item.name} className="fake-data-image" />

            {/* Content on the Right */}
            <div className="fake-data-content">
              <h3 className="fake-data-name">{item.name}</h3>
              <p className="fake-data-price">{item.price}</p>

              {/* Order Type & Rating */}
              <div className="fake-data-extra">
                <span className="fake-data-order">Còn hàng</span>
                <span className="fake-data-rating">
                  <i className="fa fa-star"></i> {Math.floor(Math.random() * 2) + 4}.{
                    Math.floor(Math.random() * 10)
                  }
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  ))}
</section>
    </div>
  );
};

export default Dashboard;
