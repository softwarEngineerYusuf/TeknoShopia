import axios from "axios";

const API_URL = "http://localhost:5000/api/brand";

export const getAllBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllBrands`);
    return response.data;
  } catch (error) {
    console.error("Markalar çekilirken hata oluştu:", error);
    return [];
  }
};

export const getBrandById = async (brandId) => {
  try {
    // DÜZELTME: URL'ye "/getBrandById" eklendi
    const response = await axios.get(`${API_URL}/getBrandById/${brandId}`);
    return response.data;
  } catch (error) {
    // Hata mesajı zaten bu fonksiyonda loglanıyor, bu yüzden component'te tekrar loglamaya gerek yok.
    console.error(`Marka ${brandId} çekilirken hata oluştu:`, error);
    // Hata durumunda null döndürmek, component'te kontrol yapmayı kolaylaştırır.
    return null;
  }
};
