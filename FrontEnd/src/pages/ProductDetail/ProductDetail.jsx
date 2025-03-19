import React, { useState } from "react";
import "./ProductDetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CompareSection from "../../components/CompareSection/CompareSection.jsx";

function ProductDetail() {
  const images = [
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/145795-5_large.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/145795-2_large.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/145795-6_large.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/145795-7_large.jpg",
  ];

  const product = {
    name: "MSI hg3hj-a 16GB ram - i7 12000H - RTX 3090",
    price: "19999 TL",
    image: images[0],
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCompare = () => {
    if (!compareList.find((item) => item.name === product.name)) {
      setCompareList([product, ...compareList]);
    }
    setShowCompare(true);
  };

  return (
    <div className="product-detail-main-container">
      <div className="product-detail-container">
        {/* Ürün Resimleri */}
        <div className="product-detail-image-container">
          <div className="product-main-image-container">
            <button onClick={handlePrevImage} className="product-main-slider-button">{"<"}</button>
            <img src={images[currentImage]} alt="Product" className="product-main-image" />
            <button onClick={handleNextImage} className="product-main-slider-button">{">"}</button>
          </div>
          <div className="product-preview-slider">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Thumbnail"
                className={`product-thumbnail ${currentImage === index ? "product-thumbnail-active" : ""}`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Ürün Bilgileri */}
        <div className="underProductDetail">
          <h1 style={{ fontSize: "22px" }}>{product.name}</h1>
          <div className="product-detail-rating">
            <div className="product-detail-rating-stars">
              <StarIcon />
            </div>
            <a style={{ textDecoration: "underline", color: "darkblue" }} href="">Comments</a>
          </div>
          <div className="product-detail-price">
            <h1>{product.price}</h1>
          </div>
          <div className="product-detail-compare">
            <a style={{ textDecoration: "underline", color: "darkblue" }} href="">Compare <CompareArrowsIcon /></a>
          </div>
          <div>
            <div className="product-detail-addToCart-button">
              <button type="button" style={{ backgroundColor: "green" }} className="btn btn-primary">+ Add to cart</button>
            </div>
            <div className="product-detail-addToCart-button">
              <button type="button" style={{ backgroundColor: "green" }} onClick={handleCompare}>Karşılaştır</button>
            </div>
          </div>
        </div>
      </div>

      {/* Karşılaştırma Bölümü - Yatay Scroll */}
      {showCompare && <CompareSection compareList={compareList} />}
    </div>
  );
}

export default ProductDetail;
