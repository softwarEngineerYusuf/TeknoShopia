const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true } // Miktar alanı eklendi
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Hazırlanıyor' }, 
  orderDate: { type: Date, default: Date.now },
  deliveryAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);