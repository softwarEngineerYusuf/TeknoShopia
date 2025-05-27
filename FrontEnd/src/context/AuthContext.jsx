import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, registerApi } from "../allAPIs/auth";

const AuthContext = createContext();
const LOCAL_STORAGE_KEY = "authUser"; // localStorage için bir anahtar tanımlıyoruz

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Başlangıçta yükleniyor olarak ayarla

  // 1. Uygulama ilk yüklendiğinde localStorage'dan kullanıcıyı yüklemeye çalış
  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "localStorage'dan kullanıcı verisi okunurken hata:",
          error
        );
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Bozuk veriyi temizle
      }
    }
    setLoading(false); // localStorage kontrolü bittikten sonra yüklemeyi tamamla
  }, []); // Bu useEffect sadece bileşen ilk mount olduğunda çalışır

  // 2. User state'i her değiştiğinde localStorage'ı güncelle
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      // User null ise (logout durumu), localStorage'dan kaldır
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]); // Bu useEffect sadece 'user' state'i değiştiğinde çalışır

  const login = async (email, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await loginApi(email, password);
      if (data && data.user) {
        setUser(data.user); // setUser çağrısı yukarıdaki useEffect'i tetikleyerek localStorage'a yazar
        return data.user;
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await registerApi(name, email, password, confirmPassword);
      if (data && data.user) {
        setUser(data.user); // setUser çağrısı yukarıdaki useEffect'i tetikleyerek localStorage'a yazar
        return data.user;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Backend'de cookie'yi silen bir logout endpoint'i çağırabilirsiniz.
      // Örneğin: await api.post("/auth/logout");
      // Bu, httpOnly cookie'nin sunucu tarafından silinmesini sağlar.
      setUser(null); // setUser(null) çağrısı yukarıdaki useEffect'i tetikleyerek localStorage'dan siler
    } catch (error) {
      console.error("Logout işlemi başarısız:", error);
      // Hata durumunda bile kullanıcıyı frontend'den çıkarmak iyi bir pratik olabilir
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
