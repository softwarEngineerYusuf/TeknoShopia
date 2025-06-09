import { useState } from "react";
import { Link } from "react-router-dom";
import { MdDeleteSweep } from "react-icons/md";
import { Spin, Empty, Button, message } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  clearCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../../allAPIs/cart";
import "./Basket.css";
import { useNavigate } from "react-router-dom";

function Basket() {
  const { user } = useAuth();
  const { cart, setCart, loading } = useCart();

  const [deletingItemId, setDeletingItemId] = useState(null);
  const navigate = useNavigate();
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItemId(itemId);
    try {
      const response = await updateItemQuantity(user.id, itemId, newQuantity);
      if (response && response.cart) {
        setCart(response.cart);
        message.success(response.message);
      }
    } catch (error) {
      message.error(error.message || "Miktar güncellenirken bir hata oluştu.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.cartItems.length === 0) {
      message.error("Ödeme sayfasına gitmek için sepette ürün olmalıdır.");
      return;
    }
    navigate("/payment", { state: { cartData: cart } });
  };

  const handleRemoveItem = async (itemId) => {
    if (!user || !user.id) return;

    setDeletingItemId(itemId);
    const response = await removeItemFromCart(user.id, itemId);

    if (response && response.cart) {
      setCart(response.cart);
      message.success(response.message);
    } else {
      message.error("Ürün silinirken bir hata oluştu.");
    }
    setDeletingItemId(null);
  };
  const handleClearCart = async () => {
    if (user && user.id) {
      const response = await clearCart(user.id);
      if (response) {
        setCart(response.cart);
        message.success("Sepet başarıyla temizlendi.");
      } else {
        message.error("Sepet temizlenirken bir hata oluştu.");
      }
    }
  };

  if (loading) {
    return <Spin tip="Sepet Yükleniyor..." fullscreen />;
  }

  if (!user) {
    return (
      <div className="basket-empty-state">
        <Empty description="Sepetinizi görmek için lütfen giriş yapın." />
        <Link to="/login">
          <Button type="primary" style={{ marginTop: 16 }}>
            Giriş Yap
          </Button>
        </Link>
      </div>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="basket-empty-state">
        <Empty description="Sepetiniz şu anda boş." />
        <Link to="/">
          <Button type="primary" style={{ marginTop: 16 }}>
            Alışverişe Başla
          </Button>
        </Link>
      </div>
    );
  }

  const totalOriginalPrice = cart.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalDiscountAmount = totalOriginalPrice - cart.totalPrice;

  return (
    <div className="basketAllMainPage">
      <div className="basket-left-column">
        <div className="basket-header">
          <h3 className="orderDetailHeading">
            Sepetim ({cart.cartItems.length} ürün)
          </h3>
          <button
            className="clear-cart-btn"
            onClick={handleClearCart}
            aria-label="Clear entire basket"
          >
            <MdDeleteSweep size={20} />
            Clean the basket
          </button>
        </div>
        {cart.cartItems.map((item) => (
          <div className="summaryBasketList" key={item._id}>
            <div className="summaryBasketProductImage">
              <Link
                to={`/productDetail/${item.product._id}`}
                className="summaryBasketProductImage"
              >
                <img src={item.product.mainImage} alt={item.product.name} />
              </Link>
            </div>

            <div className="summaryBasketProductDetails">
              <p className="brand">
                {item.product.brand?.name || "Marka Bilgisi Yok"}
              </p>
              <p className="productName">{item.product.name}</p>
              <p className="color">Renk: {item.product.color}</p>

              <div className="pieceOfProductBasketDetail">
                <p>Adet:</p>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                  className="quantityButton"
                  aria-label="Decrease quantity"
                  disabled={item.quantity <= 1 || updatingItemId === item._id}
                >
                  −
                </button>
                <span className="quantityValue">
                  {updatingItemId === item._id ? (
                    <Spin size="small" />
                  ) : (
                    item.quantity
                  )}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                  className="quantityButton"
                  aria-label="Increase quantity"
                  disabled={updatingItemId === item._id}
                >
                  +
                </button>
              </div>
            </div>

            <div className="priceOfProductBasket">
              {item.product.discount > 0 && (
                <p className="originalPrice">
                  {(item.product.price * item.quantity).toLocaleString("tr-TR")}{" "}
                  TL
                </p>
              )}
              <p className="discountedPrice">
                {item.subtotal.toLocaleString("tr-TR")} TL
              </p>
            </div>

            <button
              className="trash-icon-btn"
              onClick={() => handleRemoveItem(item._id)}
              aria-label="Remove item from basket"
              disabled={deletingItemId === item._id}
            >
              {deletingItemId === item._id ? (
                <Spin size="small" />
              ) : (
                <MdDeleteSweep size={28} color="#e63946" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="summaryOrderList">
        <h3>Sipariş Özeti</h3>
        <p>
          Ara Toplam:{" "}
          <span>{totalOriginalPrice.toLocaleString("tr-TR")} TL</span>
        </p>

        <div className="couponCodeEnterArea">
          <input
            type="text"
            placeholder="İndirim Kodu"
            aria-label="Coupon Code"
          />
          <button className="useCouponButton">Kullan</button>
        </div>

        {totalDiscountAmount > 0 && (
          <p className="discount-summary">
            İndirimler:{" "}
            <span>-{totalDiscountAmount.toLocaleString("tr-TR")} TL</span>
          </p>
        )}
        <p className="finalPrice">
          Genel Toplam:{" "}
          <span>{cart.totalPrice.toLocaleString("tr-TR")} TL</span>
        </p>
        <button className="checkoutButton" onClick={handleCheckout}>
          Ödemeye Geç
        </button>
      </div>
    </div>
  );
}

export default Basket;
