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
