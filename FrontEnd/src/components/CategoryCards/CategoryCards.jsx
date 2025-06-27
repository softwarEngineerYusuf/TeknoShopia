import { useState, useEffect } from "react";
import "./CategoryCards.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import SortIcon from "@mui/icons-material/Sort";
import { Dropdown, Menu, Space, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

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

function CategoryCards({ categoryId, filters }) {
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { user } = useAuth();
  const goToProductDetail = useGoToProductDetail();

  useEffect(() => {
    const fetchProductsAndFavorites = async () => {
      if (!categoryId) return; // categoryId yoksa işlem yapma

      try {
        setLoading(true);

        // Favorileri çekme işlemi
        const favoriteIdsPromise =
          user && user.id
            ? getFavoriteProductIds(user.id).then((ids) => new Set(ids))
            : Promise.resolve(new Set());

        // eslint-disable-next-line react/prop-types
        const areFiltersActive =
          filters.brands.length > 0 ||
          filters.minPrice > 0 ||
          filters.maxPrice < 150000;

        let fetchedProducts;

        if (areFiltersActive) {
          // Filtreler aktifse, YENİ API'yi tüm parametrelerle çağır
          fetchedProducts = await getProductsByBrand(
            // eslint-disable-next-line react/prop-types
            filters.brands,
            // eslint-disable-next-line react/prop-types
            filters.minPrice,
            // eslint-disable-next-line react/prop-types
            filters.maxPrice,
            categoryId // <-- Kategori ID'sini de gönderiyoruz!
          );
          // Kategori adını ilk üründen al veya varsayılan bir isim ver
          setCategoryName(
            fetchedProducts[0]?.category?.name || "Filtrelenmiş Ürünler"
          );
        } else {
          // Filtre yoksa, sadece kategoriye göre ürünleri getir
          const productResponse = await getProductsByCategory(categoryId);
          fetchedProducts = productResponse.products;
          setCategoryName(productResponse.category);
        }

        setProducts(fetchedProducts);

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
  }, [categoryId, filters, user]);

  // Sıralama fonksiyonu SADECE products state'i üzerinde çalışmalı
  const handleSortChange = (sortType) => {
    setCurrentSort(sortType); // state'i güncelle
    const sorted = [...products].sort((a, b) => {
      if (sortType === "price-asc")
        return a.discountedPrice - b.discountedPrice;
      if (sortType === "price-desc")
        return b.discountedPrice - a.discountedPrice;
      return 0;
    });
    setProducts(sorted); // sıralanmış diziyi state'e ata
  };

  // handleToggleFavorite fonksiyonu aynı kalabilir...
  const handleToggleFavorite = async (productId) => {
    if (!user) {
      message.warning("Favorilerinizi yönetmek için lütfen giriş yapın.");
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
    } catch (error) {
      message.error("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  // ProductSort component'i aynı kalabilir...
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

  // Geri kalan JSX (return kısmı) aynı kalabilir...
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
                onClick={() => handleToggleFavorite(product._id)}
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
                onClick={() => goToProductDetail(product._id)}
                style={{ cursor: "pointer" }}
              />
              <div className="card-details-category-cards">
                <p className="product-name-category-cards">{product.name}</p>
                <div
                  className="d-flex justify-content-between"
                  style={{ padding: "0rem 1rem",display: "flex", alignItems: "center" }}
                >
                  <div className="rating-category-cards">
                    <StarIcon style={{ color: '#FFD700' }} />
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
                  <div style={{ textAlign: "right", minHeight: 44, display:"flex",alignItems: "center" }}>
                    <p
                      style={{
                        color: "#888",
                        textDecoration: product.discount > 0 ? "line-through" : "none",
                        fontSize: "0.9rem",
                        height: 20,
                        margin: 0,
                        visibility: product.discount > 0 ? "visible" : "hidden"
                      }}
                    >
                      ₺{product.price.toLocaleString("tr-TR")}
                    </p>
                    <p className="product-price-category-cards" style={{ margin: 0 }}>
                      ₺{product.discountedPrice.toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>

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
