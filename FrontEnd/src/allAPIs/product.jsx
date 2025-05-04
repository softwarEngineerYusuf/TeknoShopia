import axios from "axios";

const API_URL = "http://localhost:5000/api/product"; // API base URL

export const getDiscountedProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/getDiscountedProducts`);
    return response.data;
  } catch (error) {
    console.error("İndirimli ürünleri çekerken hata oluştu:", error);
    return [];
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${API_URL}/getProductsByCategory/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Kategoriye göre ürünler çekilirken hata oluştu:", error);
    return {
      message: "Ürünler getirilirken hata oluştu",
      category: "",
      count: 0,
      products: [],
    };
  }
};

export const getProductsByBrand = async (brandId, priceRange = null) => {
  try {
    // Fiyat aralığı varsa query parametrelerini hazırla
    const params = {};
    if (priceRange?.min !== undefined) params.minPrice = priceRange.min;
    if (priceRange?.max !== undefined) params.maxPrice = priceRange.max;

    const response = await axios.get(
      `${API_URL}/getProductsByBrand/${brandId}`,
      {
        params,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Marka ürünleri çekilirken hata:", error);
    return {
      success: false,
      products: [],
      count: 0,
    };
  }
};
