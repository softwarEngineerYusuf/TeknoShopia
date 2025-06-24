const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Veritabanı Modellerini import et
const Product = require("../models/product.js");
const Category = require("../models/category.js");
const Brand = require("../models/brand.js");

// === HATA DÜZELTMESİ: genAI burada, tüm fonksiyonların erişebileceği şekilde tanımlanmalı ===
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// ======================================================================================

// Bot için başlangıç talimatlarını ve genel site bilgilerini hazırlar
async function initializeChat() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const categories = await Category.find({}, "name").limit(10);
  const brands = await Brand.find({}, "name").limit(10);
  const categoryNames = categories.map((c) => c.name).join(", ");
  const brandNames = brands.map((b) => b.name).join(", ");

  const siteInfo = `
    - Sitenin adı: TeknoShopia
    - Ana Kategoriler: ${categoryNames}.
    - Popüler Markalar: ${brandNames}.
    - Kargo Politikası: 1500 TL ve üzeri tüm alışverişlerde kargo ücretsizdir. Altındaki siparişler için kargo ücreti 49.90 TL'dir.
    - İade Süresi: Ürün tesliminden itibaren 14 gün içinde koşulsuz iade hakkı vardır.
    - Garanti: Tüm elektronik ürünler en az 2 yıl distribütör garantilidir.
  `;

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: `Sen TeknoShopia e-ticaret sitesinin yardımcı asistanısın. Adın 'TeknoAsistan'. Kullanıcılara ürünler, kategoriler ve markalar hakkında bilgi vereceksin. Cevapların kısa, net ve samimi olsun. Sana bir soru geldiğinde, önce sana vereceğim "GÜNCEL VERİLER" kısmını oku. Cevabını bu verilere göre oluştur. Eğer veri yoksa, "Bu konuda bilgim yok ama siteyi inceleyebilirsiniz." de. İşte site hakkında bilmen gereken temel bilgiler:\n${siteInfo}`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Anladım! Ben TeknoShopia'nın yardımcısı TeknoAsistan. Ürünler, markalar, kategoriler veya merak ettiğiniz herhangi bir konuda size yardımcı olmak için buradayım.",
          },
        ],
      },
    ],
    generationConfig: { maxOutputTokens: 500 },
  });
  return chat;
}

let chatSession;

// ANA CHAT ENDPOINT'İ
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    let finalPrompt = message;
    let context = ""; // AI için oluşturacağımız "kopya kağıdı"

    if (!message) return res.status(400).json({ error: "Mesaj boş olamaz." });
    if (!chatSession) chatSession = await initializeChat();

    // === NİYET TESPİT SİSTEMİ ===
    const lowerCaseMessage = message.toLowerCase();

    // 1. Niyet: Ürün arama
    const productKeywords = [
      "fiyat",
      "stok",
      "stokta",
      "ürün",
      "ne kadar",
      "var mı",
      "kaç para",
      "özellikleri",
      "laptop",
      "telefon",
      "kulaklık",
      "monitör",
      "iphone",
      "samsung",
    ];
    if (productKeywords.some((keyword) => lowerCaseMessage.includes(keyword))) {
      console.log("Niyet: Ürün Arama. Veritabanı sorgulanıyor...");
      const products = await Product.find(
        { $text: { $search: lowerCaseMessage } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(3)
        .populate("brand", "name")
        .populate("category", "name")
        .populate("reviews", "rating"); // Yorumları da alıyoruz

      if (products.length > 0) {
        context = products
          .map((p) => {
            const displayPrice =
              p.discountedPrice < p.price
                ? `İndirimli Fiyat: ${p.discountedPrice} TL (Normal Fiyatı: ${p.price} TL)`
                : `Fiyat: ${p.price} TL`;
            return `- Ürün: ${p.name}\n  - Marka/Kategori: ${p.brand.name} / ${
              p.category.name
            }\n  - ${displayPrice}\n  - Stok Durumu: ${
              p.stock > 0 ? `${p.stock} adet mevcut` : "Maalesef stokta yok"
            }\n  - Ortalama Puan: ${p.averageRating} (${p.reviewCount} yorum)`;
          })
          .join("\n\n");
      }
    }
    // 2. Niyet: Kategorileri listeleme
    else if (
      lowerCaseMessage.includes("kategori") ||
      lowerCaseMessage.includes("türler") ||
      lowerCaseMessage.includes("çeşitler")
    ) {
      console.log("Niyet: Kategori Listeleme. Veritabanı sorgulanıyor...");
      const categories = await Category.find({}, "name");
      context =
        "Sitemizde bulunan ana kategoriler şunlardır: " +
        categories.map((c) => c.name).join(", ");
    }
    // 3. Niyet: Markaları listeleme
    else if (lowerCaseMessage.includes("marka")) {
      console.log("Niyet: Marka Listeleme. Veritabanı sorgulanıyor...");
      const brands = await Brand.find({}, "name");
      context =
        "Çalıştığımız markalardan bazıları: " +
        brands.map((b) => b.name).join(", ");
    }

    // Final prompt'u oluştur
    if (context) {
      finalPrompt = `Kullanıcı şu soruyu sordu: "${message}". Bu soruya, aşağıdaki güncel veritabanı bilgilerini kullanarak doğal bir dille cevap ver.\n\n### GÜNCEL VERİLER ###\n${context}`;
    }

    console.log("AI'a gönderilen final prompt:", finalPrompt);
    const result = await chatSession.sendMessage(finalPrompt);
    const text = result.response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Chatbot hatası:", error);
    chatSession = null;
    res.status(500).json({ error: "Asistan ile iletişim kurulamadı." });
  }
});

module.exports = router;
