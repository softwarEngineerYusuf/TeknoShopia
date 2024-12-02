const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    isGoogleUser: { type: Boolean, default: false },
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    cart: { type: Schema.Types.ObjectId, ref: "Cart", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
