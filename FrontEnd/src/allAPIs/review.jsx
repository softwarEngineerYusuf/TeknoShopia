import axios from "axios";
import { message } from "antd";

const API_URL = "http://localhost:5000/api/review"; // review router'ınızın base URL'i

export const addReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_URL}/addReview`, reviewData);
    message.success(
      response.data.message || "Değerlendirmeniz için teşekkür ederiz!"
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Yorum eklenirken bir hata oluştu.";
    message.error(errorMessage);
    console.error("API Error - addReview:", error.response || error);
    throw error;
  }
};
export const getReviewsByProductId = async (productId) => {
  if (!productId) {
    // Eğer productId yoksa boş dizi döndür, gereksiz API çağrısı yapma.
    return [];
  }
  try {
    const response = await axios.get(
      `${API_URL}/getReviewByProductId/${productId}`
    );
    return response.data; // API'niz zaten yorum dizisini döndürüyor.
  } catch (error) {
    console.error("Yorumlar getirilirken hata:", error.response || error);
    message.error("Yorumlar yüklenirken bir sorun oluştu.");
    // Hata durumunda da boş dizi döndürmek, sayfanın çökmesini engeller.
    return [];
  }
};
