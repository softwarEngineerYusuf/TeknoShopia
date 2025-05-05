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

export const getProductsByBrand = async (
  brandIds = [],
  minPrice = 0,
  maxPrice = 150000
) => {
  try {
    const params = {};

    if (brandIds.length > 0) {
      params.brandIds = brandIds.join(",");
    }

    if (minPrice > 0) {
      params.minPrice = minPrice;
    }

    if (maxPrice < 150000) {
      params.maxPrice = maxPrice;
    }

    const response = await axios.get(`${API_URL}/getProductsByBrand`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Markaya göre ürünler çekilirken hata oluştu:", error);
    return {
      success: false,
      message: "Markaya göre ürünler getirilirken hata oluştu",
      count: 0,
      products: [],
    };
  }
};
