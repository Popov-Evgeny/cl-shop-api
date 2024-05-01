import mongoose, { Types } from 'mongoose';
import Category from './Category';

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      validate: {
        validator: async (id: Types.ObjectId) => {
          const category = await Category.findById(id);
          return Boolean(category);
        },
        message: 'Category does not exist!',
      },
    },
  },
  {
    versionKey: false,
  },
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
