import React, { useState } from "react";
import "./ProductDetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

function ProductDetail() {
  const images = [
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/145795-5_large.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/145795-2_large.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/145795-6_large.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/145795-7_large.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0); // Şu anda büyük ekranda gösterilen görsel

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length); // Son görselden sonra ilk görsele geçiş
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length); // İlk görselden önce son görsele geçiş
  };

  return (
    <div className="product-detail-main-container">
      <div className="product-detail-container">
        {/* Büyük Görsel ve Kaydırma Butonları */}
        
        <div className="product-detail-image-container">
        <div className="product-main-image-container">
          <button
            onClick={handlePrevImage}
            className="product-main-slider-button"
          >
            {"<"}
          </button>
          <img
            src={images[currentImage]}
            alt="Product"
            className="product-main-image"
          />
          <button
            onClick={handleNextImage}
            className="product-main-slider-button"
          >
            {">"}
          </button>
        </div>

        {/* Küçük Önizleme Görselleri */}
        <div className="product-preview-slider">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Thumbnail"
              className={`product-thumbnail ${
                currentImage === index ? "product-thumbnail-active" : ""
              }`}
              onClick={() => setCurrentImage(index)} // Tıklanan küçük görsel büyük resim olur
            />
          ))}
        </div>

        </div>

        <div className="underProductDetail">
          <h1 style={{ fontSize: "22px" }}>MSI hg3hj-a 16GB ram - i7 12000H - RTX 3090</h1>
          <div className="product-detail-rating">
            <div className="product-detail-rating-stars">
              <StarIcon/>
            </div>
            <a style={{textDecoration:'underline',color:'darkblue'}} href="">Comments </a>
          </div>
          <div className="product-detail-price">
            <h1>19999</h1> <h1>TL</h1>
          </div>
          <div className="product-detail-compare">
          <a style={{textDecoration:'underline',color:'darkblue'}} href="">Compare  <CompareArrowsIcon style={{}} /></a>
          </div>
          <div>
            <div className="product-detail-addToCart-button">
            <button
              type="button"
              style={{ backgroundColor: "green" }}
              class="btn btn-primary"
            >
              + Add to card
            </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ProductDetail;
