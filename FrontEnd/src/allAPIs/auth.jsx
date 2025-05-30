import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Cookie'yi otomatik olarak gönder ve al
});

export const loginApi = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data; // Kullanıcı verisini dön
  } catch (error) {
    console.error("Giriş başarısız:", error.response?.data || error.message);
    throw error;
  }
};

export const registerApi = async (name, email, password, confirmPassword) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Kayıt başarısız:", error.response?.data || error.message);
    throw error;
  }
};
