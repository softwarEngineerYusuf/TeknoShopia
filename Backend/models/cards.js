const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cardHolder: {
      type: String,
      required: true,
    },

    last4: {
      type: String,
      required: true,
    },

    expiryDate: {
      type: String,
      required: true,
    },

    cardType: {
      type: String,
      default: "Unknown",
    },
  },
  {
    // Bu seçenek, her kayda otomatik olarak createdAt ve updatedAt alanlarını ekler.
    timestamps: true,
  }
);

module.exports = mongoose.model("Card", cardSchema);
