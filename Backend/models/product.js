const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    color: { type: String, required: true }, // Renk bilgisi eklendi
    description: { type: String },
    mainImage: { type: String },
    additionalImages: [String],
    imageFiles: [
      {
        data: Buffer,
        contentType: String,
      },
    ],
    additionalImageFiles: [
      {
        data: Buffer,
        contentType: String,
      },
    ],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    discount: { type: Number, default: 0 },
    discountStartDate: { type: Date },
    discountEndDate: { type: Date },
    attributes: { type: Map, of: String },
    groupId: { type: String, required: true }, // Aynı ürün grubunu takip eden ID
    topPick: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("discountedPrice").get(function () {
  if (this.discount > 0) {
    return this.price - this.price * (this.discount / 100);
  }
  return this.price;
});

module.exports = mongoose.model("Product", productSchema);
