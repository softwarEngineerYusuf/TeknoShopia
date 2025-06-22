const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js");
const CartItem = require("../models/cartItem.js");
const Product = require("../models/product.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");

// Helper Fonksiyon: Sepetin toplam fiyatını doğru şekilde hesaplar.
const recalculateAndSaveCart = async (cartId) => {
  const cart = await Cart.findById(cartId).populate({
    path: "cartItems",
    populate: {
      path: "product",
      select: "price discount discountedPrice",
    },
  });

  if (!cart) return null;

  let newTotalPrice = 0;
  for (const item of cart.cartItems) {
    if (item.product) {
      const currentPrice = item.product.discountedPrice;
      item.price = currentPrice;
      item.subtotal = currentPrice * item.quantity;
      newTotalPrice += item.subtotal;
      await item.save();
    }
  }

  cart.totalPrice = newTotalPrice;
  await cart.save();
  return cart;
};

router.post("/addCart", async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Kullanıcı ID ve Ürün ID gereklidir." });
  }

  try {
    // 1. Gerekli verileri veritabanından çek
    const [user, product] = await Promise.all([
      User.findById(userId),
      Product.findById(productId), // Product'ı burada çekerek güncel fiyatı alıyoruz
    ]);

    if (!user)
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı." });
    if (product.stock < quantity)
      return res.status(400).json({ message: "Yetersiz stok." });

    // 2. Kullanıcının sepetini bul veya oluştur
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, cartItems: [] });
      user.cart = cart._id;
      await Promise.all([cart.save(), user.save()]);
    }

    // 3. Sepetteki ürünü (CartItem) bul
    let cartItem = await CartItem.findOne({
      cartId: cart._id,
      product: productId,
    });

    const currentPrice = product.discountedPrice;

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.price = currentPrice;
      cartItem.subtotal = currentPrice * cartItem.quantity;
    } else {
      cartItem = new CartItem({
        cartId: cart._id,
        product: productId,
        quantity: quantity,
        price: currentPrice,
        subtotal: currentPrice * quantity,
      });
      cart.cartItems.push(cartItem._id);
      await cart.save();
    }

    await cartItem.save();

    await recalculateAndSaveCart(cart._id);

    const finalCartData = await Cart.findById(cart._id).populate({
      path: "cartItems",
      populate: {
        path: "product",
        populate: [{ path: "brand" }, { path: "category" }],
      },
    });

    res.status(200).json({
      message: `${product.name} sepete eklendi.`,
      cart: finalCartData,
    });
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
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(200)
        .json({ _id: null, userId, cartItems: [], totalPrice: 0 });
    }

    await recalculateAndSaveCart(cart._id);

    const finalCartData = await Cart.findById(cart._id).populate({
      path: "cartItems",
      populate: {
        path: "product",
        populate: [
          { path: "brand", select: "name logo" },
          { path: "category", select: "name" },
        ],
      },
    });

    res.status(200).json(finalCartData);
  } catch (error) {
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
  const { userId } = req.body;
  if (!userId || !mongoose.Types.ObjectId.isValid(cartItemId)) {
    return res
      .status(400)
      .json({ message: "Geçerli Kullanıcı ID ve Ürün ID'si gereklidir." });
  }

  try {
    const cart = await Cart.findOne({ userId });
    const itemToDelete = await CartItem.findById(cartItemId);

    if (
      !cart ||
      !itemToDelete ||
      itemToDelete.cartId.toString() !== cart._id.toString()
    ) {
      return res.status(404).json({ message: "Ürün sepetinizde bulunamadı." });
    }

    await CartItem.findByIdAndDelete(cartItemId);
    cart.cartItems.pull(cartItemId);

    await recalculateAndSaveCart(cart._id);

    const finalCartData = await Cart.findById(cart._id).populate({
      path: "cartItems",
      populate: {
        path: "product",
        populate: [{ path: "brand" }, { path: "category" }],
      },
    });

    res.status(200).json({
      message: "Ürün sepetten başarıyla silindi.",
      cart: finalCartData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

router.put("/item/update-quantity", async (req, res) => {
  const { userId, cartItemId, newQuantity } = req.body;
  if (!userId || !cartItemId || !newQuantity || newQuantity < 1) {
    return res.status(400).json({ message: "Geçersiz istek verileri." });
  }

  try {
    const cart = await Cart.findOne({ userId });
    const cartItem = await CartItem.findById(cartItemId).populate(
      "product",
      "stock"
    );

    if (
      !cart ||
      !cartItem ||
      cartItem.cartId.toString() !== cart._id.toString()
    ) {
      return res.status(404).json({ message: "Ürün sepetinizde bulunamadı." });
    }
    if (cartItem.product.stock < newQuantity) {
      return res.status(400).json({
        message: `Yetersiz stok. Sadece ${cartItem.product.stock} adet ürün kaldı.`,
      });
    }

    cartItem.quantity = newQuantity;
    await cartItem.save();

    await recalculateAndSaveCart(cart._id);

    const finalCartData = await Cart.findById(cart._id).populate({
      path: "cartItems",
      populate: {
        path: "product",
        populate: [{ path: "brand" }, { path: "category" }],
      },
    });

    res
      .status(200)
      .json({ message: "Miktar güncellendi.", cart: finalCartData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});
module.exports = router;
