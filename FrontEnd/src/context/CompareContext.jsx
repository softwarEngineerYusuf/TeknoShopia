import { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd"; // Kullanıcıya geri bildirim için Ant Design mesaj bileşeni

// 1. Context'i oluştur
const CompareContext = createContext();

// 2. Provider Bileşenini oluştur
// eslint-disable-next-line react/prop-types
export function CompareProvider({ children }) {
  // State'i localStorage'dan başlatarak sayfa yenilemelerinde veriyi koru
  const [compareList, setCompareList] = useState(() => {
    try {
      const localData = localStorage.getItem("compareList");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Failed to parse compare list from localStorage", error);
      return [];
    }
  });

  // compareList her değiştiğinde localStorage'ı güncelle
  useEffect(() => {
    localStorage.setItem("compareList", JSON.stringify(compareList));
  }, [compareList]);

  // Listeye ürün ekleme fonksiyonu
  const addToCompare = (product) => {
    // Ürün zaten listede var mı diye kontrol et
    if (compareList.find((p) => p.id === product.id)) {
      message.warning("Bu ürün zaten karşılaştırma listesinde.");
      return;
    }
    // Liste 2 üründen fazla içeremez
    if (compareList.length >= 2) {
      message.error(
        "Karşılaştırma listesine en fazla 2 ürün ekleyebilirsiniz."
      );
      return;
    }
    setCompareList((prevList) => [...prevList, product]);
    message.success(`${product.name} karşılaştırma listesine eklendi!`);
  };

  // Listeden ürün çıkarma fonksiyonu
  const removeFromCompare = (productId) => {
    setCompareList((prevList) =>
      prevList.filter((product) => product.id !== productId)
    );
  };

  // Listeyi tamamen temizleme fonksiyonu
  const clearCompareList = () => {
    setCompareList([]);
    message.info("Karşılaştırma listesi temizlendi.");
  };

  // Context'in diğer bileşenlere sağlayacağı değerler
  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompareList,
  };

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

// 3. Context'i kullanmayı kolaylaştıran özel bir hook
export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
