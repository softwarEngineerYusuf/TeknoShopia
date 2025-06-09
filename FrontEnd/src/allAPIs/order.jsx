import axios from "axios";

const API_URL = "http://localhost:5000/api/order"; // Ana yol değişmez

// Yeni sipariş oluşturmak için kullanılır
export const createOrder = async (orderPayload) => {
  try {
    // POST isteği yeni yola atılır: POST /api/orders/CreateOrder
    const response = await axios.post(`${API_URL}/CreateOrder`, orderPayload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Sipariş oluşturulamadı.");
  }
};

// Bir kullanıcının tüm siparişlerini getirmek için kullanılır
export const getMyOrders = async (userId) => {
  try {
    // GET isteği yeni yola atılır: GET /api/orders/GetOrdersByUserId/:userId
    const response = await axios.get(`${API_URL}/GetOrdersByUserId/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Siparişler alınamadı.");
  }
};
