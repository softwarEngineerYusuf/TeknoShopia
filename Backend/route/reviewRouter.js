const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Product = require("../models/product");
const User = require("../models/user"); // User modelinin projenizde olduğundan emin olun

// --- YORUM EKLEME ---
router.post("/addReview", async (req, res) => {
  try {
    const { productId, userId, comment, rating } = req.body;

    // 1. Gerekli alanların kontrolü
    if (!productId || !userId || !comment || !rating) {
      return res
        .status(400)
        .json({ message: "Gerekli tüm alanları doldurunuz." });
    }

    // 2. IYILEŞTIRME: Kullanıcı bu ürüne daha önce yorum yapmış mı?
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res
        .status(409)
        .json({ message: "Bu ürünü zaten daha önce değerlendirdiniz." });
    }

    // 3. Yeni yorumu oluştur
    const newReview = new Review({
      productId,
      userId,
      comment,
      rating,
    });

    await newReview.save();

    // 4. Yorumu ilgili ürün ve kullanıcıya ekle
    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: newReview._id },
    });
    // Not: User modelinizde "reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]" alanı olmalı
    await User.findByIdAndUpdate(userId, { $push: { reviews: newReview._id } });

    res
      .status(201)
      .json({ message: "Yorumunuz başarıyla eklendi.", review: newReview });
  } catch (error) {
    console.error("Yorum ekleme hatası:", error);
    res
      .status(500)
      .json({
        message: "Sunucu tarafında bir hata oluştu.",
        error: error.message,
      });
  }
});

// --- TÜM YORUMLARI GETİRME ---
router.get("/getAllReviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("productId", "name")
      .populate("userId", "name email")
      .sort({ date: -1 }); // En yeniden eskiye sırala
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

// --- ÜRÜNE GÖRE YORUMLARI GETİRME ---
router.get("/getReviewByProductId/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res
        .status(404)
        .json({ message: "Bu ID ile eşleşen bir ürün bulunamadı." });
    }

    const reviews = await Review.find({ productId: productId })
      .populate("userId", "name") // Yorum sahibinin sadece adını getiriyoruz
      .sort({ date: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

// --- YORUM SİLME ---
router.delete("/deleteReview/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Yorum bulunamadı." });
    }

    // Yorumun ID'sini referanslandığı yerlerden kaldır
    await Product.findByIdAndUpdate(review.productId, {
      $pull: { reviews: review._id },
    });
    await User.findByIdAndUpdate(review.userId, {
      $pull: { reviews: review._id },
    });

    // Yorumu sil
    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Yorum başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

// --- YORUM GÜNCELLEME ---
router.put("/updateReview/:id", async (req, res) => {
  try {
    const { comment, rating } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { comment, rating },
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: "Yorum bulunamadı." });
    }

    res
      .status(200)
      .json({ message: "Yorum başarıyla güncellendi.", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

module.exports = router;
