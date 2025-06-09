import { useState, useEffect } from "react";
import { Pencil, Trash2, MapPin, Plus, CreditCard } from "lucide-react";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { useAuth } from "../../context/AuthContext";
import {
  getAddressesByUserId,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../allAPIs/address";

// BİLEŞENLER & STİL
// Bu yolların kendi projenizdeki dosya yapısıyla doğru olduğundan emin olun.
import "./Payment.css";
import AddressModal from "../../components/AddressModal/AddressModal";
import CardModal from "../../components/CardModal/CardModal";

const Payment = () => {
  // --- CONTEXT & STATE YÖNETİMİ ---
  const { user } = useAuth();

  // Dinamik Adres State'leri
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  // Statik Kart State'leri
  const [savedCards, setSavedCards] = useState([
    {
      id: 1,
      cardNumber: "**** **** **** 5678",
      cardHolder: "John Doe",
      expiryDate: "12/24",
    },
    {
      id: 2,
      cardNumber: "**** **** **** 1234",
      cardHolder: "Jane Smith",
      expiryDate: "05/25",
    },
  ]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // Statik kart düzenlemesi için
  const [selectedCard, setSelectedCard] = useState(null);

  // --- VERİ ÇEKME (useEffect) ---
  useEffect(() => {
    if (user && user.id) {
      const fetchAddresses = async () => {
        setLoadingAddresses(true);
        setAddressError(null);
        try {
          const addressesFromApi = await getAddressesByUserId(user.id);
          setSavedAddresses(addressesFromApi);
        } catch (apiError) {
          setAddressError("Adresler yüklenirken bir sorun oluştu.");
          console.error("Adresleri getirme hatası:", apiError);
        } finally {
          setLoadingAddresses(false);
        }
      };
      fetchAddresses();
    } else {
      setLoadingAddresses(false);
      setSavedAddresses([]);
    }
  }, [user]);

  // --- ADRES İŞLEM FONKSİYONLARI (DİNAMİK) ---

  const handleOpenAddAddressModal = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleOpenEditAddressModal = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (dataFromModal) => {
    const payload = {
      country: dataFromModal.country,
      district: dataFromModal.name,
      city: dataFromModal.city,
      street: dataFromModal.street,
      postalCode: dataFromModal.zipCode,
    };
    try {
      if (editingAddress) {
        // Güncelleme
        const result = await updateAddress(editingAddress._id, payload);
        setSavedAddresses((prev) =>
          prev.map((addr) =>
            addr._id === editingAddress._id ? result.address : addr
          )
        );
      } else {
        // Ekleme
        const result = await addAddress(user.id, payload);
        setSavedAddresses((prev) => [...prev, result.address]);
      }
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (apiError) {
      alert(apiError.message || "Bir hata oluştu.");
    }
  };

  const handleDeleteAddress = (addressId) => {
    setAddressToDelete(addressId); // Hangi adresin silineceğini state'e kaydet
    setShowConfirmModal(true); // Onay modalını göster
  };

  // YENİ: Kullanıcı silmeyi onayladığında bu fonksiyon çalışır
  const handleConfirmDelete = async () => {
    if (!addressToDelete) return; // Güvenlik kontrolü

    try {
      await deleteAddress(addressToDelete);
      setSavedAddresses((prev) =>
        prev.filter((addr) => addr._id !== addressToDelete)
      );
      if (selectedAddress?._id === addressToDelete) {
        setSelectedAddress(null);
      }
    } catch (apiError) {
      alert(apiError.message || "Adres silinirken bir hata oluştu.");
    } finally {
      // İşlem başarılı da olsa, başarısız da olsa modalı kapat ve state'i sıfırla
      setShowConfirmModal(false);
      setAddressToDelete(null);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(selectedAddress?._id === address._id ? null : address);
  };

  // --- KART İŞLEM FONKSİYONLARI (STATİK) ---

  const handleOpenAddCardModal = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };

  const handleOpenEditCardModal = (card) => {
    setEditingCard(card);
    setShowCardModal(true);
  };

  const handleSaveCard = (newCardData) => {
    if (editingCard) {
      setSavedCards(
        savedCards.map((card) =>
          card.id === editingCard.id ? { ...newCardData, id: card.id } : card
        )
      );
    } else {
      setSavedCards([...savedCards, { ...newCardData, id: Date.now() }]);
    }
    setShowCardModal(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId) => {
    setSavedCards(savedCards.filter((card) => card.id !== cardId));
    if (selectedCard?.id === cardId) {
      setSelectedCard(null);
    }
  };

  const handleSelectCard = (card) => {
    setSelectedCard(selectedCard?.id === card.id ? null : card);
  };

  // --- SİPARİŞ ÖZETİ (STATİK) ---
  const orderSummary = {
    subtotal: 1000.0,
    tax: 80.0,
    total: 1080.0,
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Payment Information</h1>

      <div className="payment-layout">
        <div className="payment-left-panel">
          {/* === Kayıtlı Adresler Bölümü (Dinamik) === */}
          <div className="payment-section">
            <div className="section-header">
              <h2>Saved Addresses</h2>
            </div>
            {loadingAddresses ? (
              <p>Adresler yükleniyor...</p>
            ) : addressError ? (
              <p className="error-message">{addressError}</p>
            ) : savedAddresses.length === 0 ? (
              <p>Kayıtlı adresiniz bulunmuyor.</p>
            ) : (
              <div className="saved-items">
                {savedAddresses.map((address) => (
                  <div
                    key={address._id}
                    className={`saved-item address-item ${
                      selectedAddress?._id === address._id ? "selected" : ""
                    }`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    <div className="item-icon">
                      <MapPin />
                    </div>
                    <div className="item-details">
                      <h3>{address.district}</h3>
                      <p>{address.street}</p>
                      <p>
                        {address.postalCode}, {address.city}/{address.country}
                      </p>
                    </div>
                    <div className="item-actions">
                      <button
                        className="action-button edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditAddressModal(address);
                        }}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="action-button delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address._id);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              className="add-button bottom-button"
              onClick={handleOpenAddAddressModal}
            >
              <Plus size={18} />
              <span>Address</span>
            </button>
          </div>

          {/* === Kayıtlı Kartlar Bölümü (Statik) === */}
          <div className="payment-section">
            <div className="section-header">
              <h2>Saved Cards</h2>
            </div>
            <div className="saved-items">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`saved-item card-item ${
                    selectedCard?.id === card.id ? "selected" : ""
                  }`}
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
                        handleOpenEditCardModal(card);
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
              onClick={handleOpenAddCardModal}
            >
              <Plus size={18} />
              <span>Card</span>
            </button>
          </div>
        </div>

        {/* === Sipariş Özeti Bölümü (Statik) === */}
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

      {/* === Modallar === */}
      {showAddressModal && (
        <AddressModal
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
          address={
            editingAddress
              ? {
                  country: editingAddress.country,
                  name: editingAddress.district,
                  city: editingAddress.city,
                  street: editingAddress.street,
                  zipCode: editingAddress.postalCode,
                }
              : null
          }
        />
      )}

      {showCardModal && (
        <CardModal
          onClose={() => {
            setShowCardModal(false);
            setEditingCard(null);
          }}
          onSave={handleSaveCard}
          card={editingCard}
        />
      )}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          title="Adresi Silmeyi Onayla"
          message="Bu adresi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
          confirmButtonText="Sil"
          onClose={() => {
            setShowConfirmModal(false);
            setAddressToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Payment;
