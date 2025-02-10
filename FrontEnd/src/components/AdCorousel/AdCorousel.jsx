import PropTypes from "prop-types";

function AdCarousel({ images }) {
  return (
    <div id="carouselExample" className="carousel slide container">
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

// **PropTypes ile props doğrulaması ekleyelim**
AdCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired, // images dizisi zorunlu ve string tipinde olmalı
};

export default AdCarousel;
