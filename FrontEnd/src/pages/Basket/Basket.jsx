import React, { useState } from "react";
import "../Basket/Basket.css";

function Basket() {
  const [quantity, setQuantity] = useState(1); // Ürün adeti state'i

  const handleIncrease = () => {
    setQuantity(quantity + 1); // Artırma butonu
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Azaltma butonu
    }
  };

  const pricePerItem = 1000; // Ürün birim fiyatı (sabit)
  const pricePerItemDiscount = 200; // Ürün indirim miktarı (sabit)
  const totalOriginalPrice = pricePerItem * quantity; // İndirimsiz toplam fiyat
  const totalDiscountedPrice = (pricePerItem - pricePerItemDiscount) * quantity; // İndirimli toplam fiyat

  return (
    <div className="basketAllMainPage">
      <h3 className="orderDetailHeading">Order Detail</h3>

      <div className="summaryBasketList">
        <div className="summaryBasketProductImage">
          <img
            style={{ width: "13rem", height: "13rem" }}
            src="https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/1-244_small.jpg"
            alt="iPhone 16"
          />
        </div>

        {/* Ürün Bilgileri */}
        <div className="summaryBasketProductDetails">
          <p>Apple</p>
          <p>iPhone 16</p>
          <p>Renk: Mavi</p>
        </div>

        {/* Adet Kontrolü */}
        <div className="pieceOfProductBasketDetail">
          <p>Adet:</p>
          <button onClick={handleDecrease} className="quantityButton">-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease} className="quantityButton">+</button>
        </div>

        {/* Fiyat */}
        <div className="priceOfProductBasket">
          <p style={{ textDecoration: "line-through" }}>{totalOriginalPrice}$</p>
          <p style={{ color: "red" }}>{totalDiscountedPrice}$</p>
        </div>
      </div>

      {/* Sipariş Özeti */}
      <div className="summaryOrderList">
        <h3>Sipariş Özeti</h3>
        <p>Toplam: {totalOriginalPrice}$</p>
        <p>İndirimler Toplamı: {pricePerItemDiscount * quantity}$</p>
        <p>Toplam Fiyat: {totalDiscountedPrice}$</p>
        <button className="checkoutButton">Satın Al</button>
      </div>
    </div>
  );
}

export default Basket;
