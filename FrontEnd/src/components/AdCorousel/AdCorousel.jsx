import PropTypes from "prop-types";
import { useEffect } from "react";

function AdCarousel({ images }) {
  useEffect(() => {
    // Bootstrap Carousel'ı manuel başlat
    const carouselEl = document.getElementById("carouselExample");
    let carouselInstance;
    if (window.bootstrap && carouselEl) {
      // Bootstrap 5 için
      carouselInstance = window.bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: 3000,
        ride: "carousel",
        pause: false,
        wrap: true,
      });
    }
    // Cleanup: Carousel instance'ı dispose et
    return () => {
      if (carouselInstance) {
        carouselInstance.dispose();
      }
    };
  }, [images]);

  return (
    <div
      id="carouselExample"
      className="carousel slide container"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-inner">
        {images.map((imgSrc, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img src={imgSrc} className="d-block w-100" alt="Advertisement" />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

AdCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AdCarousel;
