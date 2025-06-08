import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, registerApi } from "../allAPIs/auth";
import { addCart } from "../allAPIs/cart";
const AuthContext = createContext();
const LOCAL_STORAGE_KEY = "authUser"; // localStorage için bir anahtar tanımlıyoruz
const PENDING_CART_ITEM_KEY = "pendingCartItemProductId";
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
      // 1. Normal giriş API'sini çağır
      const data = await loginApi(email, password);

      if (data && data.user) {
        // 2. Kullanıcıyı state'e ata
        setUser(data.user);

        // 3. GİRİŞ SONRASI SEPETE EKLEME KONTROLÜ
        const pendingProductId = localStorage.getItem(PENDING_CART_ITEM_KEY);

        if (pendingProductId) {
          try {
            // localStorage'da bekleyen ürün varsa, onu yeni kullanıcının sepetine ekle
            console.log(
              `Bekleyen ürün (${pendingProductId}) ${data.user.name} kullanıcısının sepetine ekleniyor...`
            );
            await addCart(data.user.id, pendingProductId, 1);
          } catch (cartError) {
            // Bu hatanın ana giriş akışını bozmaması önemli.
            // Sadece konsola yazdırabiliriz.
            console.error(
              "Giriş sonrası bekleyen ürün sepete eklenirken hata oluştu:",
              cartError
            );
          } finally {
            // İşlem başarılı da olsa başarısız da olsa, localStorage'dan anahtarı kaldır.
            localStorage.removeItem(PENDING_CART_ITEM_KEY);
          }
        }

        return data.user;
      }
    } catch (error) {
      // Orijinal hata fırlatma mekanizması korunuyor
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

  const logout = () => {
    try {
      setUser(null);

      localStorage.clear();

      console.log("Kullanıcı çıkış yaptı ve tüm local veriler temizlendi.");
    } catch (error) {
      // Hata durumunda bile state'i ve localStorage'ı temizlemeye çalışmak iyi bir fikirdir.
      console.error("Logout işlemi sırasında bir hata oluştu:", error);
      setUser(null);
      localStorage.clear();
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {/*
        loading durumu true iken hiçbir alt bileşeni render ETME.
        Bu, alt bileşenlerin, user verisi yüklenmeden önce çalışmasını engeller.
        Böylece useAuth() her zaman doğru veriyi alır.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
