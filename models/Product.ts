import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  image: String || null,
},
  {
    versionKey: false
  });

const Product = mongoose.model('Product', ProductSchema);

export default Product;