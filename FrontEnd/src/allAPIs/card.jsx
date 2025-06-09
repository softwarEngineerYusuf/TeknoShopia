import axios from "axios";

const API_URL = "http://localhost:5000/api/card"; // Backend'de tanımladığınız prefix

export const getCardsByUserId = async (userId) => {
  if (!userId) return [];
  try {
    const response = await axios.get(`${API_URL}/getCardsByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Kullanıcı kartları getirilirken hata:",
      error.response?.data?.message || error.message
    );
    return [];
  }
};

export const addCard = async (userId, cardData) => {
  try {
    // cardData { cardNumber, cardHolder, expiryDate, cvv } içerir
    const response = await axios.post(`${API_URL}/addCard/${userId}`, cardData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Kart eklenirken bir hata oluştu."
    );
  }
};

export const updateCard = async (cardId, cardData) => {
  try {
    // cardData { cardHolder, expiryDate } içerir
    const response = await axios.put(
      `${API_URL}/updateCard/${cardId}`,
      cardData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Kart güncellenirken bir hata oluştu."
    );
  }
};

export const deleteCard = async (cardId) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteCard/${cardId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Kart silinirken bir hata oluştu."
    );
  }
};
