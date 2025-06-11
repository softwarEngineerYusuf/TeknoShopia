import { useState, useEffect } from "react";
import "./Favorites.css";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useAuth } from "../../context/AuthContext";
import {
  getFavoriteProducts,
  removeProductFromFavorites,
} from "../../allAPIs/favorites";
import { useGoToProductDetail } from "../GoToProductDetailFunction/GoToProductDetail";
import { Modal, message } from "antd";

const { confirm } = Modal;

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const goToProductDetail = useGoToProductDetail();

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      getFavoriteProducts(user.id)
        .then((data) => {
          setFavorites(data);
        })
        .catch((err) => {
          console.error(err);
          message.error("Favoriler yüklenirken bir hata oluştu.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemoveFromFavorites = (productId, productName) => {
    confirm({
      title: "Emin misiniz?",
      content: `"${productName}" ürününü favorilerinizden kaldırmak istediğinize emin misiniz?`,
      okText: "Evet, Kaldır",
      okType: "danger",
      cancelText: "Vazgeç",
      onOk: async () => {
        try {
          await removeProductFromFavorites(user.id, productId);
          setFavorites((prevFavorites) =>
            prevFavorites.filter((item) => item._id !== productId)
          );
          message.success(`"${productName}" favorilerden kaldırıldı.`);
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          message.error("Ürün kaldırılırken bir hata oluştu.");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="favorites-container">
        <p>Favorileriniz yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="favorites-container empty-favorites">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="login required"
          style={{ width: 120 }}
        />
        <h2>Favorilerinizi Görmek İçin Lütfen Giriş Yapın</h2>
        <p>Favori ürünlerinize erişmek için hesabınıza giriş yapmalısınız.</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1
          className="favorites-title"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          Favorilerim
          <span className="favorites-heart">
            <svg viewBox="0 0 32 29.6">
              <path d="M23.6,0c-2.7,0-5.1,1.3-6.6,3.3C15.5,1.3,13.1,0,10.4,0C4.7,0,0,4.7,0,10.4c0,7.1,10.7,14.2,15.2,18.1c0.5,0.4,1.2,0.4,1.7,0C21.3,24.6,32,17.5,32,10.4C32,4.7,27.3,0,23.6,0z" />
            </svg>
          </span>
        </h1>
        <span className="favorites-count">{favorites.length} ürün</span>
      </div>

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <div key={item._id} className="favorite-item">
              <img
                src={item.mainImage}
                alt={item.name}
                className="favorite-image"
                onClick={() => goToProductDetail(item._id)}
                style={{ cursor: "pointer" }}
              />
              <div className="favorite-content">
                <h3 className="favorite-name">{item.name}</h3>
                {item.discountedPrice ? (
                  <p className="favorite-price">
                    <span
                      className="original-price"
                      style={{
                        textDecoration: "line-through",
                        color: "#666",
                        fontSize: "16px",
                      }}
                    >
                      {item.price.toLocaleString("tr-TR")} ₺
                    </span>

                    <span
                      className="discounted-price"
                      style={{
                        color: "#d9534f",
                        fontWeight: "bold",
                        fontSize: "22px",
                      }}
                    >
                      {item.discountedPrice.toLocaleString("tr-TR")} ₺
                    </span>
                  </p>
                ) : (
                  <p
                    className="favorite-price main-price"
                    style={{
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: "22px",
                    }}
                  >
                    {item.price.toLocaleString("tr-TR")} ₺
                  </p>
                )}
                <div className="favorite-actions">
                  <button
                    className="add-to-cart"
                    onClick={() => goToProductDetail(item._id)}
                  >
                    <ShoppingCartIcon style={{ fontSize: "1.3rem" }} />{" "}
                    Detayları Gör
                  </button>
                  <button
                    className="remove-favorite"
                    onClick={() =>
                      handleRemoveFromFavorites(item._id, item.name)
                    }
                  >
                    <div className="remove-icon-favs">
                      <DeleteIcon style={{ fontSize: "2rem" }} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="empty"
          />
          <h2>Favori Listeniz Boş</h2>
          <p>
            Alışveriş yaparken beğendiğiniz ürünleri kalbe tıklayarak buraya
            ekleyebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}

export default Favorites;
