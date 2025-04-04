import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import './product-image-slider.css'

const ProductImageSlider = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewImage, setIsViewImage] = useState(false);

  // Default image in case no images are provided
  const defaultImage = "https://fontmeme.com/images/clash-royale-GAME-FONT.jpg";
  const displayImages = images.length > 0 ? images : [defaultImage];

  const handlePrevious = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const closeModal = () => {
    setIsViewImage(false);
  };

  return (
    <>
      <div className="product-gallery">
        <img
          src={displayImages[activeIndex]}
          alt="Product"
          className="product-image"
          onClick={() => setIsViewImage(true)}
        />
        
        {displayImages.length > 1 && (
          <div className="thumbnail-container">
            {displayImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail-image ${activeIndex === index ? "active-thumbnail" : ""}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {isViewImage && (
        <div
          className="image-modal-overlay"
          onClick={closeModal}
        >
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <IoCloseCircle className="close-button" onClick={closeModal}/>
            
            <div className="modal-image-container adaptive">
              <img 
                loading="lazy"
                src={displayImages[activeIndex]} 
                alt="Full View" 
                className="modal-image"
              />
            </div>
            
            {displayImages.length > 1 && (
              <>
                <button className="nav-button prev-button" onClick={handlePrevious}>
                  <IoIosArrowBack className="arrow-icon"/>
                </button>
                <button className="nav-button next-button" onClick={handleNext}>
                  <IoIosArrowForward className="arrow-icon"/>
                </button>
                <div className="modal-indicators">
                  {displayImages.map((_, index) => (
                    <span 
                      key={index} 
                      className={`indicator ${activeIndex === index ? "active-indicator" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(index);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageSlider;