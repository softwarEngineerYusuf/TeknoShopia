const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Product = require("../models/product.js");

router.post("/addProduct", async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Kullanıcı ID ve Ürün ID gereklidir." });
  }

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    if (user.favorites.includes(productId)) {
      return res
        .status(400)
        .json({ message: "Bu ürün zaten favorilerinizde." });
    }

    user.favorites.push(productId);
    await user.save();

    res.status(200).json({
      message: "Ürün başarıyla favorilere eklendi.",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Favorilere ekleme hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.post("/removeProduct", async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Kullanıcı ID ve Ürün ID gereklidir." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: productId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({
      message: "Ürün başarıyla favorilerden kaldırıldı.",
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error("Favorilerden kaldırma hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.get("/getProductsByUserId/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "favorites",
      model: "Product",
      // Frontend'de ihtiyacınız olan alanları seçerek performansı artırabilirsiniz
      // select: 'name price mainImage brand discount discountedPrice'
    });

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error("Favoriler getirilirken hata:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.get("/getFavoriteProductIds/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("favorites");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Sadece favori ürünlerin ID'lerini içeren diziyi döndür
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error("Favori ID'leri getirilirken hata:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});
module.exports = router;
