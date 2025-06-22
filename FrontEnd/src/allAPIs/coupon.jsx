import axios from "axios";

// Backend API'nizin temel URL'si
const API_URL = "http://localhost:5000/api/coupon";

export const applyCoupon = async (code, cartId) => {
  if (!code || !cartId) {
    console.error("applyCoupon fonksiyonu için 'code' ve 'cartId' gereklidir.");
    return null;
  }
  try {
    const response = await axios.post(`${API_URL}/couponApply`, {
      code,
      cartId,
    });
    // Başarılı yanıtı doğrudan döndür
    return response.data;
  } catch (error) {
    // Hata durumunda, backend'den gelen mesajı logla ve null dön.
    // Frontend'de bu hatayı kullanıcıya göstermek için error.response.data.message kullanılabilir.
    console.error(
      "Kupon uygulama hatası:",
      error.response?.data?.message || error.message
    );
    // Hatanın kendisini de fırlatabiliriz ki çağıran component yakalasın.
    throw error;
  }
};

export const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(`${API_URL}/couponCreate`, couponData);
    return response.data;
  } catch (error) {
    console.error(
      "Kupon oluşturma hatası:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const getAllCoupons = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllCoupons`);
    return response.data;
  } catch (error) {
    console.error(
      "Tüm kuponlar çekilirken hata oluştu:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const updateCoupon = async (couponId, updateData) => {
  try {
    const response = await axios.put(
      `${API_URL}/couponUpdate/${couponId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Kupon güncelleme hatası:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const response = await axios.delete(`${API_URL}/couponDelete/${couponId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Kupon silme hatası:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
