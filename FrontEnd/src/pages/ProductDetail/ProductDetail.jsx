import React, { useState } from "react";
import "./ProductDetail.css";

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
    <div className="product-detail-container">
      {/* Büyük Görsel ve Kaydırma Butonları */}
      <div className="product-main-image-container">
        <button onClick={handlePrevImage} className="product-main-slider-button">
          {"<"}
        </button>
        <img
          src={images[currentImage]}
          alt="Product"
          className="product-main-image"
        />
        <button onClick={handleNextImage} className="product-main-slider-button">
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
  );
}

export default ProductDetail;
