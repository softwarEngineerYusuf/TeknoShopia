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
import { addReview } from "../../allAPIs/review"; // GÜNCELLENDİ: API fonksiyonunu import et

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
          variant="contained"
          disabled={!rating || !comment.trim()}
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
  const { user } = useAuth(); // Kullanıcı bilgilerini al

  const handleReviewClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleImageClick = (e, productId) => {
    e.stopPropagation();
    goToProductDetail(productId);
  };

  // GÜNCELLENDİ: handleReviewSubmit fonksiyonu backend'e istek atacak
  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!selectedItem || !user?.id) {
      console.error("Yorum gönderilemedi: Kullanıcı veya ürün bilgisi eksik.");
      return;
    }
    const reviewData = {
      productId: selectedItem.product._id,
      userId: user.id,
      rating,
      comment,
    };
    try {
      await addReview(reviewData);
    } catch (error) {
      console.error("Değerlendirme gönderilirken bir hata oluştu:", error);
    }
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

  const originalTotalPrice = order.orderItems.reduce((sum, item) => {
    return sum + (item.product?.price || item.price) * item.quantity;
  }, 0);

  const subtotalBeforeCoupon = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const showOriginalPrice =
    Math.round(originalTotalPrice) > Math.round(order.totalPrice);

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
          <span className="order-number">Sipariş No: {order.orderNumber}</span>
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
                    {/* Her durumda değerlendirme butonunu gösteriyoruz (sipariş kontrolü kaldırıldı) */}
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
          <div className="order-details-summary">
            <div className="summary-row">
              <span>Ara Toplam</span>
              <span>{subtotalBeforeCoupon.toFixed(2)} ₺</span>
            </div>
            {order.coupon?.code && (
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
          const sortedOrders = userOrders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
        } catch (err) {
          setError("Siparişleriniz yüklenirken bir hata oluştu.");
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
