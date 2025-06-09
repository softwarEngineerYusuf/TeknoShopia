const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Address = require("../models/address");
const Order = require("../models/order");
const Product = require("../models/product");
const authenticateToken = require("../middleware/authenticateToken.js");

//authenticateToken
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("addresses", "district city street postalCode"); // Adres bilgilerini getiriyoruz

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getUserById/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("addresses", "district city street postalCode")
      .populate("cart.productId", "name price imageUrl");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.put("/updateUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    // Güncellenecek kullanıcıyı bul
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res
        .status(404)
        .json({ message: "Güncellenecek kullanıcı bulunamadı." });
    }

    // İsim güncelleniyorsa
    if (name) {
      userToUpdate.name = name;
    }

    // E-posta güncelleniyorsa, benzersiz olup olmadığını kontrol et
    if (email && email !== userToUpdate.email) {
      const emailExists = await User.findOne({ email: email });
      if (emailExists) {
        // 409 Conflict: Bu e-posta zaten başka bir kullanıcı tarafından kullanılıyor.
        return res
          .status(409)
          .json({ message: "Bu e-posta adresi zaten kullanılıyor." });
      }
      userToUpdate.email = email;
    }

    // Şifre güncelleniyorsa, güvenli bir şekilde hash'le
    if (password) {
      // Google ile giriş yapan kullanıcıların şifresi olmamalı ve değiştirilememeli.
      if (userToUpdate.isGoogleUser) {
        return res
          .status(400)
          .json({ message: "Google kullanıcıları şifre belirleyemez." });
      }
      // Şifre uzunluk kontrolü
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Şifre en az 6 karakter olmalıdır." });
      }
      const salt = await bcrypt.genSalt(10);
      userToUpdate.password = await bcrypt.hash(password, salt);
    }

    // Değişiklikleri kaydet
    const updatedUser = await userToUpdate.save();

    // Yanıt olarak asla şifreyi geri gönderme!
    updatedUser.password = undefined;

    res.status(200).json({
      message: "Kullanıcı bilgileri başarıyla güncellendi.",
      user: updatedUser,
    });
  } catch (error) {
    // Özellikle veritabanı hataları (örn: Mongoose validation error) için
    console.error("Kullanıcı güncelleme hatası:", error);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  //authenticateToken,
  const userId = req.params.id;

  try {
    // Kullanıcıyı bulur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Adresleri siler
    if (user.addresses.length > 0) {
      await Address.deleteMany({ _id: { $in: user.addresses } });
    }

    // Favorileri siler
    if (user.favorites.length > 0) {
      await Product.updateMany(
        { _id: { $in: user.favorites } },
        { $pull: { favoritedBy: userId } }
      );
    }

    // Sepeti boşaltır
    if (user.cart.length > 0) {
      await Product.updateMany(
        { _id: { $in: user.cart.map((item) => item.productId) } }, // `cart` artık `cartItem` dizisi olacak.
        { $pull: { inCarts: userId } }
      );
    }

    // Siparişleri siler
    if (user.orders.length > 0) {
      await Order.deleteMany({ _id: { $in: user.orders } });
    }

    // Kullanıcıyı siler
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "Kullanıcı ve ilişkili veriler başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

module.exports = router;
