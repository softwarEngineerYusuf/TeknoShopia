const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderStatusSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    status: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderStatus", orderStatusSchema);
