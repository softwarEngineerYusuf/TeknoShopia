import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllCategories = async () => {
  const response = await api.get("/category/getAllSubCategories");
  return response.data;
};
