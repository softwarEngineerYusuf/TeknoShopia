import React from "react";
import "./CategoryCards.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import SortIcon from "@mui/icons-material/Sort";

function CategoryCards() {
  const imageURLCategory =
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg";

  const cardsCategory = Array.from({ length: 12 }, (_, index) => (
    <div key={index} className="col-md-3 mb-4">
      <div className="category-cards container">
        <img
          src={imageURLCategory}
          alt="Product"
          className="card-image-category-cards"
        />
        <div className="card-details-category-cards">
          <p className="product-name-category-cards">iPhone 13 128 Gb Siyah</p>
          <div
            className="d-flex justify-content-between"
            style={{ padding: "0rem 1rem" }}
          >
            <StarIcon />
            <p className="product-price-category-cards">₺1,299.00</p>
          </div>
          <button className="buy-button-category-cards">İncele</button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container">
      <div className="category-cards-and-sort d-flex justify-content-between align-items-center">
        <h2 className="category-cards-title">Telephones</h2>
        <div>
          <SortIcon style={{color:'black'}} />
        </div>
      </div>
      <div className="row">{cardsCategory}</div>
    </div>
  );
}

export default CategoryCards;
