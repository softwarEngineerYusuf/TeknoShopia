import { useState } from "react";
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

  const locale = "tr-TR";

  const handleQuantityChange = async (itemId, newQuantity) => {
    const item = cart.cartItems.find((i) => i._id === itemId);
    if (newQuantity > item.product.stock) {
      message.warning(
        `Cannot add more. Only ${item.product.stock} items in stock.`
      );
      return;
    }

    if (newQuantity < 1) return;
    setUpdatingItemId(itemId);
    try {
      const response = await updateItemQuantity(user.id, itemId, newQuantity);
      if (response && response.cart) {
        setCart(response.cart);
        // Kupon varsa, yeni fiyata göre yeniden değerlendir
        if (couponInfo) {
          handleApplyCoupon(true); // `true` parametresi, mevcut kupon kodunu yeniden uygulamasını sağlar.
        } else {
          message.success(response.message || "Quantity updated.");
        }
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
        // *** DEĞİŞİKLİK: Kupon kontrolü düzeltildi ***
        // Kuponun minimum harcama tutarı kontrolü
        if (
          couponInfo &&
          response.cart.totalPrice < couponInfo.coupon.minPurchaseAmount
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

  // *** DEĞİŞİKLİK: Fonksiyon, mevcut kuponu yeniden uygulamak için güncellendi ***
  const handleApplyCoupon = async (isReapply = false) => {
    const codeToApply = isReapply ? couponInfo.coupon.code : couponCode;
    if (!codeToApply.trim()) {
      message.warning("Please enter a coupon code.");
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(codeToApply, cart._id);
      setCouponInfo(result);
      if (!isReapply) {
        message.success(result.message || "Coupon applied successfully.");
      }
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

  // *** ANA DEĞİŞİKLİK: handleCheckout fonksiyonu tamamen yeniden yazıldı ***
  const handleCheckout = () => {
    // 1. Geçerli ürünleri filtrele
    const allValidItems = cart?.cartItems?.filter((item) => item.product);
    if (!allValidItems || allValidItems.length === 0) {
      message.error("Your cart must contain available products to proceed.");
      return;
    }

    // 2. Stok durumuna göre ayır
    const inStockItems = allValidItems.filter((item) => item.product.stock > 0);
    const outOfStockItems = allValidItems.filter(
      (item) => item.product.stock <= 0
    );

    // 3. Satın alınacak ürün yoksa durdur
    if (inStockItems.length === 0) {
      message.error(
        "All items in your cart are out of stock. Please remove them to add new items."
      );
      return;
    }

    // 4. Stoktaki ürünlerle yeni sepet verisi oluştur
    const checkoutSubtotal = inStockItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const cartForCheckout = {
      ...cart,
      cartItems: inStockItems,
      totalPrice: checkoutSubtotal, // Bu kuponsuz, ürün indirimli fiyattır.
    };

    let couponForCheckout = null;

    // 5. Kuponun yeni toplama göre hala geçerli olup olmadığını kontrol et
    if (couponInfo && checkoutSubtotal >= couponInfo.coupon.minPurchaseAmount) {
      // Kupon hala geçerli. Ödeme sayfası için indirimleri yeniden hesapla.
      const { discountType, discountValue } = couponInfo.coupon;
      let newDiscountAmount = 0;

      if (discountType === "percentage") {
        newDiscountAmount = (checkoutSubtotal * discountValue) / 100;
      } else if (discountType === "fixedAmount") {
        newDiscountAmount = discountValue;
      }

      const newFinalPrice = Math.max(0, checkoutSubtotal - newDiscountAmount);

      // Ödeme sayfasına gönderilecek kupon nesnesini oluştur.
      couponForCheckout = {
        ...couponInfo, // Orijinal kupon bilgisini koru
        originalPrice: checkoutSubtotal,
        discountAmount: newDiscountAmount,
        finalPrice: newFinalPrice,
      };
    } else if (couponInfo) {
      // Kupon vardı ama artık geçersiz, kullanıcıyı bilgilendir.
      message.info(
        `Coupon '${couponInfo.coupon.code}' was removed as the new total is below the minimum purchase amount.`,
        5
      );
    }

    // 6. Stokta olmayan ürünler hakkında uyar
    if (outOfStockItems.length > 0) {
      const itemNames = outOfStockItems
        .map((item) => item.product.name)
        .join(", ");
      message.warning(
        `The following items are out of stock and won't be included in your order: ${itemNames}`,
        6
      );
    }

    // 7. Doğru verilerle ödeme sayfasına yönlendir
    navigate("/payment", {
      state: { cartData: cartForCheckout, couponInfo: couponForCheckout },
    });
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

  const totalOriginalPrice = cart.cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  // *** DEĞİŞİKLİK: Fiyat gösterimi düzeltildi ***
  const subtotal = cart.totalPrice;
  const finalPrice = couponInfo ? couponInfo.finalPrice : subtotal;
  const totalDiscountAmount = subtotal - finalPrice;

  return (
    <div className="basketAllMainPage">
      <div className="basket-left-column">
        {/* ... (Sepet listesi kısmı aynı kalacak, .toLocaleString(locale) zaten doğru) ... */}
        {/* JSX'in geri kalanında değişiklik yapmaya gerek yok, sadece yukarıdaki JS mantığı değişti. */}
        {/* Örnek olması açısından summary kısmını tekrar ekliyorum: */}
        {
          /* JSX... */
          cart.cartItems.map((item) => {
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

            const isOutOfStock = item.product.stock <= 0;

            return (
              <div
                className={`summaryBasketList ${
                  isOutOfStock ? "out-of-stock-item" : ""
                }`}
                key={item._id}
              >
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
                  <p className="color">
                    Color: {getProductColor(item.product)}
                  </p>

                  {isOutOfStock && (
                    <p className="out-of-stock-message">
                      Out of Stock! Will be removed at checkout.
                    </p>
                  )}

                  <div className="pieceOfProductBasketDetail">
                    <p>Quantity:</p>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      disabled={
                        item.quantity <= 1 ||
                        updatingItemId === item._id ||
                        isOutOfStock
                      }
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
                      disabled={updatingItemId === item._id || isOutOfStock}
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
                        locale
                      )}{" "}
                      TL
                    </p>
                  )}
                  <p className="discountedPrice">
                    {item.subtotal.toLocaleString(locale)} TL
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
          })
        }
      </div>

      <div className="summaryOrderList">
        <h3>Order Summary</h3>
        <p>
          Subtotal: <span>{subtotal.toLocaleString(locale)} TL</span>
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
            onClick={() => handleApplyCoupon(false)}
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
            <span>-{totalDiscountAmount.toLocaleString(locale)} TL</span>
          </p>
        )}
        <p className="finalPrice">
          Total: <span>{finalPrice.toLocaleString(locale)} TL</span>
        </p>
        <button className="checkoutButton" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Basket;
