const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Product = require("../models/product");
const User = require("../models/user");

router.post("/addReview", async (req, res) => {
  try {
    const { productId, userId, comment, rating } = req.body;

    if (!productId || !userId || !comment || !rating) {
      return res.status(400).json({ message: "Gerekli alanları doldurunuz." });
    }

    const newReview = new Review({
      productId,
      userId,
      comment,
      rating,
    });

    await newReview.save();

    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: newReview._id },
    });
    await User.findByIdAndUpdate(userId, { $push: { reviews: newReview._id } });

    res
      .status(201)
      .json({ message: "Yorum başarıyla eklendi.", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getAllReviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("productId", "name")
      .populate("userId", "name email");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getReviewByProductId/:productId", async (req, res) => {
  try {
    const productExists = await Product.exists({ _id: req.params.productId });
    if (!productExists) {
      return res
        .status(404)
        .json({ message: "Bu ID ile eşleşen bir ürün bulunamadı." });
    }

    const reviews = await Review.find({
      productId: req.params.productId,
    }).populate("userId", "name email");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.delete("/deleteReview/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Yorum bulunamadı." });

    // Yorum burada siliniyor
    await review.deleteOne();

    // Yorumu hem üründen hemde userdan siliyorum
    await Product.findByIdAndUpdate(review.productId, {
      $pull: { reviews: review._id },
    });
    await User.findByIdAndUpdate(review.userId, {
      $pull: { reviews: review._id },
    });

    res.status(200).json({ message: "Yorum başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.put("/updateReview/:id", async (req, res) => {
  try {
    const { comment, rating } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { comment, rating },
      { new: true, runValidators: true }
    );
    if (!updatedReview)
      return res.status(404).json({ message: "Yorum bulunamadı." });

    res
      .status(200)
      .json({ message: "Yorum başarıyla güncellendi.", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});
module.exports = router;
