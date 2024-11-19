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
