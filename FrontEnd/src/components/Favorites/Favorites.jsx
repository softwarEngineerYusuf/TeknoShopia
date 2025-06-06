import React, { useState } from "react";
import "./Favorites.css";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function Favorites() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Iphone 13 128 Gb Black",
      price: "$599.99",
      discountedPrice: "$529.99",
      image:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg",
    },
    {
      id: 2,
      name: "Iphone 13 128 Gb Black",
      price: "$599.99",
      image:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg",
    },
    {
      id: 3,
      name: "Iphone 13 128 Gb Black",
      price: "$559.99",
      discountedPrice: "$529.99",
      image:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg",
    },
    {
      id: 4,
      name: "Iphone 13 128 Gb Black",
      price: "$559.99",
      discountedPrice: "$529.99",
      image:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg",
    },
  ]);

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  const addToCart = (id) => {
    console.log("Added to cart:", id);
  };

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1
          className="favorites-title"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          My Favorites
          <span className="favorites-heart">
            <svg viewBox="0 0 32 29.6">
              <path d="M23.6,0c-2.7,0-5.1,1.3-6.6,3.3C15.5,1.3,13.1,0,10.4,0C4.7,0,0,4.7,0,10.4c0,7.1,10.7,14.2,15.2,18.1c0.5,0.4,1.2,0.4,1.7,0C21.3,24.6,32,17.5,32,10.4C32,4.7,27.3,0,23.6,0z" />
            </svg>
          </span>
        </h1>
        <span className="favorites-count">{favorites.length} items</span>
      </div>

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <div key={item.id} className="favorite-item">
              <img
                src={item.image}
                alt={item.name}
                className="favorite-image"
              />
              <div className="favorite-content">
                <h3 className="favorite-name">{item.name}</h3>
                {item.discountedPrice ? (
                  <p className="favorite-price">
                    <span
                      className="original-price"
                      style={{
                        textDecoration: "line-through",
                        color: "#000", // changed to black
                        fontSize: "15px",
                        marginRight: "0.5rem",
                        fontWeight: 400,
                        verticalAlign: "middle",
                      }}
                    >
                      {item.price}
                    </span>
                    <span
                      className="discounted-price"
                      style={{
                        color: "#000", // changed to black
                        fontWeight: 700,
                        fontSize: "22px",
                        letterSpacing: "0.5px",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.discountedPrice}
                    </span>
                  </p>
                ) : (
                  <p className="favorite-price" style={{ color: "#000" }}>{item.price}</p> // changed to black
                )}
                <div className="favorite-actions">
                  <button
                    className="add-to-cart"
                    onClick={() => addToCart(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: 500,
                    }}
                  >
                    <ShoppingCartIcon style={{ fontSize: "1.3rem" }} /> Add 
                  </button>
                  <button
                    className="remove-favorite"
                    onClick={() => removeFromFavorites(item.id)}
                    style={{
                      borderRadius: "50%",
                      transition: "background 0.2s",
                    }}
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
            style={{
              width: 120,
              opacity: 0.7,
              marginBottom: 20,
            }}
          />
          <h2
            style={{
              color: "#222",
              fontWeight: 600,
              fontSize: 26,
              marginBottom: 8,
            }}
          >
            Favorite Products is Empty
          </h2>
          <p style={{ color: "#888", fontSize: 16 }}>
            You can add products to favorites while shopping.
          </p>
        </div>
      )}
    </div>
  );
}

export default Favorites;
