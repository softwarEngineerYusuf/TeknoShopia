import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDeleteSweep, MdClear } from "react-icons/md";
import { Spin, Empty, Button, message, Input } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  clearCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../../allAPIs/cart";
import { applyCoupon } from "../../allAPIs/coupon";
import "./Basket.css";

function Basket() {
  const { user } = useAuth();
  const { cart, setCart, loading } = useCart();
  const navigate = useNavigate();

  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Kupon State'leri
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

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
      message.error(
        error.response?.data?.message ||
          "Miktar güncellenirken bir hata oluştu."
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!user || !user.id) return;
    setDeletingItemId(itemId);
    try {
      const response = await removeItemFromCart(user.id, itemId);
      if (response && response.cart) {
        setCart(response.cart);
        message.success(response.message);
        // Ürün silindiğinde, eğer kupon varsa ve sepet tutarı minimumun altına düşerse kuponu kaldır
        if (
          couponInfo &&
          response.cart.totalPrice < couponInfo.minPurchaseAmount
        ) {
          handleRemoveCoupon();
          message.warning(
            "Sepet tutarınız minimum gereksinimin altına düştüğü için kupon kaldırıldı."
          );
        }
      } else {
        message.error("Ürün silinirken bir hata oluştu.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Ürün silinirken bir hata oluştu."
      );
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!user || !user.id) return;
    try {
      const response = await clearCart(user.id);
      if (response && response.cart) {
        setCart(response.cart);
        handleRemoveCoupon(); // Sepet temizlenince kuponu da kaldır
        message.success("Sepet başarıyla temizlendi.");
      } else {
        message.error("Sepet temizlenirken bir hata oluştu.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Sepet temizlenirken bir hata oluştu."
      );
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning("Lütfen bir kupon kodu girin.");
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponCode, cart._id);
      setCouponInfo(result);
      message.success(result.message);
    } catch (error) {
      message.error(error.response?.data?.message || "Kupon uygulanamadı.");
      setCouponInfo(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInfo(null);
    setCouponCode("");
    message.info("Kupon kaldırıldı.");
  };

  const handleCheckout = () => {
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      message.error("Ödeme sayfasına gitmek için sepette ürün olmalıdır.");
      return;
    }
    navigate("/payment", { state: { cartData: cart, couponInfo: couponInfo } });
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
  const finalPrice = couponInfo ? couponInfo.finalPrice : cart.totalPrice;
  const totalDiscountAmount = totalOriginalPrice - finalPrice;

  return (
    <div className="basketAllMainPage">
      <div className="basket-left-column">
        <div className="basket-header">
          <h3 className="orderDetailHeading">
            Sepetim ({cart.cartItems.length} ürün)
          </h3>
          <button className="clear-cart-btn" onClick={handleClearCart}>
            <MdDeleteSweep size={20} /> Sepeti Temizle
          </button>
        </div>
        {cart.cartItems.map((item) => (
          <div className="summaryBasketList" key={item._id}>
            <div className="summaryBasketProductImage">
              <Link to={`/productDetail/${item.product._id}`}>
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
                  disabled={item.quantity <= 1 || updatingItemId === item._id}
                  className="quantityButton"
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
                  disabled={updatingItemId === item._id}
                  className="quantityButton"
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
          <Input
            placeholder="İndirim Kodu"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            disabled={!!couponInfo}
          />
          <Button
            className="useCouponButton"
            onClick={handleApplyCoupon}
            loading={isApplyingCoupon}
            disabled={!!couponInfo}
          >
            Kullan
          </Button>
        </div>
        {couponInfo && (
          <div className="applied-coupon-info">
            <p>
              Uygulanan Kupon: <strong>{couponInfo.coupon.code}</strong>
              <MdClear
                onClick={handleRemoveCoupon}
                className="remove-coupon-icon"
                title="Kuponu Kaldır"
              />
            </p>
            <span>{couponInfo.coupon.description}</span>
          </div>
        )}
        {totalDiscountAmount > 0 && (
          <p className="discount-summary">
            İndirimler:{" "}
            <span>-{totalDiscountAmount.toLocaleString("tr-TR")} TL</span>
          </p>
        )}
        <p className="finalPrice">
          Genel Toplam: <span>{finalPrice.toLocaleString("tr-TR")} TL</span>
        </p>
        <button className="checkoutButton" onClick={handleCheckout}>
          Ödemeye Geç
        </button>
      </div>
    </div>
  );
}

export default Basket;
