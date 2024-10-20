const mongoose = require("mongoose")
const Schema =mongoose.Schema;

const userSchema=new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    cart: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }, 
        price: { type: Number, required: true }, 
        subtotal: { type: Number, required: true }, 
        currency: { type: String, default: 'TRY' }, 
      }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);