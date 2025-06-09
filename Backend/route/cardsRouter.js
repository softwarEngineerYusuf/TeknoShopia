const express = require("express");
const Card = require("../models/cards.js");
const User = require("../models/user.js");
const router = express.Router();

// Yeni bir kart ekle
router.post("/addCard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Frontend'den tam kart numarası ve cvv gelir
    const { cardNumber, cardHolder, expiryDate, cvv } = req.body;

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      return res
        .status(400)
        .json({ message: "Tüm kart bilgileri gereklidir." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // GÜVENLİK: Tam kart numarasını asla kaydetme, sadece son 4 hanesini al.
    const last4 = cardNumber.slice(-4);

    const newCard = new Card({
      userId,
      cardHolder,
      last4,
      expiryDate,
    });
    await newCard.save();

    user.cards.push(newCard._id);
    await user.save();

    res.status(201).json({ message: "Kart başarıyla eklendi.", card: newCard });
  } catch (error) {
    res.status(500).json({
      message: "Kart eklenirken bir hata oluştu.",
      error: error.message,
    });
  }
});

router.get("/getCardsByUserId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cards = await Card.find({ userId: userId });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
});

router.put("/updateCard/:id", async (req, res) => {
  try {
    const { cardHolder, expiryDate } = req.body;
    const updatedFields = {};
    if (cardHolder) updatedFields.cardHolder = cardHolder;
    if (expiryDate) updatedFields.expiryDate = expiryDate;

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "Güncellenecek alan sağlanmadı." });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Kart bulunamadı." });
    }
    res
      .status(200)
      .json({ message: "Kart başarıyla güncellendi.", card: updatedCard });
  } catch (error) {
    res.status(500).json({
      message: "Kart güncellenirken bir hata oluştu.",
      error: error.message,
    });
  }
});

router.delete("/deleteCard/:id", async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Kart bulunamadı." });
    }
    // Kullanıcının kart listesinden de çıkar
    await User.updateOne({ _id: card.userId }, { $pull: { cards: cardId } });
    // Kartı sil
    await Card.findByIdAndDelete(cardId);

    res.status(200).json({ message: "Kart başarıyla silindi." });
  } catch (error) {
    res.status(500).json({
      message: "Kart silinirken bir hata oluştu.",
      error: error.message,
    });
  }
});

module.exports = router;
