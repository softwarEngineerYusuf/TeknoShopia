const express = require("express");
const router = express.Router();
const Order = require("../models/order.js");
const User = require("../models/user.js");
const Address = require("../models/address.js");
const Cart = require("../models/cart.js");
const CartItem = require("../models/cartItem.js");
const sendMail = require("../config/mailService");
const Coupon = require("../models/coupon.js");
const Product = require("../models/product.js");
const generateOrderNumber = () => {
  const date = new Date();
  const dateString = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
  const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${dateString}-${randomString}`;
};

router.post("/CreateOrder", async (req, res) => {
  try {
    const { userId, addressId, orderItems, totalPrice, coupon } = req.body;

    if (
      !userId ||
      !addressId ||
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Eksik veya geçersiz sipariş bilgileri." });
    }

    const productIds = orderItems.map((item) => item.product);
    const productsInDB = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(productsInDB.map((p) => [p._id.toString(), p]));

    for (const item of orderItems) {
      const product = productMap.get(item.product.toString());
      if (!product) {
        return res
          .status(404)
          .json({ message: `Ürün bulunamadı: ID ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stok yetersiz: ${product.name}. Mevcut stok: ${product.stock}, istenen: ${item.quantity}.`,
        });
      }
    }

    const [user, address] = await Promise.all([
      User.findById(userId),
      Address.findById(addressId),
    ]);

    if (!user || !address) {
      return res
        .status(404)
        .json({ message: "Kullanıcı veya adres bulunamadı." });
    }

    const stockUpdatePromises = orderItems.map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      )
    );
    await Promise.all(stockUpdatePromises);

    const orderNumber = generateOrderNumber();
    const newOrder = new Order({
      orderNumber,
      userId,
      orderItems,
      totalPrice,
      shippingAddress: {
        country: address.country,
        district: address.district,
        city: address.city,
        street: address.street,
        postalCode: address.postalCode,
      },
      status: "Processing",
      coupon: coupon
        ? {
            code: coupon.code,
            discountAmount: coupon.discountAmount,
          }
        : undefined,
    });

    const savedOrder = await newOrder.save();

    if (coupon && coupon.code) {
      await Coupon.updateOne({ code: coupon.code }, { $inc: { timesUsed: 1 } });
    }

    user.orders.push(savedOrder._id);
    await user.save();

    const cart = await Cart.findOne({ userId: userId });
    if (cart && cart.cartItems) {
      // cart.cartItems var mı diye ek kontrol
      const purchasedProductIds = orderItems.map((item) =>
        item.product.toString()
      );

      // ======================= HATAYI DÜZELTEN KISIM =======================
      // Filtrelemeden önce her bir `item`'ın ve `item.product`'ın var olduğundan emin oluyoruz.
      cart.cartItems = cart.cartItems.filter((item) => {
        // Eğer item veya item.product tanımsız/null ise, bu bozuk veriyi sepetten temizle (false döndürerek).
        if (!item || !item.product) {
          return false;
        }
        // Eğer item geçerliyse, normal kontrolü yap.
        return !purchasedProductIds.includes(item.product.toString());
      });
      // =====================================================================

      // Sepette kalan ürünlerin toplam fiyatını yeniden hesapla
      if (cart.cartItems.length > 0) {
        const remainingProductDetails = await Product.find({
          _id: { $in: cart.cartItems.map((i) => i.product).filter(Boolean) }, // filter(Boolean) ile null/undefined ID'leri kaldır
        });
        const remainingProductMap = new Map(
          remainingProductDetails.map((p) => [
            p._id.toString(),
            p.discountedPrice,
          ])
        );

        cart.totalPrice = cart.cartItems.reduce((sum, item) => {
          // item.product'ın varlığını tekrar kontrol et, bu bir ek güvenlik katmanıdır.
          if (item && item.product) {
            const price = remainingProductMap.get(item.product.toString()) || 0;
            return sum + price * item.quantity;
          }
          return sum;
        }, 0);
      } else {
        // Eğer sepette hiç ürün kalmadıysa toplam fiyatı sıfırla
        cart.totalPrice = 0;
      }

      await cart.save();
    }

    const emailSubject = `Siparişiniz Onaylandı! Sipariş No: ${savedOrder.orderNumber}`;
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2c3e50; text-align: center;">Teşekkürler, ${
          user.name
        }!</h2>
        <p>Siparişiniz başarıyla alındı. Sipariş Numaranız: <strong>${
          savedOrder.orderNumber
        }</strong></p>
        <p>Toplam Tutar: <strong>${savedOrder.totalPrice.toLocaleString(
          "tr-TR",
          { style: "currency", currency: "TRY" }
        )}</strong></p>
        ${
          savedOrder.coupon && savedOrder.coupon.code
            ? `<p style="color: #27ae60;">Kullanılan Kupon: <strong>${
                savedOrder.coupon.code
              }</strong> (İndirim: -${savedOrder.coupon.discountAmount.toFixed(
                2
              )} TL)</p>`
            : ""
        }
        <p>Siparişiniz en kısa sürede hazırlanıp kargoya verilecektir.</p>
      </div>`;

    try {
      await sendMail(user.email, emailSubject, emailTemplate);
    } catch (emailError) {
      console.error("Sipariş onayı e-postası gönderilemedi:", emailError);
    }

    res
      .status(201)
      .json({ message: "Sipariş başarıyla oluşturuldu!", order: savedOrder });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(500)
        .json({
          message: "Sipariş numarası oluşturulamadı, lütfen tekrar deneyin.",
        });
    }
    console.error("Sipariş oluşturma hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucuda bir hata oluştu.", error: error.message });
  }
});

// GET /api/orders/GetOrdersByUserId/:userId - Bir kullanıcının siparişlerini getirir
router.get("/GetOrdersByUserId/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate({
        path: "orderItems.product",
        model: "Product",
        select: "name mainImage price", // Orijinal fiyatı da alıyoruz!
      })
      .sort({ createdAt: -1 });

    if (!orders) {
      return res
        .status(404)
        .json({ message: "Bu kullanıcı için sipariş bulunamadı." });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Kullanıcının siparişleri getirilirken hata:", error);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});
// GET /api/orders/GetOrderById/:id - Tek bir siparişi ID ile getirir
router.get("/GetOrderById/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "orderItems.product",
      "name mainImage brand"
    );

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

// DELETE /api/orders/DeleteOrder/:id - Bir siparişi siler
router.delete("/DeleteOrder/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Silinecek sipariş bulunamadı." });
    }
    await User.findByIdAndUpdate(order.userId, {
      $pull: { orders: order._id },
    });
    res.status(200).json({ message: "Sipariş başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

module.exports = router;
