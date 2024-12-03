const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    logo: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
