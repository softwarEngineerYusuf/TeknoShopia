const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Sipariş içindeki her bir ürünü temsil eden alt şema
// Bu şemada bir değişiklik yapmıyoruz, zaten doğru.
const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Satın alma anındaki birim fiyat
});

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [OrderItemSchema], // Ürünler doğrudan gömülü
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      // Adres bilgileri doğrudan gömülü
      country: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    coupon: {
      code: { type: String },
      discountAmount: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
