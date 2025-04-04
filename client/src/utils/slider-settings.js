export const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
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