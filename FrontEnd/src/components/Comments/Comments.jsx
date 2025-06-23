import React, { useState, useEffect } from "react";
import "./Comments.css";
import { Rate, Spin, Empty } from "antd";
import { getReviewsByProductId } from "../../allAPIs/review";

// Component artık 'productId' prop'unu alıyor.
function Comments({ productId }) {
  // Yorumları ve yüklenme durumunu tutmak için state'ler.
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // productId prop'u her değiştiğinde bu effect çalışacak.
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    const fetchReviews = async () => {
      setLoading(true);
      const data = await getReviewsByProductId(productId);
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [productId]);

  // Yüklenirken gösterilecek içerik.
  if (loading) {
    return (
      <div
        className="comments-root"
        style={{ padding: "50px", textAlign: "center" }}
      >
        <Spin tip="Değerlendirmeler yükleniyor..." />
      </div>
    );
  }

  // Yorum yoksa gösterilecek içerik.
  if (reviews.length === 0) {
    return (
      <div className="comments-root">
        <h2 className="comments-title">Comments & Rating</h2>
        <Empty description="Bu ürün için henüz değerlendirme yapılmamış." />
      </div>
    );
  }

  // SİZİN JSX YAPINIZIN AYNISI, SADECE VERİ KAYNAĞI DEĞİŞTİ.
  return (
    <div className="comments-root">
      <h2 className="comments-title">Comments & Rating ({reviews.length})</h2>
      <div
        className="comments-list"
        style={{
          maxHeight: reviews.length > 4 ? 550 : "none",
          overflowY: reviews.length > 4 ? "auto" : "visible",
        }}
      >
        {/* 'sampleComments' yerine 'reviews' state'i kullanılıyor. */}
        {reviews.map((item) => (
          // key olarak item._id kullanmak daha güvenlidir.
          <div className="comment-card" key={item._id}>
            <div className="comment-header">
              {/* API'den gelen verinin yapısına göre alanlar güncellendi. */}
              <span className="comment-name">
                {item.userId?.name || "Kullanıcı"}
              </span>
              <span className="comment-date">
                {new Date(item.date).toLocaleDateString("tr-TR")}
              </span>
            </div>
            <div className="comment-rating">
              <Rate disabled value={item.rating} />
            </div>
            <div className="comment-text">{item.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
