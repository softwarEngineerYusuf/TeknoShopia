const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js");
const CartItem = require("../models/cartItem.js");
const Product = require("../models/product.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");

// Helper Fonksiyon: Sepetin toplam fiyatını doğru şekilde hesaplar.
const calculateCartTotal = async (cartId) => {
  const cart = await Cart.findById(cartId).populate({
    path: "cartItems",
    populate: {
      path: "product",
      select: "price discountedPrice", // Sadece fiyat bilgileri yeterli
    },
  });

  if (!cart) return 0;

  const totalPrice = cart.cartItems.reduce((sum, item) => {
    if (item.product) {
      const currentPrice = item.product.discountedPrice || item.product.price;
      return sum + currentPrice * item.quantity;
    }
    return sum;
  }, 0);

  return totalPrice;
};

router.post("/addCart", async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  console.log(
    `\n--- YENİ SEPETE EKLEME İSTEĞİ: ${new Date().toLocaleTimeString()} ---`
  );
  console.log(
    `Gelen İstek => userId: ${userId}, productId: ${productId}, quantity: ${quantity}`
  );

  // 1. Girdi Kontrolü
  if (!userId || !productId) {
    console.error(
      "HATA: Girdi kontrolü başarısız. userId veya productId eksik."
    );
    return res
      .status(400)
      .json({ message: "Kullanıcı ID ve Ürün ID gereklidir." });
  }

  try {
    // 2. Veritabanından Gerekli Dökümanları Çek
    console.log("Adım 1: Kullanıcı ve Ürün veritabanından aranıyor...");
    const [user, product] = await Promise.all([
      User.findById(userId),
      Product.findById(productId),
    ]);

    if (!user) {
      console.error(`HATA: Kullanıcı bulunamadı. Aranan ID: ${userId}`);
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    console.log(`OK: Kullanıcı bulundu -> ${user.email}`);

    if (!product) {
      console.error(`HATA: Ürün bulunamadı. Aranan ID: ${productId}`);
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }
    // ÜRÜN BİLGİLERİNİ KONSOLA YAZDIRIYORUZ
    console.log("OK: Ürün bulundu. Detaylar aşağıda:");
    console.log("-----------------------------------------");
    console.log(`  Ürün Adı: ${product.name}`);
    console.log(`  Stok: ${product.stock}`);
    console.log(`  Fiyat (Normal): ${product.price}`);
    console.log(`  İndirim Oranı (%): ${product.discount}`);
    console.log(`  İndirimli Fiyat (Hesaplanmış): ${product.discountedPrice}`);
    console.log("-----------------------------------------");

    if (product.stock < quantity) {
      console.error(
        `HATA: Yetersiz stok. Mevcut: ${product.stock}, İstenen: ${quantity}`
      );
      return res.status(400).json({ message: "Yetersiz stok." });
    }

    // 3. SEPETİ BUL VEYA OLUŞTUR
    console.log("Adım 2: Kullanıcının sepeti aranıyor veya oluşturuluyor...");
    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      console.log(
        `BİLGİ: Kullanıcı için mevcut sepet yok. YENİ SEPET OLUŞTURULUYOR.`
      );
      cart = new Cart({ userId: user._id, cartItems: [], totalPrice: 0 });
      await cart.save();
      user.cart = cart._id;
      await user.save();
      console.log(
        `OK: Yeni sepet (${cart._id}) oluşturuldu ve kullanıcıya bağlandı.`
      );
    } else {
      console.log(`OK: Mevcut sepet bulundu. Sepet ID: ${cart._id}`);
    }

    // 4. SEPETTEKİ ÜRÜNÜ (CARTITEM) BUL VEYA OLUŞTUR
    console.log("Adım 3: Ürünün sepette olup olmadığı kontrol ediliyor...");
    let cartItem = await CartItem.findOne({
      cartId: cart._id,
      product: product._id,
    });

    // Fiyat belirleme - Hata ayıklama için konsola yazdırıyoruz.
    const priceToUse = product.discountedPrice ?? product.price;
    console.log(`BİLGİ: Ürün için kullanılacak fiyat: ${priceToUse}`);

    if (cartItem) {
      console.log("BİLGİ: Ürün zaten sepette. Miktar güncelleniyor.");
      cartItem.quantity += quantity;
      cartItem.subtotal = cartItem.quantity * priceToUse;
    } else {
      console.log("BİLGİ: Ürün sepette değil. Yeni CartItem oluşturuluyor.");
      cartItem = new CartItem({
        cartId: cart._id,
        product: product._id,
        quantity: quantity,
        price: priceToUse,
        subtotal: quantity * priceToUse,
      });
      cart.cartItems.push(cartItem._id);
    }

    await cartItem.save();
    console.log(
      `OK: CartItem kaydedildi. ID: ${cartItem._id}, Yeni Miktar: ${cartItem.quantity}`
    );

    // 5. SEPETİN TOPLAM FİYATINI GÜNCELLE
    console.log("Adım 4: Sepet toplam fiyatı yeniden hesaplanıyor...");
    const allItemsInCart = await CartItem.find({
      _id: { $in: cart.cartItems },
    });
    cart.totalPrice = allItemsInCart.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    console.log(`OK: Yeni toplam fiyat hesaplandı: ${cart.totalPrice}`);

    // 6. ANA SEPET DÖKÜMANINI KAYDET
    await cart.save();
    console.log("OK: Ana sepet dökümanı son haliyle kaydedildi.");

    // 7. KULLANICIYA YANIT GÖNDER
    console.log(
      "Adım 5: Son sepet verisi hazırlanıp kullanıcıya gönderiliyor..."
    );
    const finalCartData = await Cart.findById(cart._id).populate({
      path: "cartItems",
      populate: { path: "product", model: "Product" },
    });

    console.log("--- İŞLEM BAŞARIYLA TAMAMLANDI ---");
    res.status(200).json({
      message: `${product.name} sepete başarıyla eklendi.`,
      cart: finalCartData,
    });
  } catch (error) {
    console.error("\n*** KRİTİK HATA YAKALANDI ***");
    console.error(`Hata Mesajı: ${error.message}`);
    console.error("Hata Detayları:", error);
    console.error("***************************\n");
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.get("/getCartByUserId/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "cartItems",
      populate: {
        path: "product", // 'select' kaldırıldı, böylece Product modelindeki tüm alanlar gelir
      },
    });

    if (!cart) {
      return res.status(200).json({
        message: "Kullanıcının sepeti boş.",
        cart: { _id: null, userId, cartItems: [], totalPrice: 0 },
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Sepet getirme hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.get("/getCartById/:cartId", async (req, res) => {
  const { cartId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    return res.status(400).json({ message: "Geçersiz sepet ID formatı." });
  }

  try {
    const cart = await Cart.findById(cartId).populate({
      path: "cartItems",
      populate: {
        path: "product", // 'select' kaldırıldı, böylece Product modelindeki tüm alanlar gelir
      },
    });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Bu ID'ye sahip bir sepet bulunamadı." });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Sepet ID'si ile getirme hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.delete("/clearCart/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Kullanıcı ID'si gereklidir." });
  }

  try {
    // 1. Kullanıcının sepetini bul
    const cart = await Cart.findOne({ userId });

    // Eğer kullanıcının zaten bir sepeti yoksa veya sepeti boşsa, işlem başarılı sayılır.
    if (!cart || cart.cartItems.length === 0) {
      return res
        .status(200)
        .json({ message: "Kullanıcının sepeti zaten boş." });
    }

    // 2. Sepete ait tüm 'CartItem' dökümanlarını veritabanından sil
    // 'cart.cartItems' dizisi CartItem'ların ID'lerini içerir.
    // $in operatörü, bu dizideki ID'lere sahip tüm dökümanları bulur.
    await CartItem.deleteMany({ _id: { $in: cart.cartItems } });

    // 3. Ana 'Cart' dökümanının içeriğini temizle
    cart.cartItems = []; // cartItems dizisini boşalt
    cart.totalPrice = 0; // Toplam fiyatı sıfırla

    // 4. Sepetin güncel halini veritabanına kaydet
    await cart.save();

    res.status(200).json({ message: "Sepet başarıyla temizlendi.", cart });
  } catch (error) {
    console.error("Sepet temizlenirken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.delete("/item/:cartItemId", async (req, res) => {
  const { cartItemId } = req.params;
  const { userId } = req.body; // Silme işlemini yapan kullanıcının kimliğini doğrulamak için userId'yi body'de alıyoruz.

  if (!userId || !mongoose.Types.ObjectId.isValid(cartItemId)) {
    return res
      .status(400)
      .json({ message: "Geçerli Kullanıcı ID ve Ürün ID'si gereklidir." });
  }

  try {
    // 1. Silinecek olan CartItem'ı bul.
    const itemToDelete = await CartItem.findById(cartItemId);
    if (!itemToDelete) {
      return res.status(404).json({ message: "Sepette bu ürün bulunamadı." });
    }

    // 2. Kullanıcının sepetini bul ve bu item'ın o sepete ait olduğunu doğrula.
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.cartItems.includes(itemToDelete._id)) {
      return res.status(403).json({
        message: "Bu işlemi yapma yetkiniz yok veya ürün sepetinizde değil.",
      });
    }

    // 3. CartItem dökümanını veritabanından kalıcı olarak sil.
    await CartItem.findByIdAndDelete(cartItemId);

    // 4. Silinen item'ın ID'sini, ana Cart dökümanının `cartItems` dizisinden çıkar.
    // $pull operatörü Mongoose'da bunu atomik olarak yapar.
    cart.cartItems.pull(cartItemId);

    // 5. Sepetin toplam fiyatını yeniden hesapla.
    // En güvenli yöntem, kalan ürünler üzerinden yeniden hesaplamaktır.
    await cart.populate({
      path: "cartItems",
      populate: { path: "product", select: "price discount" },
    });
    cart.totalPrice = cart.cartItems.reduce((sum, item) => {
      if (item.product) {
        const price = item.product.price;
        const discount = item.product.discount || 0;
        const finalPrice = price - (price * discount) / 100;
        return sum + finalPrice * item.quantity;
      }
      return sum;
    }, 0);

    // 6. Sepetin son halini kaydet.
    await cart.save();

    // 7. Kullanıcıya güncel ve tam dolu sepeti geri döndür.
    await cart.populate({
      path: "cartItems",
      populate: { path: "product" },
    });

    res.status(200).json({ message: "Ürün sepetten başarıyla silindi.", cart });
  } catch (error) {
    console.error("Sepetten ürün silinirken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.put("/item/update-quantity", async (req, res) => {
  const { userId, cartItemId, newQuantity } = req.body;

  // 1. Girdi Kontrolü
  if (!userId || !cartItemId || !newQuantity) {
    return res
      .status(400)
      .json({ message: "userId, cartItemId ve newQuantity gereklidir." });
  }

  if (newQuantity < 1) {
    return res
      .status(400)
      .json({
        message:
          "Miktar 1'den az olamaz. Ürünü silmek için sil butonunu kullanın.",
      });
  }

  try {
    // 2. Gerekli dökümanları bul
    const cart = await Cart.findOne({ userId });
    const cartItem = await CartItem.findById(cartItemId).populate(
      "product",
      "stock price discountedPrice"
    );

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Kullanıcıya ait sepet bulunamadı." });
    }
    if (!cartItem) {
      return res
        .status(404)
        .json({ message: "Sepette güncellenecek ürün bulunamadı." });
    }
    // Güvenlik kontrolü: Bu item gerçekten bu kullanıcının sepetine mi ait?
    if (cartItem.cartId.toString() !== cart._id.toString()) {
      return res
        .status(403)
        .json({ message: "Bu ürün üzerinde işlem yapma yetkiniz yok." });
    }
    // Stok kontrolü
    if (cartItem.product.stock < newQuantity) {
      return res
        .status(400)
        .json({
          message: `Yetersiz stok. Sadece ${cartItem.product.stock} adet ürün kaldı.`,
        });
    }

    // 3. CartItem'ı güncelle
    cartItem.quantity = newQuantity;
    const priceToUse =
      cartItem.product.discountedPrice ?? cartItem.product.price;
    cartItem.subtotal = newQuantity * priceToUse;
    await cartItem.save();

    // 4. Sepetin toplam fiyatını yeniden hesapla (Güvenilir yöntem)
    const allItemsInCart = await CartItem.find({ cartId: cart._id });
    cart.totalPrice = allItemsInCart.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    await cart.save();

    // 5. Kullanıcıya güncel ve tam dolu sepeti geri döndür
    const finalCartData = await Cart.findById(cart._id).populate({
      path: "cartItems",
      populate: { path: "product", model: "Product" },
    });

    res
      .status(200)
      .json({
        message: "Ürün miktarı başarıyla güncellendi.",
        cart: finalCartData,
      });
  } catch (error) {
    console.error("Miktar güncellenirken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

module.exports = router;
