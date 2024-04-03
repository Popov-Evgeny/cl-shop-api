import express from 'express';
import fileDb from '../fileDb';
import {ProductWithOutId} from '../types';
import {imagesUpload} from '../multer';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  const products = await fileDb.getItems();
  return res.send(products);
});

productsRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const product = await fileDb.getItemById(id);

  if (!product) {
    return res.status(404).send({error: 'Not found!'});
  }

  return res.send(product);
});

productsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  if (!req.body.title || !req.body.price) {
    return res.status(422).send({error: 'Title or price is required!'});
  }

  const productData: ProductWithOutId = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    image: req.file ? req.file.filename : null,
  };

  const product = await fileDb.addItem(productData);

  return res.send(product);
});

export default productsRouter;