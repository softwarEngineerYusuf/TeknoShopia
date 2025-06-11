import { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import "./TopPicks.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useAuth } from "../../context/AuthContext";
import { getTopPicksProducts } from "../../allAPIs/product";
import { useGoToProductDetail } from "../GoToProductDetailFunction/GoToProductDetail";
import {
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProductIds,
} from "../../allAPIs/favorites";
import { message } from "antd";

const TopPicks = () => {
  const [products, setProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const goToProductDetail = useGoToProductDetail();
  const { user } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      const productData = await getTopPicksProducts();
      setProducts(productData);

      if (user && user.id) {
        const favIds = await getFavoriteProductIds(user.id);
        setFavoriteIds(new Set(favIds));
      }
    };

    fetchInitialData();
  }, [user]);

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      message.warning("Favorilere eklemek için lütfen giriş yapın!");
      return;
    }

    const isFavorite = favoriteIds.has(productId);

    try {
      if (isFavorite) {
        await removeProductFromFavorites(user.id, productId);
        setFavoriteIds((prevIds) => {
          const newIds = new Set(prevIds);
          newIds.delete(productId);
          return newIds;
        });
        message.success("Ürün favorilerden kaldırıldı.");
      } else {
        await addProductToFavorites(user.id, productId);
        setFavoriteIds((prevIds) => {
          const newIds = new Set(prevIds);
          newIds.add(productId);
          return newIds;
        });
        message.success("Ürün favorilere eklendi!");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="container">
      <div className="top-picks-and-button d-flex justify-content-between align-items-center">
        <h2 className="top-picks-title">
          <ShoppingCartIcon className="top-picks-icon" /> Top Picks
        </h2>
        <Link to="/TopPicksmore">
          <button className="buttonShowMore">
            <span>Show More</span>
          </button>
        </Link>
      </div>

      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-3 mb-4">
            <div className="card-top-picks container">
              <button
                className="favorite-button"
                onClick={() => handleToggleFavorite(product._id)}
              >
                {favoriteIds.has(product._id) ? (
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
                <button
                  className="buy-button-top-picks"
                  onClick={() => goToProductDetail(product._id)}
                >
                  See Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicks;
