import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Brands.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import SortIcon from "@mui/icons-material/Sort";
import { Dropdown, Menu, Space, Spin, message } from "antd";

// API fonksiyonlarını import et
import { getBrandById } from "../../allAPIs/brand";
import { getProductsByBrandID } from "../../allAPIs/product";
// Favori işlemleri ve kullanıcı kontrolü için gerekli importlar
import { useAuth } from "../../context/AuthContext";
import LoginRequiredModal from "../../components/LoginRequireModal/LoginRequireModal";
import {
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProductIds,
} from "../../allAPIs/favorites";

function Brands() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [brandInfo, setBrandInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentSort, setCurrentSort] = useState("price-asc");
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [brandData, productData] = await Promise.all([
          getBrandById(brandId),
          getProductsByBrandID(brandId),
        ]);

        setBrandInfo(brandData);
        setProducts(productData || []);
        setSortedProducts(productData || []);

        if (user && user.id) {
          const favIds = await getFavoriteProductIds(user.id);
          setFavoriteIds(new Set(favIds));
        } else {
          setFavoriteIds(new Set());
        }
      } catch (error) {
        message.error("Veriler çekilirken bir hata oluştu.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brandId, user]);

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
    const sorted = [...products].sort((a, b) => {
      const priceA = a.discountedPrice || a.price;
      const priceB = b.discountedPrice || b.price;
      if (sortType === "price-asc") return priceA - priceB;
      if (sortType === "price-desc") return priceB - priceA;
      return 0;
    });
    setSortedProducts(sorted);
  };

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      message.warning("Please log in to manage favorites.");
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
        message.success("Product removed from favorites.");
      } else {
        await addProductToFavorites(user.id, productId);
        setFavoriteIds((prev) => new Set(prev).add(productId));
        message.success("Product added to favorites!");
      }
    } catch (error) {
      message.error("An error occurred, please try again.");
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
        onOpenChange={setOpen}
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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!brandInfo) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Brand not found.</h1>
      </div>
    );
  }

  return (
    <div className="container-md mt-4">
      {/* BAŞLIK BÖLÜMÜ GÜNCELLENDİ */}
      <div className="brands-cards-and-sort d-flex justify-content-between align-items-center mb-4">
        {/* Sol taraf: Başlık ve Logo için bir sarmalayıcı div */}
        <div
          className="d-flex align-items-center justify-between"
          style={{ gap: "15px", width: "50%" }}
        >
          <h2 className="brands-cards-title m-0">{brandInfo.name}</h2>
          <img
            src={brandInfo.logo.url}
            alt={`${brandInfo.name} logo`}
            style={{ height: "40px" }}
          />
        </div>

        {/* Sağ taraf: Sıralama kontrolleri */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Sırala:</span>
          <ProductSort />
        </div>
      </div>
      {/* ÜRÜN KARTLARI */}
      <div className="row">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
              <div
                className="brands-cards container"
                style={{ position: "relative" }}
              >
                <button
                  className="favorite-button-brands"
                  aria-label="Add to favorites"
                  onClick={() => handleToggleFavorite(product._id)}
                >
                  {favoriteIds.has(product._id) ? (
                    <HeartFilled style={{ fontSize: "24px", color: "red" }} />
                  ) : (
                    <HeartOutlined
                      style={{ fontSize: "24px", color: "#888" }}
                    />
                  )}
                </button>
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="card-image-brands-cards"
                  onClick={() => navigate(`/productDetail/${product._id}`)}
                  style={{ cursor: "pointer" }}
                />
                <div className="card-details-brands-cards text-center">
                  <p className="product-name-brands-cards">{product.name}</p>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ padding: "0rem 1rem" }}
                  >
                    <div className="rating-brands-cards">
                      <StarIcon style={{ color: "#FFD700" }} />
                      <p>{product.ratings?.toFixed(1) || "N/A"}</p>
                    </div>
                    <div>
                      {product.discount > 0 && (
                        <p className="old-price">₺{product.price.toFixed(2)}</p>
                      )}
                      <p className="product-price-brands-cards">
                        ₺{(product.discountedPrice || product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="buy-button-brands-cards"
                    onClick={() => navigate(`/productDetail/${product._id}`)}
                  >
                    İncele
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center mt-5">No products found for this brand.</p>
          </div>
        )}
      </div>
      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />
    </div>
  );
}

export default Brands;
