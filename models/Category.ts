import { Schema, model } from 'mongoose';

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  {
    versionKey: false,
  },
);

const Category = model('Category', CategorySchema);

export default Category;
