import React, { useState } from "react";
import "./Basket.css";
import { MdDeleteSweep } from "react-icons/md";

function Basket() {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const pricePerItem = 1000;
  const pricePerItemDiscount = 200;
  const totalOriginalPrice = pricePerItem * quantity;
  const totalDiscountedPrice = (pricePerItem - pricePerItemDiscount) * quantity;

  return (
    <div className="basketAllMainPage">
      <h3 className="orderDetailHeading">Order Detail</h3>

      <div className="summaryBasketList" style={{ position: "relative" }}>
        {/* Kartın sağ üst köşesine yeni çöp kutusu ikonu */}
        <button
          className="trash-icon-btn"
          aria-label="Remove from basket"
        >
          <MdDeleteSweep size={32} color="#e63946" />
        </button>

        <div className="summaryBasketProductImage">
          <img
            src="https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/1-244_small.jpg"
            alt="iPhone 16"
          />
        </div>

        <div className="summaryBasketProductDetails">
          <p className="brand">Apple</p>
          <p className="productName">iPhone 16</p>
          <p className="color">Color: Blue</p>

          <div className="pieceOfProductBasketDetail">
            <p>Quantity:</p>
            <button onClick={handleDecrease} className="quantityButton" aria-label="Decrease quantity">−</button>
            <span className="quantityValue">{quantity}</span>
            <button onClick={handleIncrease} className="quantityButton" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div className="priceOfProductBasket">
          <p className="originalPrice">${totalOriginalPrice.toLocaleString()}</p>
          <p className="discountedPrice">${totalDiscountedPrice.toLocaleString()}</p>
        </div>
      </div>

      <div className="summaryOrderList">
        <h3>Order Summary</h3>
        <p>Total: <span>${totalOriginalPrice.toLocaleString()}</span></p>

        <div className="couponCodeEnterArea">
          <input type="text" placeholder="Coupon Code" aria-label="Coupon Code" />
          <button className="useCouponButton">Use</button>
        </div>

        <p>Discounts: <span>-${(pricePerItemDiscount * quantity).toLocaleString()}</span></p>
        <p className="finalPrice">Final Price: <span>${totalDiscountedPrice.toLocaleString()}</span></p>
        <button className="checkoutButton">Checkout</button>
      </div>
    </div>
  );
}

export default Basket;
