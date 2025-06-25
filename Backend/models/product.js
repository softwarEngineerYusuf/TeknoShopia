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

productSchema.virtual("reviewCount").get(function () {
  if (this.reviews && this.reviews.length > 0) {
    return this.reviews.length;
  }
  return 0;
});

productSchema.virtual("averageRating").get(function () {
  if (this.reviews && this.reviews.length > 0) {
    const sumOfRatings = this.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );

    const average = sumOfRatings / this.reviews.length;
    return parseFloat(average.toFixed(1));
  }
  return 0;
});
productSchema.index({ name: "text", description: "text" });
module.exports = mongoose.model("Product", productSchema);
