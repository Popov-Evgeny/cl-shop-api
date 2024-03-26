import express from 'express';
import fileDb from '../fileDb';
import {ProductWithOutId} from '../types';

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

productsRouter.post('/', async (req, res) => {
  const productData: ProductWithOutId = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
  };

  const product = await fileDb.addItem(productData);

  return res.send(product);
});

export default productsRouter;