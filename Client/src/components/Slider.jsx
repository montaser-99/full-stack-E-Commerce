import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cardproduct from './Cardproduct';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const arrowStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  backgroundColor: '#00ca57',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const NextArrow = ({ onClick }) => (
  <div
    style={{ ...arrowStyle, right: '-15px' }}
    onClick={onClick}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#035928'}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00ca57'}
  >
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    style={{ ...arrowStyle, left: '-15px' }}
    onClick={onClick}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#035928'}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00ca57'}
  >
    <FaArrowLeft />
  </div>
);

function CustomSlider({ title, data = [], CardComponent = Cardproduct, slidesToShow = 5, autoplay }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay,
    autoplaySpeed: 2000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="mb-4 position-relative container">
      {title && <h2 className="mb-3">{title}</h2>}
      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index} className="d-flex justify-content-center">
            <div style={{ width: "220px", margin: "0 auto" }}>
              <CardComponent data={item} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CustomSlider;
