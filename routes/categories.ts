import express from 'express';
import Category from '../models/Category';
import mongoose, { mongo } from 'mongoose';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.send(categories);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const categoryData = {
      title: req.body.title,
      description: req.body.description,
    };
    const category = new Category(categoryData);
    await category.save();
    return res.send(category);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }

    if (e instanceof mongo.MongoServerError && e.code === 11000) {
      return res.status(422).send({ message: 'Title should be unique!' });
    }
    next(e);
  }
});

export default categoriesRouter;
