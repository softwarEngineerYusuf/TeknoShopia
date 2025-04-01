import React, { useState } from 'react'
import "./Favorites.css"

function Favorites() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Iphone 13 128 Gb Black',
      price: '$599.99',
      discountedPrice: '$529.99',
      image: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg'
    },
    {
      id: 2,
      name: 'Iphone 13 128 Gb Black',
      price: '$599.99',
      image: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg'
    },
    {
      id: 3,
      name: 'Iphone 13 128 Gb Black',
      price: '$559.99',
      discountedPrice: '$529.99',
      image: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg'
    },
    {
      id: 4,
      name: 'Iphone 13 128 Gb Black',
      price: '$559.99',
      discountedPrice: '$529.99',
      image: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg'
    }
  ]);

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const addToCart = (id) => {
    console.log('Added to cart:', id);
  };

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="favorites-title">My Favorites</h1>
        <span className="favorites-count">{favorites.length} items</span>
      </div>

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map(item => (
            <div key={item.id} className="favorite-item">
              <img src={item.image} alt={item.name} className="favorite-image" />
              <div className="favorite-content">
                <h3 className="favorite-name">{item.name}</h3>
                {item.discountedPrice ? (
                  <p className="favorite-price">
                    <span className="original-price"
                    style={{
                      textDecoration: 'line-through',
                      color: 'grey',
                      marginRight: '0.5rem'
                    }}>{item.price}</span>
                    <span className="discounted-price">{item.discountedPrice}</span>
                  </p>
                ) : (
                  <p className="favorite-price">{item.price}</p>
                )}
                <div className="favorite-actions">
                  <button 
                    className="add-to-cart"
                    onClick={() => addToCart(item.id)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="remove-favorite"
                    onClick={() => removeFromFavorites(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <h2>Your favorites list is empty</h2>
          <p>Add items to your favorites while shopping</p>
        </div>
      )}
    </div>
  );
}

export default Favorites
