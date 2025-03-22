import axios from "axios";

export const getDiscountedProducts = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/product/getDiscountedProducts"
    );
    return response.data;
  } catch (error) {
    console.error("İndirimli ürünleri çekerken hata oluştu:", error);
    return [];
  }
};
