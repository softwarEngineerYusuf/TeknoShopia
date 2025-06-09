import axios from "axios";

// Backend sunucunuzun base URL'i
const API_URL = "http://localhost:5000/api/address";

export const getAddressesByUserId = async (userId) => {
  if (!userId) {
    console.error("Adresleri getirmek için kullanıcı ID'si gerekli.");
    return [];
  }
  try {
    const response = await axios.get(
      `${API_URL}/getAddressesByUserId/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Kullanıcı adresleri getirilirken hata:",
      error.response?.data?.message || error.message
    );
    // Hata durumunda boş dizi dönmek, UI'ın çökmesini engeller.
    return [];
  }
};

export const addAddress = async (userId, addressData) => {
  try {
    const response = await axios.post(
      `${API_URL}/addAddress/${userId}`,
      addressData
    );
    return response.data;
  } catch (error) {
    // Hata mesajını fırlatarak bileşenin yakalamasını sağlıyoruz.
    throw new Error(
      error.response?.data?.message || "Adres eklenirken bir hata oluştu."
    );
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await axios.put(
      `${API_URL}/updateAddress/${addressId}`,
      addressData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Adres güncellenirken bir hata oluştu."
    );
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/deleteAddress/${addressId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Adres silinirken bir hata oluştu."
    );
  }
};
