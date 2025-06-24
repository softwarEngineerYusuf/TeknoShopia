import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // API istekleri için proxy ayarları buraya gelecek
  server: {
    proxy: {
      // '/api' ile başlayan tüm istekleri yakala
      "/api": {
        // Bu istekleri localhost:5000'e yönlendir
        target: "http://localhost:5000",
        // Origin header'ını değiştirmemize izin ver (güvenlik için gerekli)
        changeOrigin: true,
        // SSL sertifika hatalarını yok say (sadece lokal geliştirme için)
        secure: false,
      },
    },
  },
});
