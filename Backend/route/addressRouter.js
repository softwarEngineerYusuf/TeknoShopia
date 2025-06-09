const express = require("express");
const Address = require("../models/address.js");
const User = require("../models/user.js");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/addAddress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { country, district, city, street, postalCode } = req.body;

    if (!country || !district || !city || !street || !postalCode) {
      return res.status(400).json({
        message:
          "Tüm alanlar gereklidir: country, district, city, street, postalCode.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Adres eklenecek kullanıcı bulunamadı." });
    }

    const newAddress = new Address({
      userId,
      country, // country eklendi
      district,
      city,
      street,
      postalCode,
    });
    await newAddress.save();

    user.addresses.push(newAddress._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Adres başarıyla eklendi.", address: newAddress });
  } catch (error) {
    res.status(500).json({
      message: "Adres eklenirken bir hata oluştu.",
      error: error.message,
    });
  }
});

router.get("/getAddressesByUserId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Geçersiz kullanıcı ID formatı." });
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    const addresses = await Address.find({ userId: userId });
    res.status(200).json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sunucu hatası oluştu.", error: error.message });
  }
});

router.get("/allAddresses", async (req, res) => {
  try {
    const addresses = await Address.find().populate("userId", "name email");
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getAddressById/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!address) {
      return res.status(404).json({ message: "Adres bulunamadı." });
    }

    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.put("/updateAddress/:id", async (req, res) => {
  try {
    const { country, district, city, street, postalCode } = req.body; // country eklendi

    const updatedFields = {};
    if (country) updatedFields.country = country; // country eklendi
    if (district) updatedFields.district = district;
    if (city) updatedFields.city = city;
    if (street) updatedFields.street = street;
    if (postalCode) updatedFields.postalCode = postalCode;

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "En az bir alanı güncellemelisiniz." });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Adres bulunamadı." });
    }

    res.status(200).json({
      message: "Adres başarıyla güncellendi.",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.delete("/deleteAddress/:id", async (req, res) => {
  try {
    const addressId = req.params.id;

    // Önce adresin var olup olmadığını kontrol et
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Adres bulunamadı." });
    }

    // Kullanıcıyı bul ve adresi kullanıcıdan çıkar
    const user = await User.findById(address.userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Kullanıcının adres listesinden bu adresi çıkar
    user.addresses = user.addresses.filter(
      (addr) => addr.toString() !== addressId
    );
    await user.save(); // Kullanıcıyı güncelle

    // Adresi Address modelinden sil
    await Address.findByIdAndDelete(addressId);

    res.status(200).json({ message: "Adres başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

module.exports = router;
