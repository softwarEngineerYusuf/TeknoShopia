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

const getProductColor = (product) => {
  if (!product || !product.attributes) return "N/A";
  const attributes = product.attributes;
  return (
    attributes.Color ||
    attributes.color ||
    attributes.Renk ||
    attributes.renk ||
    "N/A"
  );
};

function Basket() {
  const { user } = useAuth();
  const { cart, setCart, loading } = useCart();
  const navigate = useNavigate();

  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // ... (handleQuantityChange, handleRemoveItem, handleClearCart, vb. fonksiyonlar aynı kalabilir)
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItemId(itemId);
    try {
      const response = await updateItemQuantity(user.id, itemId, newQuantity);
      if (response && response.cart) {
        setCart(response.cart);
        message.success(response.message || "Quantity updated.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Error updating quantity."
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!user?.id) return;
    setDeletingItemId(itemId);
    try {
      const response = await removeItemFromCart(user.id, itemId);
      if (response && response.cart) {
        setCart(response.cart);
        message.success(response.message || "Item removed from cart.");
        if (
          couponInfo &&
          response.cart.totalPrice < couponInfo.minPurchaseAmount
        ) {
          handleRemoveCoupon();
          message.warning(
            "Coupon removed as cart total is below the minimum requirement."
          );
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Error removing item.");
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!user?.id) return;
    try {
      const response = await clearCart(user.id);
      if (response && response.cart) {
        setCart(response.cart);
        handleRemoveCoupon();
        message.success("Cart has been cleared.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Error clearing cart.");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning("Please enter a coupon code.");
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponCode, cart._id);
      setCouponInfo(result);
      message.success(result.message || "Coupon applied successfully.");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to apply coupon.");
      setCouponInfo(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInfo(null);
    setCouponCode("");
    message.info("Coupon removed.");
  };

  const handleCheckout = () => {
    // Sadece geçerli ürünleri kontrol et
    const validItems = cart?.cartItems?.filter((item) => item.product);
    if (!validItems || validItems.length === 0) {
      message.error("Your cart must contain available products to proceed.");
      return;
    }
    navigate("/payment", { state: { cartData: cart, couponInfo: couponInfo } });
  };

  if (loading) {
    return <Spin tip="Loading Cart..." fullscreen />;
  }

  if (!user) {
    return (
      <div className="basket-empty-state">
        <Empty description="Please log in to view your cart." />
        <Link to="/login">
          <Button type="primary" style={{ marginTop: 16 }}>
            Login
          </Button>
        </Link>
      </div>
    );
  }

  // Sepet boş veya sadece geçersiz (silinmiş) ürünler varsa
  const validCartItems = cart?.cartItems?.filter((item) => item.product);
  if (!cart || !validCartItems || validCartItems.length === 0) {
    return (
      <div className="basket-empty-state">
        <Empty description="Your cart is currently empty." />
        <Link to="/">
          <Button type="primary" style={{ marginTop: 16 }}>
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  // --- HATA DÜZELTMESİ 1: .reduce() fonksiyonunu güvenli hale getirme ---
  // Sadece `item.product`'ın var olduğu ürünleri hesaba kat.
  const totalOriginalPrice = cart.cartItems.reduce((sum, item) => {
    // Optional Chaining (?.) kullanarak `item.product` null ise çökmesini engelle
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const finalPrice = couponInfo ? couponInfo.finalPrice : cart.totalPrice;
  const totalDiscountAmount = totalOriginalPrice - finalPrice;

  return (
    <div className="basketAllMainPage">
      <div className="basket-left-column">
        <div className="basket-header">
          <h3 className="orderDetailHeading">
            My Cart ({validCartItems.length} items)
          </h3>
          <button className="clear-cart-btn" onClick={handleClearCart}>
            <MdDeleteSweep size={20} /> Clear Cart
          </button>
        </div>

        {/* --- HATA DÜZELTMESİ 2: .map() içinde null ürün kontrolü --- */}
        {cart.cartItems.map((item) => {
          // Eğer ürün silinmişse, özel bir bildirim göster
          if (!item.product) {
            return (
              <div
                className="summaryBasketList unavailable-item"
                key={item._id}
              >
                <p className="productName">
                  This product is no longer available.
                </p>
                <Button
                  danger
                  size="small"
                  onClick={() => handleRemoveItem(item._id)}
                  loading={deletingItemId === item._id}
                >
                  Remove
                </Button>
              </div>
            );
          }

          // Eğer ürün geçerliyse, normal şekilde render et
          return (
            <div className="summaryBasketList" key={item._id}>
              <div className="summaryBasketProductImage">
                <Link to={`/productDetail/${item.product._id}`}>
                  <img src={item.product.mainImage} alt={item.product.name} />
                </Link>
              </div>
              <div className="summaryBasketProductDetails">
                <p className="brand">
                  {item.product.brand?.name || "Brandless"}
                </p>
                <p className="productName">{item.product.name}</p>
                <p className="color">Color: {getProductColor(item.product)}</p>
                <div className="pieceOfProductBasketDetail">
                  <p>Quantity:</p>
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
                    {(item.product.price * item.quantity).toLocaleString(
                      "en-US"
                    )}{" "}
                    TL
                  </p>
                )}
                <p className="discountedPrice">
                  {item.subtotal.toLocaleString("en-US")} TL
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
          );
        })}
      </div>

      <div className="summaryOrderList">
        {/* ... (Bu kısım aynı kalabilir) ... */}
        <h3>Order Summary</h3>
        <p>
          Subtotal: <span>{totalOriginalPrice.toLocaleString("en-US")} TL</span>
        </p>
        <div className="couponCodeEnterArea">
          <Input
            placeholder="Discount Code"
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
            Apply
          </Button>
        </div>
        {couponInfo && (
          <div className="applied-coupon-info">
            <p>
              Applied Coupon: <strong>{couponInfo.coupon.code}</strong>
              <MdClear
                onClick={handleRemoveCoupon}
                className="remove-coupon-icon"
                title="Remove Coupon"
              />
            </p>
            <span>{couponInfo.coupon.description}</span>
          </div>
        )}
        {totalDiscountAmount > 0 && (
          <p className="discount-summary">
            Discounts:{" "}
            <span>-{totalDiscountAmount.toLocaleString("en-US")} TL</span>
          </p>
        )}
        <p className="finalPrice">
          Total: <span>{finalPrice.toLocaleString("en-US")} TL</span>
        </p>
        <button className="checkoutButton" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Basket;
