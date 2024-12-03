import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllProducts = async () => {
  const response = await api.get("/product/getAllProducts");
  return response.data;
};

export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/product/getProductById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addProduct = async (productData: any) => {
  try {
    const response = await api.post(
      "/product/addProductToSubCategory",
      productData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/product/deleteProduct/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
export const updateProduct = async (id: string, updatedData: any) => {
  try {
    const response = await api.put(`/product/updateProduct/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
