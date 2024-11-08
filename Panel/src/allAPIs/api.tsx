import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllBrands = async () => {
  const response = await api.get("/brand/getAllBrands");
  return response.data;
};

export const deleteBrand = async (id: string) => {
  await api.delete(`/brand/deleteBrand/${id}`);
};

export const addBrand = async (brandData: { name: string }) => {
  const response = await api.post("/brand/addBrand", brandData);
  return response.data;
};
