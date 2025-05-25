import React, { useState } from 'react';
import { Pencil, Trash2, CreditCard, MapPin, Plus } from 'lucide-react';
import './Payment.css';
import AddressModal from '../../components/AddressModal/AddressModal';
import CardModal from '../../components/CardModal/CardModal';

const Payment = () => {
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, name: 'Home', street: '123 Street City', city: 'New York', zipCode: '10001' },
    { id: 2, name: 'Office', street: '456 Office Building', city: 'San Francisco', zipCode: '94105' }
  ]);

  const [savedCards, setSavedCards] = useState([
    { id: 1, cardNumber: '**** **** **** 5678', cardHolder: 'John Doe', expiryDate: '12/24' },
    { id: 2, cardNumber: '**** **** **** 1234', cardHolder: 'Jane Smith', expiryDate: '05/25' }
  ]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const orderSummary = {
    subtotal: 1000.00,
    tax: 80.00,
    total: 1080.00
  };

  const handleAddAddress = (newAddress) => {
    if (editingItem) {
      setSavedAddresses(savedAddresses.map(addr => 
        addr.id === editingItem.id ? { ...newAddress, id: addr.id } : addr
      ));
    } else {
      setSavedAddresses([...savedAddresses, { ...newAddress, id: Date.now() }]);
    }
    setShowAddressModal(false);
    setEditingItem(null);
  };

  const handleAddCard = (newCard) => {
    if (editingItem) {
      setSavedCards(savedCards.map(card => 
        card.id === editingItem.id ? { ...newCard, id: card.id } : card
      ));
    } else {
      setSavedCards([...savedCards, { ...newCard, id: Date.now() }]);
    }
    setShowCardModal(false);
    setEditingItem(null);
  };

  const handleEditAddress = (address) => {
    setEditingItem(address);
    setShowAddressModal(true);
  };

  const handleEditCard = (card) => {
    setEditingItem(card);
    setShowCardModal(true);
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter(address => address.id !== id));
    if (selectedAddress?.id === id) setSelectedAddress(null);
  };

  const handleDeleteCard = (id) => {
    setSavedCards(savedCards.filter(card => card.id !== id));
    if (selectedCard?.id === id) setSelectedCard(null);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(selectedAddress?.id === address.id ? null : address);
  };

  const handleSelectCard = (card) => {
    setSelectedCard(selectedCard?.id === card.id ? null : card);
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Payment Information</h1>
      
      <div className="payment-layout">
        <div className="payment-left-panel">
          <div className="payment-section">
            <div className="section-header">
              <h2>Saved Addresses</h2>
            </div>
            
            <div className="saved-items">
              {savedAddresses.map(address => (
                <div 
                  key={address.id} 
                  className={`saved-item address-item ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="item-icon">
                    <MapPin />
                  </div>
                  <div className="item-details">
                    <h3>{address.name}</h3>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.zipCode}</p>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="action-button edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="add-button bottom-button"
              onClick={() => {
                setEditingItem(null);
                setShowAddressModal(true);
              }}
            >
              <Plus size={18} />
              <span>Address</span>
            </button>
          </div>

          <div className="payment-section">
            <div className="section-header">
              <h2>Saved Cards</h2>
            </div>
            
            <div className="saved-items">
              {savedCards.map(card => (
                <div 
                  key={card.id} 
                  className={`saved-item card-item ${selectedCard?.id === card.id ? 'selected' : ''}`}
                  onClick={() => handleSelectCard(card)}
                >
                  <div className="item-icon">
                    <CreditCard />
                  </div>
                  <div className="item-details">
                    <h3>{card.cardHolder}</h3>
                    <p>{card.cardNumber}</p>
                    <p>Expires: {card.expiryDate}</p>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="action-button edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCard(card);
                      }}
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="add-button bottom-button"
              onClick={() => {
                setEditingItem(null);
                setShowCardModal(true);
              }}
            >
              <Plus size={18} />
              <span>Card</span>
            </button>
          </div>
        </div>

        <div className="payment-right-panel">
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              className="checkout-button"
              disabled={!selectedAddress || !selectedCard}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <AddressModal 
          onClose={() => {
            setShowAddressModal(false);
            setEditingItem(null);
          }}
          onSave={handleAddAddress}
          address={editingItem}
        />
      )}

      {showCardModal && (
        <CardModal 
          onClose={() => {
            setShowCardModal(false);
            setEditingItem(null);
          }}
          onSave={handleAddCard}
          card={editingItem}
        />
      )}
    </div>
  );
};

export default Payment;