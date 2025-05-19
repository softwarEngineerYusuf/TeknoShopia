import { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import "./TopPicks.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getTopPicksProducts } from "../../allAPIs/product"; // yolunu projenize göre ayarlayın

const TopPicks = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchTopPicks = async () => {
      const data = await getTopPicksProducts();
      setProducts(data);
      setFavorites(Array(data.length).fill(false));
    };
    fetchTopPicks();
  }, []);

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const newFavs = [...prev];
      newFavs[index] = !newFavs[index];
      return newFavs;
    });
  };

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

      <div className="row">
        {products.map((product, index) => (
          <div key={product._id} className="col-md-3 mb-4">
            <div className="card-top-picks container">
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

              <img
                src={product.mainImage || "/no-image.png"}
                alt={product.name}
                className="card-image-top-picks"
              />
              <div className="card-details-top-picks">
                <p className="product-name-top-picks">{product.name}</p>
                <div
                  className="d-flex justify-content-between"
                  style={{ padding: "0rem 1rem" }}
                >
                  <div className="rating-discount-corousel">
                    <StarIcon />
                    <p>{product.ratings?.toFixed(1) || "0.0"}</p>
                  </div>
                  <p className="product-price-top-picks">
                    ₺{product.price?.toLocaleString("tr-TR") || "0"}
                  </p>
                </div>
                <button className="buy-button-top-picks">İncele</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicks;
