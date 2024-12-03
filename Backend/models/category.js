const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
