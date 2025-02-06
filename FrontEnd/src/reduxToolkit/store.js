import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// Persist yapılandırması
const persistConfig = {
  key: "root", // localStorage'ta kullanılacak anahtar
  storage, // localStorage'ı kullan
};

// Persist reducer oluştur
const persistedReducer = persistReducer(persistConfig, userReducer);

// Store'u oluştur
const store = configureStore({
  reducer: {
    user: persistedReducer, // Persist edilmiş reducer'ı kullan
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Serileştirme kontrolünü devre dışı bırak
    }),
});

// Persist store oluştur
export const persistor = persistStore(store);

export default store;
