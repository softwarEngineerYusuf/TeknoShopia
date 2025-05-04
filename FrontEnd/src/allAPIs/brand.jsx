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
