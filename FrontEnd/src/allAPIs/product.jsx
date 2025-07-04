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
  maxPrice = 150000,
  categoryId = null // <-- Yeni parametre eklendi
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
    // Yeni parametreyi sorguya ekle
    if (categoryId) {
      params.categoryId = categoryId;
    }

    const response = await axios.get(`${API_URL}/getProductsByBrand`, {
      params,
    });
    return response.data; // Backend doğrudan dizi döndüreceği için response.data yeterli
  } catch (error) {
    console.error("Markaya göre ürünler çekilirken hata oluştu:", error);
    // Hata durumunda boş bir dizi döndürmek daha güvenlidir
    return [];
  }
};

export const getTopPicksProducts = async (brandIds = []) => {
  try {
    let query = "";
    // Eğer gelen dizinin içinde eleman varsa, sorgu parametresini oluştur.
    if (brandIds.length > 0) {
      query = `?brands=${brandIds.join(",")}`;
    }
    // `query` ya "?brands=id1,id2" olacak ya da boş string ""
    const response = await axios.get(`${API_URL}/topPicks${query}`);
    return response.data;
  } catch (error) {
    console.error("Top Picks ürünleri çekerken hata oluştu:", error);
    return [];
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/getProductById/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Ürün detayları alınırken hata oluştu:", error);
    return null;
  }
};

export const getProductsByBrandID = async (brandId) => {
  try {
    const response = await axios.get(
      `${API_URL}/getProductByBrandID/${brandId}`
    );
    // Backend'den gelen { message, count, products } nesnesinden sadece products dizisini döndürüyoruz.
    return response.data.products;
  } catch (error) {
    console.error(`Marka ${brandId} ürünleri çekilirken hata oluştu:`, error);
    return []; // Hata durumunda boş bir dizi döndür
  }
};
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllProducts`);

    return response.data;
  } catch (error) {
    console.error("Tüm ürünleri çekerken hata oluştu:", error);

    return [];
  }
};
