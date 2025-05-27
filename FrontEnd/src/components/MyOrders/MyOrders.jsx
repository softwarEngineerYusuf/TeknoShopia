import React from 'react';
import './MyOrders.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

const mockOrders = [
  {
    id: 1,
    date: '2024-03-15',
    orderNumber: 'ORD-2024-001',
    orderImage: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg',
    orderImage2: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/150368-1_large.jpg',
    status: 'Teslim Edildi',
    total: 1299.99,
    items: [
      { 
        name: 'iPhone Case', 
        quantity: 1, 
        price: 299.99,
        image: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg'
      },
      { 
        name: 'AirPods Pro', 
        quantity: 1, 
        price: 1000.00,
        image: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg'
      }
    ]
  },
  {
    id: 2,
    date: '2024-03-10',
    orderNumber: 'ORD-2024-002',
    orderImge: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg',
    status: 'Kargoda',
    total: 799.50,
    items: [
      { 
        name: 'Samsung Galaxy S24 Kılıf', 
        quantity: 1, 
        price: 799.50,
        image: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg'
      }
    ]
  },
  {
    id: 3,
    date: '2024-03-05',
    orderNumber: 'ORD-2024-003',
    orderImge: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg',
    status: 'İşleme Alındı',
    total: 2499.99,
    items: [
      { 
        name: 'iPad Mini', 
        quantity: 1, 
        price: 2499.99,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=120&h=120&fit=crop'
      }
    ]
  }
];

function ReviewModal({ open, onClose, onSubmit }) {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setRating(0);
      setComment('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Evaluate the product</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
          <Rating
            name="product-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            icon={<StarIcon style={{ fontSize: 44, color: '#FFD700' }} />}         // Sarı yıldız
            emptyIcon={<StarIcon style={{ fontSize: 44, color: '#FFD700', opacity: 0.3 }} />}
          />
        </div>
        <TextField
          label="Comment.."
          multiline
          minRows={3}
          fullWidth
          value={comment}
          onChange={e => setComment(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" style={{ backgroundColor: 'red', color: 'white' }} variant="contained">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSubmit({ rating, comment });
            onClose();
          }}
          color="primary"
          variant="contained"
          disabled={rating === 0}
         style={{ backgroundColor: 'green', color: 'white' }}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleReviewClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleReviewSubmit = ({ rating, comment }) => {
    // Burada API'ye gönderme işlemi yapılabilir
    // console.log('Yıldız:', rating, 'Yorum:', comment, 'Ürün:', selectedItem);
    alert(`Yıldız: ${rating}\nYorum: ${comment}\nÜrün: ${selectedItem?.name}`);
  };

  return (
    <div className="order-card">
      <div className="order-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className='order-image'>
          <img src={order.orderImage} alt="Order" />
          {order.orderImage2 && <img src={order.orderImage2} alt="Order" />}
        </div>
        <div className="order-main-info">
          <span className="order-number">{order.orderNumber}</span>
          <span className="order-date">{order.date}</span>
        </div>
        <div className="order-status-price">
          <span className={`order-status status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {order.status}
          </span>
          <span className="order-total">{order.total.toFixed(2)} ₺</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="order-details">
          <h4>Sipariş Detayları</h4>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <span className="item-name">{item.name}</span>
                </div>
                <button
                  className='review-star-button'
                  onClick={e => {
                    e.stopPropagation();
                    handleReviewClick(item);
                  }}
                >
                  Review & Star
                </button>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">{item.price.toFixed(2)} ₺</span>
              </div>
            ))}
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

function MyOrders() {
  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>
        <div className="orders-list">
          {mockOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;