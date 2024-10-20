const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockMovementSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  previousStock: { type: Number, required: true },
  currentStock: { type: Number, required: true },
  movementDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);