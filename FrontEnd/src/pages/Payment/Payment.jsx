import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate eklendi
import { Pencil, Trash2, MapPin, Plus, CreditCard } from "lucide-react";
import { Spin, Modal } from "antd";

// CONTEXT & API'LER
import { useAuth } from "../../context/AuthContext";
import {
  getAddressesByUserId,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../allAPIs/address";
import {
  getCardsByUserId,
  addCard,
  updateCard,
  deleteCard,
} from "../../allAPIs/card";
import { getCartByUserId } from "../../allAPIs/cart";
import { createOrder } from "../../allAPIs/order";
// YENİ: Sipariş oluşturma API'sini import ettiğinizi varsayıyorum
// import { createOrder } from "../../allAPIs/order";

// BİLEŞENLER & STİL
import "./Payment.css";
import AddressModal from "../../components/AddressModal/AddressModal";
import CardModal from "../../components/CardModal/CardModal";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const Payment = () => {
  // --- HOOKS & CONTEXT ---
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // YENİ: Sipariş sonrası yönlendirme için

  // --- TÜM STATE'LER ---
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressConfirmModal, setShowAddressConfirmModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const [savedCards, setSavedCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [cardError, setCardError] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardConfirmModal, setShowCardConfirmModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  const [orderSummary, setOrderSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // YENİ: Ödeme butonu için yükleme durumu

  // --- VERİ ÇEKME (useEffect) ---
  useEffect(() => {
    if (user && user.id) {
      const fetchInitialData = async () => {
        setLoadingAddresses(true);
        setLoadingCards(true);
        setLoadingSummary(true);

        // Sepet verisini al
        let cartData = location.state?.cartData;
        if (!cartData) {
          try {
            cartData = await getCartByUserId(user.id);
          } catch (error) {
            console.error("Sepet bilgisi alınamadı:", error);
          }
        }

        // Eğer sepet boşsa veya alınamadıysa, kullanıcıyı sepete geri yönlendir
        if (!cartData || cartData.cartItems.length === 0) {
          navigate("/basket");
          return;
        }

        setOrderSummary(cartData);
        setLoadingSummary(false);

        // Adres ve kartları paralel olarak çek
        try {
          const [addresses, cards] = await Promise.all([
            getAddressesByUserId(user.id),
            getCardsByUserId(user.id),
          ]);
          setSavedAddresses(addresses);
          setSavedCards(cards);
        } catch (error) {
          console.error("Adres veya kartlar yüklenirken hata:", error);
          setAddressError("Adresler yüklenemedi.");
          setCardError("Kartlar yüklenemedi.");
        } finally {
          setLoadingAddresses(false);
          setLoadingCards(false);
        }
      };

      fetchInitialData();
    }
  }, [user, location.state, navigate]);

  // --- TÜM FONKSİYONLAR ---

  // ADRES FONKSİYONLARI (EKSİKSİZ)
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
        const result = await updateAddress(editingAddress._id, payload);
        setSavedAddresses((prev) =>
          prev.map((addr) =>
            addr._id === editingAddress._id ? result.address : addr
          )
        );
      } else {
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
    setAddressToDelete(addressId);
    setShowAddressConfirmModal(true);
  };
  const handleConfirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await deleteAddress(addressToDelete);
      setSavedAddresses((prev) =>
        prev.filter((addr) => addr._id !== addressToDelete)
      );
      if (selectedAddress?._id === addressToDelete) setSelectedAddress(null);
    } catch (apiError) {
      alert(apiError.message || "Adres silinirken bir hata oluştu.");
    } finally {
      setShowAddressConfirmModal(false);
      setAddressToDelete(null);
    }
  };
  const handleSelectAddress = (address) =>
    setSelectedAddress(selectedAddress?._id === address._id ? null : address);

  // KART FONKSİYONLARI (EKSİKSİZ)
  const handleOpenAddCardModal = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };
  const handleOpenEditCardModal = (card) => {
    setEditingCard(card);
    setShowCardModal(true);
  };
  const handleSaveCard = async (dataFromModal) => {
    try {
      if (editingCard) {
        const payload = {
          cardHolder: dataFromModal.cardHolder,
          expiryDate: dataFromModal.expiryDate,
        };
        const result = await updateCard(editingCard._id, payload);
        setSavedCards((prev) =>
          prev.map((c) => (c._id === editingCard._id ? result.card : c))
        );
      } else {
        const result = await addCard(user.id, dataFromModal);
        setSavedCards((prev) => [...prev, result.card]);
      }
      setShowCardModal(false);
      setEditingCard(null);
    } catch (apiError) {
      alert(apiError.message || "Kart işlemi sırasında bir hata oluştu.");
    }
  };
  const handleDeleteCard = (cardId) => {
    setCardToDelete(cardId);
    setShowCardConfirmModal(true);
  };
  const handleConfirmDeleteCard = async () => {
    if (!cardToDelete) return;
    try {
      await deleteCard(cardToDelete);
      setSavedCards((prev) => prev.filter((c) => c._id !== cardToDelete));
      if (selectedCard?._id === cardToDelete) setSelectedCard(null);
    } catch (apiError) {
      alert(apiError.message || "Kart silinirken bir hata oluştu.");
    } finally {
      setShowCardConfirmModal(false);
      setCardToDelete(null);
    }
  };
  const handleSelectCard = (card) =>
    setSelectedCard(selectedCard?._id === card._id ? null : card);

  // ÖDEME VE HESAPLAMA MANTIĞI (DÜZELTİLMİŞ)
  const handleProceedToCheckout = async () => {
    if (!selectedAddress || !selectedCard || !orderSummary) {
      Modal.warning({
        title: "Eksik Bilgi",
        content: "Lütfen teslimat adresi ve ödeme yöntemi seçin.",
      });
      return;
    }
    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        userId: user.id,
        addressId: selectedAddress._id,
        cartId: user.cart,
        orderItems: orderSummary.cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.subtotal / item.quantity,
        })),
        totalPrice: finalTotal,
      };
      const response = await createOrder(orderPayload);
      Modal.success({
        title: "Siparişiniz Başarıyla Alındı!",
        content: `Sipariş numaranız: ${response.order._id}. Detaylar e-posta adresinize gönderildi.`,
        onOk() {
          navigate("/myorders");
        }, // Kullanıcıyı Siparişlerim sayfasına yönlendir
      });
    } catch (error) {
      Modal.error({ title: "Sipariş Oluşturulamadı", content: error.message });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // HESAPLAMA BÖLÜMÜ (DÜZELTİLMİŞ)
  // Sepetten gelen totalPrice, vergisi dahil nihai fiyattır.
  const finalTotal = orderSummary?.totalPrice || 0;

  // Ara toplam, ürünlerin indirimsiz orijinal fiyatları toplamıdır.
  // Bu, vergili mi vergisiz mi olduğu ürün fiyatlandırmanıza bağlıdır.
  // Basket.js'dekiyle aynı mantığı kullanıyoruz.
  const originalSubtotal =
    orderSummary?.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  // İndirim miktarı
  const discountAmount = originalSubtotal - finalTotal;

  return (
    <div className="payment-container">
      <h1 className="payment-title">Payment Information</h1>
      <div className="payment-layout">
        <div className="payment-left-panel">
          <div className="payment-section">
            <div className="section-header">
              <h2>Saved Addresses</h2>
            </div>
            {loadingAddresses ? (
              <div className="loading-placeholder">
                <Spin />
                <p>Adresler yükleniyor...</p>
              </div>
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
          <div className="payment-section">
            <div className="section-header">
              <h2>Saved Cards</h2>
            </div>
            {loadingCards ? (
              <div className="loading-placeholder">
                <Spin />
                <p>Kartlar yükleniyor...</p>
              </div>
            ) : cardError ? (
              <p className="error-message">{cardError}</p>
            ) : savedCards.length === 0 ? (
              <p>Kayıtlı kartınız bulunmuyor.</p>
            ) : (
              <div className="saved-items">
                {savedCards.map((card) => (
                  <div
                    key={card._id}
                    className={`saved-item card-item ${
                      selectedCard?._id === card._id ? "selected" : ""
                    }`}
                    onClick={() => handleSelectCard(card)}
                  >
                    <div className="item-icon">
                      <CreditCard />
                    </div>
                    <div className="item-details">
                      <h3>{card.cardHolder}</h3>
                      <p>**** **** **** {card.last4}</p>
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
                          handleDeleteCard(card._id);
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
              onClick={handleOpenAddCardModal}
            >
              <Plus size={18} />
              <span>Card</span>
            </button>
          </div>
        </div>
        <div className="payment-right-panel">
          <div className="order-summary">
            <h2>Order Summary</h2>
            {loadingSummary ? (
              <div
                className="loading-placeholder"
                style={{ padding: "40px 0" }}
              >
                <Spin size="large" />
                <p style={{ marginTop: "10px" }}>Özet Yükleniyor...</p>
              </div>
            ) : !orderSummary ? (
              <p style={{ textAlign: "center", padding: "20px" }}>
                Sipariş özeti bulunamadı.
              </p>
            ) : (
              <>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>
                      {originalSubtotal.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      TL
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount</span>
                      <span>
                        -
                        {discountAmount.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        TL
                      </span>
                    </div>
                  )}
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <strong>
                      {finalTotal.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      TL
                    </strong>
                  </div>
                </div>
                <button
                  className="checkout-button"
                  onClick={handleProceedToCheckout}
                  disabled={!selectedAddress || !selectedCard || isPlacingOrder}
                >
                  {isPlacingOrder ? <Spin size="small" /> : "Confirm and Pay"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
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
      {showAddressConfirmModal && (
        <ConfirmationModal
          isOpen={showAddressConfirmModal}
          title="Adresi Silmeyi Onayla"
          message="Bu adresi kalıcı olarak silmek istediğinizden emin misiniz?"
          confirmButtonText="Sil"
          onClose={() => {
            setShowAddressConfirmModal(false);
            setAddressToDelete(null);
          }}
          onConfirm={handleConfirmDeleteAddress}
        />
      )}
      {showCardConfirmModal && (
        <ConfirmationModal
          isOpen={showCardConfirmModal}
          title="Kartı Silmeyi Onayla"
          message="Bu kartı kalıcı olarak silmek istediğinizden emin misiniz?"
          confirmButtonText="Sil"
          onClose={() => {
            setShowCardConfirmModal(false);
            setCardToDelete(null);
          }}
          onConfirm={handleConfirmDeleteCard}
        />
      )}
    </div>
  );
};

export default Payment;
