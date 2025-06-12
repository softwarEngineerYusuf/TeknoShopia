import React from 'react'
import './Comments.css'
import { Rate } from 'antd'

const sampleComments = [
  {
    name: 'Ahmet Yılmaz',
    comment: 'Ürün beklediğimden çok daha iyi çıktı, hızlı kargo için teşekkürler!',
    date: '2025-06-10',
    rating: 2,
  },
  {
    name: 'Zeynep Kaya',
    comment: 'Fiyat/performans ürünü, tavsiye ederim.',
    date: '2025-06-08',
    rating: 4,
  },
  {
    name: 'Mehmet Demir',
    comment: 'Kargo biraz gecikti ama ürün güzel.',
    date: '2025-06-05',
    rating: 3,
  },
  {
    name: 'Elif Çetin',
    comment: 'Paketleme çok iyiydi, ürün sorunsuz elime ulaştı.',
    date: '2025-06-03',
    rating: 5,
  },
  {
    name: 'Burak Şahin',
    comment: 'Ürün açıklamalardaki gibi, memnun kaldım.',
    date: '2025-06-01',
    rating: 4,
  },
]

function Comments() {
  return (
    <div className="comments-root">
      <h2 className="comments-title">Comments & Rating</h2>
      <div className="comments-list" style={{
        maxHeight: sampleComments.length > 4 ? 550 : 'none',
        overflowY: sampleComments.length > 4 ? 'auto' : 'visible',
      }}>
        {sampleComments.map((item, idx) => (
          <div className="comment-card" key={idx}>
            <div className="comment-header">
              <span className="comment-name">{item.name}</span>
              <span className="comment-date">{new Date(item.date).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="comment-rating">
              <Rate disabled value={item.rating} />
            </div>
            <div className="comment-text">{item.comment}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comments