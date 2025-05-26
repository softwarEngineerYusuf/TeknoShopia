// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { loginApi } from "../allAPIs/auth";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Uygulama başladığında kullanıcı kontrol et
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Burada token kontrolü yapabilirsiniz
        // Örneğin, token varsa ve geçerliyse kullanıcı bilgilerini al
        setLoading(false);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await loginApi(email, password);
      if (data && data.user) {
        setUser(data.user);
        return data.user;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Cookie'yi temizleme işlemi için backend'de bir endpoint oluşturmalısınız
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
