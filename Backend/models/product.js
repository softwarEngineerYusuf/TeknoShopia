const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, 
  category: { type: String, required: true }, 
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  images: [String], 
  imageFiles: [{ 
    data: Buffer,
    contentType: String 
  }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  rating: { type: Number, default: 0 } ,

  discount: { type: Number, default: 0 }, // İndirim yüzdesi (%)
  discountStartDate: { type: Date }, 
  discountEndDate: { type: Date }, 
  attributes: { type: Map, of: String } // dinameik key value şeklinde veri ekleyecem
}, { timestamps: true });


productSchema.virtual('discountedPrice').get(function () {
  if (this.discount > 0) {
    return this.price - (this.price * (this.discount / 100)); 
  }
  return this.price; 
});

module.exports = mongoose.model('Product', productSchema);

