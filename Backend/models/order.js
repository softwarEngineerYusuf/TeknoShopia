const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    OrderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    totalPrice: { type: Number, required: true },
    currentStatus: { type: Schema.Types.ObjectId, ref: "OrderStatus" },
    orderDate: { type: Date, default: Date.now },
    billingAddress: {
      type: Schema.Types.ObjectId,
      ref: "BillingAddress",
      required: true,
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "ShippingAddress",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
