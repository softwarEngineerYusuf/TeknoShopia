import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import "./DiscountsCorousel.css";

// YENİ: Gerekli importlar
import { useAuth } from "../../context/AuthContext";
import { getDiscountedProducts } from "../../allAPIs/product";
import { useGoToProductDetail } from "../GoToProductDetailFunction/GoToProductDetail";
import {
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProductIds,
} from "../../allAPIs/favorites";
import { message } from "antd";

function DiscountsCarousel() {
  const [products, setProducts] = useState([]);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [favoriteIds, setFavoriteIds] = useState(new Set()); // Eski 'favorites' state'i yerine bu geldi
  const goToProductDetail = useGoToProductDetail();
  const { user } = useAuth(); // Giriş yapmış kullanıcıyı al

  // Bileşen yüklendiğinde ve kullanıcı değiştiğinde verileri çek
  useEffect(() => {
    const fetchInitialData = async () => {
      // 1. İndirimli ürünleri çek
      const productData = await getDiscountedProducts();
      setProducts(productData);

      // 2. Kullanıcı giriş yapmışsa, favori ürün ID'lerini çek
      if (user && user.id) {
        const favIds = await getFavoriteProductIds(user.id);
        setFavoriteIds(new Set(favIds));
      } else {
        // Kullanıcı çıkış yapmışsa favori listesini temizle
        setFavoriteIds(new Set());
      }
    };

    fetchInitialData();
  }, [user]); // user değişince (login/logout) tekrar çalışır

  // Responsive tasarım için item sayısını güncelleyen useEffect
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 768) setItemsPerSlide(1);
      else if (window.innerWidth < 992) setItemsPerSlide(2);
      else setItemsPerSlide(4);
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  // API ile etkileşime giren yeni favori fonksiyonu
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
    } catch (error) {
      message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const chunkArray = (array, size) => {
    return array.reduce(
      (acc, _, i) =>
        i % size === 0 ? [...acc, array.slice(i, i + size)] : acc,
      []
    );
  };

  const groupedCards = chunkArray(products, itemsPerSlide);

  return (
    <div>
      <div className="top-picks-and-button d-flex justify-content-between align-items-center container">
        <h2 className="top-picks-title mb-3">
          <LocalOfferIcon className="top-picks-icon" /> Fırsat Ürünleri
        </h2>
      </div>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {groupedCards.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={`carousel-item ${groupIndex === 0 ? "active" : ""}`}
            >
              <div className="container">
                <div className="row">
                  {group.map((product) => (
                    <div
                      key={product._id}
                      className="col-12 col-sm-6 col-md-6 col-lg-3"
                    >
                      <div className="card-discount-corousel container">
                        <button
                          className="favorite-button"
                          onClick={() => handleToggleFavorite(product._id)} // GÜNCELLENDİ
                        >
                          {/* GÜNCELLENDİ: Durum kontrolü favoriteIds Set'i ile yapılıyor */}
                          {favoriteIds.has(product._id) ? (
                            <HeartFilled
                              style={{ fontSize: "24px", color: "red" }}
                            />
                          ) : (
                            <HeartOutlined style={{ fontSize: "24px" }} />
                          )}
                        </button>
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="card-image-discount-corousel"
                          onClick={() => goToProductDetail(product._id)}
                          style={{ cursor: "pointer" }}
                        />
                        <div className="card-details-discount-corousel">
                          <p className="product-name-discount-corousel">
                            {product.name}
                          </p>
                          <div
                            className="d-flex justify-content-between"
                            style={{ padding: "0rem 1rem" }}
                          >
                            <div className="rating-discount-corousel">
                              <StarIcon />
                              <p>{product.ratings?.toFixed(1) || "4.5"}</p>
                            </div>
                            {/* GÜNCELLENDİ: Fiyatlar artık dinamik */}
                            <div style={{ textAlign: "right" }}>
                              <p className="original-price-carousel">
                                {product.price.toLocaleString("tr-TR")}₺
                              </p>
                              <p className="product-price-discount-corousel">
                                {product.discountedPrice.toLocaleString(
                                  "tr-TR"
                                )}
                                ₺
                              </p>
                            </div>
                          </div>
                          <button
                            className="buy-button-discount-corousel"
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
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default DiscountsCarousel;
