import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllMainCategories = async () => {
  try {
    const response = await api.get("/category/getAllMainCategories");
    return response.data.categories;
  } catch (error) {
    console.error("Ana kategoriler alınırken hata oluştu:", error);
    return [];
  }
};

export const getSubCategoriesByMainCategoryId = async (mainCategoryId) => {
  try {
    const response = await api.get(
      `/category/getAllSubCategoriesByMainCategoryId/${mainCategoryId}`
    );

    console.log(
      `"${mainCategoryId}" ID'li ana kategori için gelen alt kategoriler:`,
      response.data.subCategories
    );

    return response.data.subCategories; // Sadece alt kategorileri dön
  } catch (error) {
    console.error("Alt kategoriler alınırken hata oluştu:", error);
    return [];
  }
};
