const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' }, 
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);