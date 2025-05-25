import React, { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import './CardModal.css';

const CardModal = ({ onClose, onSave, card }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const [formattedCardNumber, setFormattedCardNumber] = useState('');

  useEffect(() => {
    if (card) {
      setFormData({
        cardNumber: card.cardNumber.replace(/[*\s]/g, '') || '',
        cardHolder: card.cardHolder || '',
        expiryDate: card.expiryDate || '',
        cvv: card.cvv || ''
      });
    }
  }, [card]);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const truncated = digits.slice(0, 16);
    const formatted = truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    const formatted = formatCardNumber(value);
    setFormattedCardNumber(formatted);
    
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted.replace(/\s/g, '')
    }));
  };

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value;
    const formatted = formatExpiryDate(value);
    
    setFormData(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const maskedCardNumber = `**** **** **** ${formData.cardNumber.slice(-4)}`;
    onSave({
      ...formData,
      cardNumber: maskedCardNumber
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{card ? 'Edit Payment Method' : 'Add New Payment Method'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <div className="input-icon-wrapper">
                <CreditCard className="input-icon" size={18} />
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formattedCardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="cardHolder">Cardholder Name</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                placeholder="Full name as shown on card"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiration Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save and Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardModal;