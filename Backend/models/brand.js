const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: { type: String, required: true }, 
  description: { type: String },
  imageUrl: { type: String },
  logo: { 
    data: Buffer,
    contentType: String,
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }] 
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);