const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    currency: { type: String, default: "TRY" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItem", cartItemSchema);
