import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import "./TopPicks.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const TopPicks = () => {
  const [favorites, setFavorites] = useState(Array(12).fill(false));
  const navigate = useNavigate();

  const toggleFavorite = (index) => {
    setFavorites((prevFavorites) => {
      const newFavorites = [...prevFavorites];
      newFavorites[index] = !newFavorites[index];
      return newFavorites;
    });
  };

  const imageURL =
    "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg";

  const cards = Array.from({ length: 12 }, (_, index) => (
    <div key={index} className="col-md-3 mb-4">
      <div className="card-top-picks container">
        {/* Favori butonu */}
        <button
          className="favorite-button"
          onClick={() => toggleFavorite(index)}
        >
          {favorites[index] ? (
            <HeartFilled style={{ fontSize: "24px", color: "red" }} />
          ) : (
            <HeartOutlined style={{ fontSize: "24px" }} />
          )}
        </button>

        <img src={imageURL} alt="Product" className="card-image-top-picks" />
        <div className="card-details-top-picks">
          <p className="product-name-top-picks">iPhone 13 128 Gb Siyah</p>
          <div
            className="d-flex justify-content-between"
            style={{ padding: "0rem 1rem" }}
          >
            <div className="rating-discount-corousel">
              <StarIcon />
              <p>4.8</p>
            </div>
            <p className="product-price-top-picks">₺1,299.00</p>
          </div>
          <button className="buy-button-top-picks">İncele</button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container">
      <div className="top-picks-and-button d-flex justify-content-between align-items-center">
        <h2 className="top-picks-title">Top Picks</h2>
        <Link to="/TopPicksmore">
          <button className="buttonShowMore">
            <span>Show More</span>
          </button>
        </Link>
      </div>
      <div className="row">{cards}</div>
    </div>
  );
};

export default TopPicks;
