import express from 'express';
import { clearImages, imagesUpload } from '../multer';
import mongoose, { Types } from 'mongoose';

import { ProductMutation } from '../types';
import Product from '../models/Product';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();

    res.send(products);
  } catch (e) {
    next(e);
  }
});

productsRouter.get('/:id', async (req, res, next) => {
  try {
    let _id: Types.ObjectId;

    try {
      _id = new Types.ObjectId(req.params.id);
    } catch (e) {
      return res.status(404).send({ error: 'Wrong ObjectId' });
    }

    const product = await Product.findById({ _id }).populate(
      'category',
      '_id title description',
    );

    if (!product) {
      return res.status(404).send({ error: 'Not found!' });
    }

    return res.send(product);
  } catch (e) {
    next(e);
  }
});

productsRouter.post(
  '/',
  // auth,
  // permit('admin'),
  imagesUpload.single('image'),
  async (req: RequestWithUser, res, next) => {
    try {
      if (!req.body.title || !req.body.price) {
        return res.status(422).send({ error: 'Fields is required!' });
      }

      const productData: ProductMutation = {
        category: req.body.category,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        image: req.file ? req.file.filename : null,
      };

      const product = new Product(productData);
      await product.save();

      return res.send(product);
    } catch (e) {
      if (req.file) {
        clearImages(req.file.filename);
      }

      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(422).send(e);
      }

      next(e);
    }
  },
);

productsRouter.patch(
  '/:id',
  auth,
  permit('admin'),
  imagesUpload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.body.title || !req.body.price) {
        return res.status(422).send({ error: 'Fields is required!' });
      }

      const product = await Product.findById({ _id: req.params.id });

      if (!product) {
        return res.status(422).send({ error: 'Not found' });
      }

      let image: string | null = null;

      if (req.body.isDeletedImage === 'delete' && product.image) {
        clearImages(product.image);
      }

      if (req.file) {
        image = req.file.filename;
      }

      const result = await Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            category: req.body.category,
            price: parseFloat(req.body.price),
            description: req.body.description,
            image,
          },
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ error: 'Not found!' });
      }

      return res.send({ message: 'ok!' });
    } catch (e) {
      if (req.file) {
        clearImages(req.file.filename);
      }

      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(422).send(e);
      }
      next(e);
    }
  },
);

export default productsRouter;
