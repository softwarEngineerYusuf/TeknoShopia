import React from "react";
import "./ConfirmationModal.css"; // Stil dosyasını birazdan oluşturacağız

const ConfirmationModal = ({
  // eslint-disable-next-line react/prop-types
  isOpen,
  // eslint-disable-next-line react/prop-types
  onClose,
  // eslint-disable-next-line react/prop-types
  onConfirm,
  // eslint-disable-next-line react/prop-types
  title,
  // eslint-disable-next-line react/prop-types
  message,
  // eslint-disable-next-line react/prop-types
  confirmButtonText = "Onayla",
  // eslint-disable-next-line react/prop-types
  cancelButtonText = "İptal",
}) => {
  if (!isOpen) {
    return null;
  }

  // Overlay'e tıklandığında modalın kapanmasını sağlar,
  // ancak modal içeriğine tıklandığında kapanmasını engeller.
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal-content">
        <div className="confirmation-modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="confirmation-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-modal-footer">
          <button className="modal-button cancel" onClick={onClose}>
            {cancelButtonText}
          </button>
          <button className="modal-button confirm-delete" onClick={onConfirm}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
