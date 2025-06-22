import React, { useState, useEffect } from "react";
import "./MyOrders.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { getOrdersByUserId } from "../../allAPIs/order";
import { useAuth } from "../../context/AuthContext";
import { useGoToProductDetail } from "../../components/GoToProductDetailFunction/GoToProductDetail";

// ReviewModal component'i
function ReviewModal({ open, onClose, onSubmit }) {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setRating(0);
      setComment("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Ürünü Değerlendir</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "12px 0",
          }}
        >
          <Rating
            name="product-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            icon={<StarIcon style={{ fontSize: 44, color: "#FFD700" }} />}
            emptyIcon={
              <StarIcon
                style={{ fontSize: 44, color: "#FFD700", opacity: 0.3 }}
              />
            }
          />
        </div>
        <TextField
          label="Yorumunuz.."
          multiline
          minRows={3}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          style={{ backgroundColor: "red", color: "white" }}
          variant="contained"
        >
          İptal
        </Button>
        <Button
          onClick={() => {
            onSubmit({ rating, comment });
            onClose();
          }}
          color="primary"
          variant="contained"
          disabled={rating === 0}
          style={{ backgroundColor: "green", color: "white" }}
        >
          Gönder
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// OrderCard component'i
function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const goToProductDetail = useGoToProductDetail();

  const handleReviewClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };
  const handleImageClick = (e, productId) => {
    e.stopPropagation();
    goToProductDetail(productId);
  };
  const handleReviewSubmit = ({ rating, comment }) => {
    alert(
      `Yıldız: ${rating}\nYorum: ${comment}\nÜrün: ${selectedItem?.product.name}`
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Processing":
        return "İşleme Alındı";
      case "Shipped":
        return "Kargoda";
      case "Delivered":
        return "Teslim Edildi";
      case "Cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  // Siparişin indirimsiz orijinal fiyatını hesapla
  const originalTotalPrice = order.orderItems.reduce((sum, item) => {
    if (item.product && typeof item.product.price === "number") {
      return sum + item.product.price * item.quantity;
    }
    return sum + item.price * item.quantity;
  }, 0);

  // Siparişin kupon uygulanmadan önceki ara toplamını hesapla (ürün indirimleri dahil)
  const subtotalBeforeCoupon = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // İndirim olup olmadığını kontrol et
  const showOriginalPrice =
    Math.round(originalTotalPrice * 100) > Math.round(order.totalPrice * 100);

  return (
    <div className="order-card">
      <div className="order-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="order-image">
          {order.orderItems[0]?.product?.mainImage && (
            <img
              src={order.orderItems[0].product.mainImage}
              alt={order.orderItems[0].product.name}
              className="clickable-product-image"
              onClick={(e) =>
                handleImageClick(e, order.orderItems[0].product._id)
              }
            />
          )}
          {order.orderItems[1]?.product?.mainImage && (
            <img
              src={order.orderItems[1].product.mainImage}
              alt={order.orderItems[1].product.name}
              className="clickable-product-image"
              onClick={(e) =>
                handleImageClick(e, order.orderItems[1].product._id)
              }
            />
          )}
        </div>
        <div className="order-main-info">
          <span className="order-number">Sipariş No: {order._id}</span>
          <span className="order-date">
            {new Date(order.createdAt).toLocaleDateString("tr-TR")}
          </span>
        </div>
        <div className="order-status-price">
          <span
            className={`order-status status-${order.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {getStatusText(order.status)}
          </span>
          <div className="price-section">
            {showOriginalPrice && (
              <span className="order-original-price">
                {originalTotalPrice.toFixed(2)} ₺
              </span>
            )}
            <span className="order-total">{order.totalPrice.toFixed(2)} ₺</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="order-details">
          <h4>Sipariş Detayları</h4>

          <div className="order-items">
            {order.orderItems.map(
              (item) =>
                item.product && (
                  <div key={item._id} className="order-item">
                    <div className="item-info">
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="item-image clickable-product-image"
                        onClick={() => goToProductDetail(item.product._id)}
                      />
                      <span className="item-name">{item.product.name}</span>
                    </div>
                    <button
                      className="review-star-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewClick(item);
                      }}
                    >
                      Değerlendir
                    </button>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">
                      {item.price.toFixed(2)} ₺
                    </span>
                  </div>
                )
            )}
          </div>

          {/* Sipariş detayının altına finansal özet ekliyoruz */}
          <div className="order-details-summary">
            <div className="summary-row">
              <span>Ara Toplam</span>
              <span>{subtotalBeforeCoupon.toFixed(2)} ₺</span>
            </div>
            {order.coupon && order.coupon.code && (
              <div className="summary-row discount">
                <span>Kupon ({order.coupon.code})</span>
                <span>-{order.coupon.discountAmount.toFixed(2)} ₺</span>
              </div>
            )}
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <strong>Genel Toplam</strong>
              <strong>{order.totalPrice.toFixed(2)} ₺</strong>
            </div>
          </div>
        </div>
      )}
      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}

// MyOrders ana componenti
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
          const userOrders = await getOrdersByUserId(user.id);
          console.log("MyOrders - GÜNCEL Sipariş Verileri:", userOrders);
          setOrders(userOrders);
        } catch (err) {
          setError(
            "Siparişleriniz yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>
          <span>Siparişlerim</span>
          <span
            className="electro-anim"
            aria-label="Order Animation"
            title="Order Animation"
          >
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="6" y="16" width="36" height="22" rx="4" fill="#4F8EF7" />
              <rect x="10" y="20" width="28" height="14" rx="2" fill="#fff" />
              <rect x="18" y="28" width="12" height="4" rx="2" fill="#4F8EF7" />
              <circle cx="16" cy="40" r="3" fill="#FFD600" />
              <circle cx="32" cy="40" r="3" fill="#FFD600" />
              <rect
                x="20"
                y="10"
                width="8"
                height="8"
                rx="2"
                fill="#FFD600"
                stroke="#4F8EF7"
                strokeWidth="1.5"
              />
              <path
                d="M24 10v-3"
                stroke="#4F8EF7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M24 7h2.5"
                stroke="#4F8EF7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M24 7h-2.5"
                stroke="#4F8EF7"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        <div className="orders-list">
          {loading && (
            <p style={{ textAlign: "center" }}>Siparişleriniz yükleniyor...</p>
          )}
          {error && (
            <p style={{ textAlign: "center", color: "red" }}>{error}</p>
          )}
          {!loading &&
            !error &&
            (orders.length > 0 ? (
              orders.map((order) => <OrderCard key={order._id} order={order} />)
            ) : (
              <p style={{ textAlign: "center" }}>
                Henüz hiç sipariş vermediniz.
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
