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

export const addBrand = async (brandData: FormData) => {
  const response = await api.post("/brand/addBrand", brandData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBrand = async (id: string, brandData: FormData) => {
  const response = await api.put(`/brand/updateBrand/${id}`, brandData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
