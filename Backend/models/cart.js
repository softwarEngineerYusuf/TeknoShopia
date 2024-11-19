const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [{ type: Schema.Types.ObjectId, ref: "CartItem" }],
    totalPrice: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
