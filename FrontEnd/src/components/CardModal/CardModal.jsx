import { useState, useEffect } from "react";
import { X, CreditCard } from "lucide-react";
import "./CardModal.css";

// eslint-disable-next-line react/prop-types
const CardModal = ({ onClose, onSave, card }) => {
  const isEditing = Boolean(card);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (isEditing) {
      // Düzenleme modunda, sadece gösterim amaçlı veriler ve güncellenebilir alanlar doldurulur.
      setFormData({
        // eslint-disable-next-line react/prop-types
        cardNumber: `**** **** **** ${card.last4}`,
        // eslint-disable-next-line react/prop-types
        cardHolder: card.cardHolder || "",
        // eslint-disable-next-line react/prop-types
        expiryDate: card.expiryDate || "",
        cvv: "", // CVV düzenlemede istenmez.
      });
    }
  }, [card, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Formatlama ve doğrulama işlemleri burada kalabilir.
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };

    // API'ye göndermeden önce kart numarasını temizle
    if (!isEditing) {
      dataToSave.cardNumber = formData.cardNumber.replace(/\s/g, "");
    }

    onSave(dataToSave);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            {isEditing ? "Edit Payment Method" : "Add New Payment Method"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <div className="input-icon-wrapper">
              <CreditCard className="input-icon" size={18} />
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                disabled={isEditing}
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
                onChange={handleChange}
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
                disabled={isEditing}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardModal;
