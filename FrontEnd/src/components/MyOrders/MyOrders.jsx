import React from 'react';
import './MyOrders.css';

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

function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="order-card">
      <div className="order-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className='order-image'>
          <img src={order.orderImage} alt="Order" />
          <img src={order.orderImage2} alt="Order" />
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
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">{item.price.toFixed(2)} ₺</span>
              </div>
            ))}
          </div>
        </div>
      )}
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