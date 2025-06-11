import { useState, useEffect } from "react";
import "./CategoryCards.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import SortIcon from "@mui/icons-material/Sort";
import { Dropdown, Menu, Space, message } from "antd"; // message import edildi
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

// YENİ: Gerekli importlar
import {
  getProductsByCategory,
  getProductsByBrand,
} from "../../allAPIs/product";
import { useAuth } from "../../context/AuthContext";
import {
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProductIds,
} from "../../allAPIs/favorites";
import { useGoToProductDetail } from "../GoToProductDetailFunction/GoToProductDetail";

// eslint-disable-next-line react/prop-types
function CategoryCards({ categoryId, filters }) {
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  // YENİ: State yönetimi
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { user } = useAuth();
  const goToProductDetail = useGoToProductDetail();

  // Ürünleri ve favorileri çeken ana useEffect
  useEffect(() => {
    const fetchProductsAndFavorites = async () => {
      try {
        setLoading(true);

        // Önce favori ID'lerini çekelim (paralel istek için)
        let favoriteIdsPromise = Promise.resolve(new Set());
        if (user && user.id) {
          favoriteIdsPromise = getFavoriteProductIds(user.id).then(
            (ids) => new Set(ids)
          );
        }

        let productResponse;
        // Filtre varsa filtreli ürünleri getir
        if (
          // eslint-disable-next-line react/prop-types
          filters.brands.length > 0 ||
          // eslint-disable-next-line react/prop-types
          filters.minPrice > 0 ||
          // eslint-disable-next-line react/prop-types
          filters.maxPrice < 150000
        ) {
          productResponse = await getProductsByBrand(
            // eslint-disable-next-line react/prop-types
            filters.brands,
            // eslint-disable-next-line react/prop-types
            filters.minPrice,
            // eslint-disable-next-line react/prop-types
            filters.maxPrice
          );
          const filteredProducts = productResponse.products.filter(
            (p) => p.category._id === categoryId
          );
          setProducts(filteredProducts);
          setCategoryName(
            filteredProducts[0]?.category?.name || "Filtrelenmiş Ürünler"
          );
        } else {
          // Filtre yoksa normal kategori ürünlerini getir
          productResponse = await getProductsByCategory(categoryId);
          setProducts(productResponse.products);
          setCategoryName(productResponse.category);
        }

        // Favori ID'leri isteği tamamlandığında state'i güncelle
        const favIds = await favoriteIdsPromise;
        setFavoriteIds(favIds);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
        setProducts([]);
        message.error("Ürünler yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndFavorites();
  }, [categoryId, filters, user]); // user'ı dependency array'e ekledik

  // Eski favori useEffect'i artık gerekli değil, kaldırıldı.

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
    const sorted = [...products].sort((a, b) => {
      if (sortType === "price-asc")
        return a.discountedPrice - b.discountedPrice;
      if (sortType === "price-desc")
        return b.discountedPrice - a.discountedPrice;
      return 0;
    });
    setProducts(sorted);
  };

  // YENİ: API ile etkileşime giren favori fonksiyonu
  const handleToggleFavorite = async (productId) => {
    if (!user) {
      message.warning("Favorilere eklemek için lütfen giriş yapın!");
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
        setFavoriteIds((prev) => {
          const newIds = new Set(prev);
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

  const ProductSort = () => {
    const [open, setOpen] = useState(false);
    const menu = (
      <Menu
        onClick={({ key }) => {
          handleSortChange(key);
          setOpen(false);
        }}
      >
        <Menu.Item key="price-asc">Fiyat: Düşük-Yüksek</Menu.Item>
        <Menu.Item key="price-desc">Fiyat: Yüksek-Düşük</Menu.Item>
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
    return <div className="text-center py-5">Yükleniyor...</div>;
  }
  if (!products.length) {
    return (
      <div className="text-center py-5">
        Bu kriterlere uygun ürün bulunamadı.
      </div>
    );
  }

  return (
    <div className="container">
      <div className="category-cards-and-sort d-flex justify-content-between align-items-center">
        <h2 className="category-cards-title">{categoryName}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Sırala:</span>
          <ProductSort />
        </div>
      </div>

      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-3 mb-4">
            <div
              className="category-cards container"
              style={{ position: "relative" }}
            >
              <button
                className="favorite-button"
                onClick={() => handleToggleFavorite(product._id)} // GÜNCELLENDİ
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  zIndex: 2,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {/* GÜNCELLENDİ: Durum kontrolü favoriteIds ile yapılıyor */}
                {favoriteIds.has(product._id) ? (
                  <HeartFilled style={{ fontSize: 24, color: "red" }} />
                ) : (
                  <HeartOutlined style={{ fontSize: 24, color: "#bbb" }} />
                )}
              </button>
              <img
                src={product.mainImage}
                alt={product.name}
                className="card-image-category-cards"
                onClick={() => goToProductDetail(product._id)} // Resme de tıklama eklendi
                style={{ cursor: "pointer" }}
              />
              <div className="card-details-category-cards">
                <p className="product-name-category-cards">{product.name}</p>
                <div
                  className="d-flex justify-content-between"
                  style={{ padding: "0rem 1rem" }}
                >
                  <div className="rating-category-cards">
                    <StarIcon />
                    <p>{product.ratings?.toFixed(1) || "4.5"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {/* İndirim varsa üstü çizili fiyatı göster */}
                    {product.discount > 0 && (
                      <p
                        style={{
                          color: "#888",
                          textDecoration: "line-through",
                          fontSize: "0.9rem",
                          marginBottom: "-5px",
                        }}
                      >
                        ₺{product.price.toLocaleString("tr-TR")}
                      </p>
                    )}
                    <p className="product-price-category-cards">
                      ₺{product.discountedPrice.toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
                {/* GÜNCELLENDİ: Butona onClick eklendi */}
                <button
                  className="buy-button-category-cards"
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
}

export default CategoryCards;
