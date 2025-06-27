// routes/couponRouter.js

const express = require("express");
const router = express.Router();
const Coupon = require("../models/coupon.js");
const Cart = require("../models/cart.js");

// --------------------------------------------------
// 1. YENİ KUPON OLUŞTURMA (Admin için)
// Endpoint: /api/coupon/couponCreate
// --------------------------------------------------
router.post("/couponCreate", async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      description,
      startDate,
      endDate,
      minPurchaseAmount,
      usageLimit,
    } = req.body;

    // Gerekli alanların kontrolü
    if (!code || !discountType || !discountValue || !endDate || !description) {
      return res.status(400).json({ message: "Zorunlu alanlar eksik." });
    }

    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
    });
    if (existingCoupon) {
      return res.status(409).json({ message: "Bu kupon kodu zaten mevcut." });
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      description,
      startDate,
      endDate,
      minPurchaseAmount,
      usageLimit,
    });

    await newCoupon.save();

    res.status(201).json({
      message: "Kupon başarıyla oluşturuldu.",
      coupon: newCoupon,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Geçersiz veri.", details: error.message });
    }
    console.error("Kupon oluşturma hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucu hatası oluştu.", error: error.message });
  }
});

router.post("/couponApply", async (req, res) => {
  try {
    const { code, cartId } = req.body;

    if (!code || !cartId) {
      return res
        .status(400)
        .json({ message: "Kupon kodu ve sepet ID'si gereklidir." });
    }

    // `coupon` değişkenini `const` yerine `let` yapalım ki daha sonra atama yapabilelim.
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    // Kupon Geçerlilik Kontrolleri
    if (!coupon) {
      return res.status(404).json({ message: "Geçersiz kupon kodu." });
    }
    if (!coupon.isActive) {
      return res.status(400).json({ message: "Bu kupon artık aktif değil." });
    }
    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return res
        .status(400)
        .json({ message: "Bu kuponun kullanım süresi dolmuştur." });
    }
    if (coupon.timesUsed >= coupon.usageLimit) {
      return res
        .status(400)
        .json({ message: "Bu kupon kullanım limitine ulaştı." });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Sepet bulunamadı." });
    }
    if (cart.totalPrice < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message: `Bu kuponu kullanabilmek için sepet tutarınızın en az ${coupon.minPurchaseAmount} TL olması gerekmektedir.`,
      });
    }

    // İndirim Hesaplaması
    let discountAmount = 0;
    // DİKKAT: Backend'deki modelinizde "fixedAmount" yazıyor, frontend'de "fixed" bekliyor olabilirsiniz.
    // Tutarlılık için kontrol edin. Şimdilik backend'e göre bırakıyorum.
    if (coupon.discountType === "percentage") {
      discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixedAmount") {
      discountAmount = coupon.discountValue;
    }

    const finalPrice = Math.max(0, cart.totalPrice - discountAmount);

    // *** ANA DEĞİŞİKLİK BURADA ***
    // Frontend'e kuponun tüm bilgilerini ve hesaplanmış fiyatları içeren bir nesne gönderiyoruz.
    res.status(200).json({
      message: "Kupon başarıyla uygulandı!",
      originalPrice: cart.totalPrice,
      discountAmount: discountAmount,
      finalPrice: finalPrice,
      coupon: coupon, // Kuponun veritabanındaki tam halini gönderiyoruz.
    });
  } catch (error) {
    console.error("Kupon uygulama hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucu hatası oluştu.", error: error.message });
  }
});
router.get("/getAllCoupons", async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Tüm kuponlar getirilirken hata oluştu:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

router.put("/couponUpdate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoupon) {
      return res
        .status(404)
        .json({ message: "Güncellenecek kupon bulunamadı." });
    }

    res
      .status(200)
      .json({ message: "Kupon başarıyla güncellendi.", coupon: updatedCoupon });
  } catch (error) {
    console.error("Kupon güncelleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

router.delete("/couponDelete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Silinecek kupon bulunamadı." });
    }

    res.status(200).json({ message: "Kupon başarıyla silindi." });
  } catch (error) {
    console.error("Kupon silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

module.exports = router;
