import axios from "axios";
import { Category } from "../types/ParentCategory";
import { SubCategory } from "../types/ParentCategory";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const addCategory = async (name: string, parentCategory?: string) => {
  try {
    const response = await api.post("/category/addCategory", {
      name,
      parentCategory: parentCategory || null,
    });

    return response.data;
  } catch (error) {
    console.error("Kategori eklenirken hata oluştu:", error);
    throw error;
  }
};

export const getAllCategories = async () => {
  const response = await api.get("/category/getAllSubCategories");
  return response.data;
};
export const getAllMainCategories = async (): Promise<{
  categories: Category[];
}> => {
  try {
    const response = await api.get("/category/getAllMainCategories"); // API endpoint'i
    return response.data; // { categories: Category[] } şeklinde dönecek
  } catch (error) {
    console.error("Kategoriler alınırken hata oluştu:", error);
    throw error; // Hata durumunda hatayı fırlat
  }
};

export const getAllSubCategories = async (): Promise<SubCategory[]> => {
  try {
    const response = await api.get("/category/getAllSubCategories");
    return response.data; // Doğrudan dizi döndürüyor
  } catch (error) {
    console.error("Alt kategoriler alınırken hata oluştu:", error);
    throw error;
  }
};
