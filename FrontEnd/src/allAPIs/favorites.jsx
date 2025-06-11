import axios from "axios";

const API_URL = "http://localhost:5000/api/favorites";

export const addProductToFavorites = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/addProduct`, {
      userId,
      productId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Ürün favorilere eklenirken hata oluştu:",
      error.response?.data?.message || error.message
    );
    // Hata durumunda, hatayı çağıran componente iletmek için tekrar fırlatıyoruz.
    // Bu, componentin (örn: bir toast notification göstermek gibi) kendi hata yönetimini yapmasını sağlar.
    throw error;
  }
};

export const removeProductFromFavorites = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/removeProduct`, {
      userId,
      productId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Ürün favorilerden kaldırılırken hata oluştu:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const getFavoriteProducts = async (userId) => {
  if (!userId) return []; // userId yoksa boş dizi döndür

  try {
    const response = await axios.get(
      `${API_URL}/getProductsByUserId/${userId}`
    );
    return response.data; // API'niz doğrudan ürün dizisini döndürüyor
  } catch (error) {
    console.error(
      "Favori ürünler çekilirken hata oluştu:",
      error.response?.data?.message || error.message
    );
    return []; // Hata durumunda boş bir dizi döndürerek uygulamanın çökmesini engelle
  }
};

export const getFavoriteProductIds = async (userId) => {
  if (!userId) return []; // userId yoksa boş dizi döndür

  try {
    const response = await axios.get(
      `${API_URL}/getFavoriteProductIds/${userId}`
    );
    return response.data; // API'niz doğrudan ID dizisini döndürüyor
  } catch (error) {
    console.error(
      "Favori ürün ID'leri çekilirken hata oluştu:",
      error.response?.data?.message || error.message
    );
    return [];
  }
};
