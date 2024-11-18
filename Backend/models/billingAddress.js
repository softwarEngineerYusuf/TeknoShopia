const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingAddressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BillingAddress", billingAddressSchema);
