import { createContext, useState, useContext, useEffect } from "react";
import { getCartByUserId } from "../allAPIs/cart";
import { useAuth } from "./AuthContext";

// 1. Context'i oluştur
const CartContext = createContext();

// 2. Bu context'i kullanmak için kolay bir custom hook oluştur
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Context Provider bileşenini oluştur
// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // AuthContext'ten kullanıcıyı alıyoruz

  // Kullanıcı değiştiğinde veya giriş yaptığında sepeti çek
  useEffect(() => {
    const fetchCart = async () => {
      if (user && user.id) {
        setLoading(true);
        try {
          const cartData = await getCartByUserId(user.id);
          setCart(cartData);
        } catch (error) {
          console.error("CartContext: Sepet alınamadı.", error);
          setCart(null);
        } finally {
          setLoading(false);
        }
      } else {
        setCart(null);
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const cartItemCount = cart?.cartItems?.length || 0;

  const value = {
    cart,
    setCart,
    loading,
    cartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
