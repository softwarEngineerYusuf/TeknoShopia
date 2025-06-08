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

  if (!userId || !productId) {
    return res.status(400).json({
      message: "Kullanıcı ID (userId) ve Ürün ID (productId) gereklidir.",
    });
  }

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (user && product) {
      console.log("\n--- Sepete Ekleme İşlemi Detayları ---");
      console.log("Kullanıcı Adı :", user.name);
      console.log("Kullanıcı ID  :", user._id);
      console.log("--------------------------------------");
      console.log("Ürün Adı      :", product.name);
      console.log("Ürün ID       :", product._id);
      console.log("Normal Fiyat  :", product.price);
      console.log("İndirim (%)   :", product.discount);
      console.log("Sanal Fiyat   :", product.discountedPrice);
      console.log("--------------------------------------\n");
    }

    if (!user)
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı." });
    if (product.stock < quantity)
      return res.status(400).json({ message: "Yetersiz stok." });

    let cart = await Cart.findById(user.cart);
    if (!cart) {
      cart = new Cart({ userId: user._id, cartItems: [], totalPrice: 0 });
    }

    let cartItem = await CartItem.findOne({
      cartId: cart._id,
      product: productId,
    });

    // Ürünün o anki geçerli fiyatını al (indirimli veya normal)
    const priceToUse =
      product.discountedPrice && product.discountedPrice < product.price
        ? product.discountedPrice
        : product.price;

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.subtotal = cartItem.quantity * priceToUse;
      await cartItem.save();
    } else {
      const subtotal = quantity * priceToUse;
      cartItem = new CartItem({
        cartId: cart._id,
        product: productId,
        quantity,
        price: priceToUse, // CartItem'a da doğru fiyatı kaydet
        subtotal,
      });
      await cartItem.save();
      cart.cartItems.push(cartItem._id);
    }

    // 1. POPULATE ET (Hesaplama için gerekli alanları seç)
    await cart.populate({
      path: "cartItems",
      populate: {
        path: "product",
        select: "price discount", // SANAL ALAN YERİNE GERÇEK ALANLARI SEÇİYORUZ
      },
    });

    // 2. TOPLAM FİYATI, GERÇEK VERİLER ÜZERİNDEN HESAPLA
    cart.totalPrice = cart.cartItems.reduce((sum, item) => {
      if (item.product) {
        const price = item.product.price;
        const discount = item.product.discount || 0; // discount yoksa 0 kabul et

        let finalPrice = price;
        if (discount > 0) {
          finalPrice = price - (price * discount) / 100;
        }
        return sum + finalPrice * item.quantity;
      }
      return sum;
    }, 0);

    // 3. KAYDET
    await cart.save();

    // YANIT GÖNDER (Kullanıcıya güzel görünsün diye tekrar ve tam populate edebiliriz)
    await cart.populate({
      path: "cartItems",
      populate: { path: "product" },
    });

    res.status(200).json({ message: "Ürün sepete başarıyla eklendi.", cart });
  } catch (error) {
    console.error("Sepete ekleme hatası:", error);
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
      return res
        .status(403)
        .json({
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

module.exports = router;
