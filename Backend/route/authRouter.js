const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const Cart = require("../models/cart.js");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  validate,
} = require("../middleware/registerValidation");
const passport = require("../config/passport.js");
const router = express.Router();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRATION = "1d"; // Token süresini 1 gün olarak belirliyorum.

// Google ile kimlik doğrulama isteği
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google'ın yönlendirdiği geri dönüş yolu
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      let user = req.user;
      let cart = await Cart.findOne({ userId: user._id });

      if (!cart) {
        // Eğer sepet yoksa yeni bir tane oluştur
        cart = new Cart({
          userId: user._id,
          cartItems: [],
          totalPrice: 0,
        });
        await cart.save();

        // Kullanıcının cart alanını güncelle
        user.cart = cart._id;
        await user.save();
      }

      // Kullanıcı bilgilerini token ile yanıtla
      const token = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });

      res.status(200).json({
        message: "Google ile başarılı giriş",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          cart: user.cart,
        },
        token,
      });

      // Girişten sonra yönlendirme yapılacak URL
      res.redirect("http://localhost:5173");
    } catch (error) {
      res
        .status(500)
        .json({ message: "Bir hata oluştu.", error: error.message });
    }
  }
);

router.post("/register", registerValidation, validate, async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu e-posta adresi zaten kullanılıyor." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cart: null, // Şimdilik boş bırakıyoruz, hemen aşağıda dolduracağız.
    });
    await newUser.save();

    // Kullanıcı için boş bir alışveriş sepeti oluşturuyorum.
    const newCart = new Cart({
      userId: newUser._id,
      cartItems: [],
      totalPrice: 0,
    });
    await newCart.save();

    // Kullanıcının `cart` alanını güncelliyorum.
    newUser.cart = newCart._id;
    await newUser.save();

    // ✅ **JWT Token oluşturma**
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION } // 1 gün geçerli olacak
    );

    // ✅ **Token'ı httpOnly ve secure cookie olarak set etme**
    res.cookie("token", token, {
      httpOnly: true, // JavaScript tarafından erişilemez.
      secure: process.env.NODE_ENV === "production", // Sadece HTTPS üzerinde gönderilir.
      maxAge: 24 * 60 * 60 * 1000, // 1 gün
      sameSite: "lax", // CSRF saldırılarına karşı koruma sağlar.
    });

    // ✅ **Yanıt olarak kullanıcı bilgileri ve token'ı döndürme**
    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu ve giriş yapıldı.",
      token, // Token'ı JSON içinde de gönderiyoruz.
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        cart: newCart._id,
        addresses: newUser.addresses,
        favorites: newUser.favorites,
        orders: newUser.orders,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "E-posta adresi veya şifre yanlış." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "E-posta adresi veya şifre yanlış." });
    }

    // JWT token oluşturuyorum.
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Token'ı httpOnly ve secure cookie olarak ayarladım
    res.cookie("token", token, {
      httpOnly: true, // JavaScript tarafından erişilemez.
      secure: process.env.NODE_ENV === "production", // Sadece HTTPS üzerinde gönderilir.
      maxAge: 24 * 60 * 60 * 1000, // 1 gün
      sameSite: "lax", // CSRF saldırılarına karşı koruma sağlar.
    });

    // Kullanıcı bilgilerini döndür.
    res.status(200).json({
      message: "Başarıyla giriş yaptınız.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,

        addresses: user.addresses,
        favorites: user.favorites,
        cart: user.cart,
        orders: user.orders,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Token'ı cookie'den siliyorum.
  res.status(200).json({ message: "Başarıyla çıkış yaptınız." });
});

module.exports = router;
