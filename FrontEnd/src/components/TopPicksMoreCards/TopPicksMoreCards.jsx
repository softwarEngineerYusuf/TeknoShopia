import { useEffect, useState } from "react";
import "./TopPicksMoreCards.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import SortIcon from "@mui/icons-material/Sort";
import { Dropdown, Menu, Space, message } from "antd";
import { getTopPicksProducts } from "../../allAPIs/product"; // Bu API çağrısı hem markalı hem markasız çalışır
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import LoginRequiredModal from "../../components/LoginRequireModal/LoginRequireModal";
import {
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProductIds,
} from "../../allAPIs/favorites";
import { useGoToProductDetail } from "../../components/GoToProductDetailFunction/GoToProductDetail";

function TopPicksMoreCards({ selectedBrands }) {
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const { user } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const goToProductDetail = useGoToProductDetail();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getTopPicksProducts(selectedBrands);
      console.log("", data); // API'yi sorgu ile çağırıyoruz
      setProducts(data);
    };
    fetchProducts();
  }, [selectedBrands]);

  useEffect(() => {
    // Sıralama mantığını ayrı bir useEffect'e taşıdım
    const sorted = [...products].sort((a, b) => {
      const priceA = a.discountedPrice || a.price;
      const priceB = b.discountedPrice || b.price;
      return currentSort === "price-asc" ? priceA - priceB : priceB - priceA;
    });
    setSortedProducts(sorted);
  }, [products, currentSort]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && user.id) {
        const favIds = await getFavoriteProductIds(user.id);
        setFavoriteIds(new Set(favIds));
      } else {
        setFavoriteIds(new Set());
      }
    };
    fetchFavorites();
  }, [user]);

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
  };

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      message.warning("Favorilere eklemek için lütfen giriş yapın!");
      setIsLoginModalVisible(true);
      return;
    }
    const isFavorite = favoriteIds.has(productId);
    try {
      if (isFavorite) {
        await removeProductFromFavorites(user.id, productId);
        setFavoriteIds((prev) => {
          const newIds = new Set(prev);
          newIds.delete(productId);
          return newIds;
        });
        message.success("Ürün favorilerden kaldırıldı.");
      } else {
        await addProductToFavorites(user.id, productId);
        setFavoriteIds((prev) => new Set(prev).add(productId));
        message.success("Ürün favorilere eklendi!");
      }
    } catch (error) {
      message.error("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  const ProductSort = () => {
    const [open, setOpen] = useState(false);
    const menu = (
      <Menu
        onClick={({ key }) => {
          handleSortChange(key);
          setOpen(false);
        }}
      >
        <Menu.Item key="price-asc">Price: Low-High</Menu.Item>
        <Menu.Item key="price-desc">Price: High-Low</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        open={open}
        onOpenChange={(flag) => setOpen(flag)}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space style={{ cursor: "pointer" }}>
            <SortIcon
              style={{
                fontSize: "2rem",
                color: "#000",
                verticalAlign: "middle",
              }}
            />
          </Space>
        </a>
      </Dropdown>
    );
  };

  const cards = sortedProducts.map((product) => (
    <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div
        className="top-picks-more-cards container"
        style={{ position: "relative" }}
      >
        <button
          className="favorite-button"
          onClick={() => handleToggleFavorite(product._id)}
          style={
            {
              /* ... stilleriniz aynı ... */
            }
          }
        >
          {favoriteIds.has(product._id) ? (
            <HeartFilled style={{ fontSize: 22, color: "red" }} />
          ) : (
            <HeartOutlined style={{ fontSize: 22, color: "#bbb" }} />
          )}
        </button>
        <img
          src={product.mainImage}
          alt={product.name}
          className="card-image-top-picks-more-cards"
          onClick={() => goToProductDetail(product._id)}
          style={{ cursor: "pointer" }}
        />
        <div className="card-details-top-picks-more-cards">
          <p className="product-name-top-picks-more-cards">{product.name}</p>
          <div
            className="d-flex justify-content-between"
            style={{ padding: "0rem 1rem" }}
          >
            <div className="rating-top-picks-more-cards">
              <StarIcon />
              <p>
                {(product.averageRating || 0).toFixed(1)}
                <span
                  className="review-count"
                  style={{ marginLeft: "4px", color: "#888" }}
                >
                  ({product.reviewCount || 0})
                </span>
              </p>
            </div>
            <div>
              {product.discount > 0 && (
                <p
                  style={{
                    color: "red",
                    textDecoration: "line-through",
                    height: "20px",
                    fontSize: "0.9em",
                  }}
                >
                  ₺{product.price.toFixed(2)}
                </p>
              )}
              <p className="product-price-top-picks-more-cards">
                ₺{product.discountedPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            className="buy-button-top-picks-more-cards"
            onClick={() => goToProductDetail(product._id)}
          >
            İncele
          </button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container">
      <div className="top-picks-more-cards-and-sort d-flex justify-content-between align-items-center">
        <h2 className="top-picks-more-cards-title">Top Picks More</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Sort:</span>
          <ProductSort />
        </div>
      </div>
      <div className="row">{cards}</div>
      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />
    </div>
  );
}

export default TopPicksMoreCards;
