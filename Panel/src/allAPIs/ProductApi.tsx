import axios from "axios";

// Axios'un baz URL'sini ayarla
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Gerekirse bu URL'yi düzenle
});

export const getAllProducts = async () => {
  const response = await api.get("/product/getAllProducts");
  return response.data;
};
