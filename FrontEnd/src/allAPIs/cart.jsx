import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

export const addCart = async (userId, productId, quantity = 1) => {
  if (!userId || !productId) {
    console.error("addCart fonksiyonu için userId ve productId gereklidir.");
    return null;
  }
  try {
    const response = await axios.post(`${API_URL}/addCart`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Sepete ürün eklerken bir hata oluştu:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const getCartByUserId = async (userId) => {
  if (!userId) {
    console.error("getCartByUserId fonksiyonu için userId gereklidir.");
    return {
      message: "Kullanıcı ID'si sağlanmadı.",
      cart: { _id: null, userId: null, cartItems: [], totalPrice: 0 },
    };
  }
  try {
    const response = await axios.get(`${API_URL}/getCartByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Kullanıcının sepeti çekilirken bir hata oluştu:",
      error.response?.data || error.message
    );
    return {
      message: "Sepet bilgileri alınırken hata oluştu.",
      cart: { _id: null, userId: userId, cartItems: [], totalPrice: 0 },
    };
  }
};

export const getCartById = async (cartId) => {
  if (!cartId) {
    console.error("getCartById fonksiyonu için cartId gereklidir.");
    return null;
  }
  try {
    const response = await axios.get(`${API_URL}/getCartById/${cartId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Sepet detayları çekilirken bir hata oluştu:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const clearCart = async (userId) => {
  if (!userId) {
    console.error("clearCart fonksiyonu için userId gereklidir.");
    return null;
  }
  try {
    const response = await axios.delete(`${API_URL}/clearCart/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Sepet temizlenirken bir hata oluştu:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const removeItemFromCart = async (userId, cartItemId) => {
  if (!userId || !cartItemId) {
    console.error(
      "removeItemFromCart fonksiyonu için userId ve cartItemId gereklidir."
    );
    return null;
  }
  try {
    // Axios ile DELETE isteği atarken body'yi ikinci parametrede bir obje içinde 'data' olarak göndeririz.
    const response = await axios.delete(`${API_URL}/item/${cartItemId}`, {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Sepetten ürün silinirken bir hata oluştu:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const updateItemQuantity = async (userId, cartItemId, newQuantity) => {
  if (!userId || !cartItemId || newQuantity === undefined) {
    console.error(
      "updateItemQuantity için userId, cartItemId ve newQuantity gereklidir."
    );
    return null;
  }
  try {
    const response = await axios.put(`${API_URL}/item/update-quantity`, {
      userId,
      cartItemId,
      newQuantity,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Ürün miktarı güncellenirken bir hata oluştu:",
      error.response?.data || error.message
    );
    // Hata mesajını da döndürerek frontend'de göstermek için
    throw error.response?.data || new Error("Bilinmeyen bir sunucu hatası.");
  }
};
