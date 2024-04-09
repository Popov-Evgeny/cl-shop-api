import express from 'express';
import {ProductWithOutId} from '../types';
import {imagesUpload} from '../multer';
import mysqlDb from '../mysqlDb';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const [result] = await mysqlDb.getConnection().query(
      'SELECT p.id, p.title, p.price, p.description, c.name category_name, p.image FROM products p ' +
      'LEFT JOIN shop.categories c on c.id = p.category_id;'
    );
    return res.send(result);
  } catch (e) {
    next(e);
  }
});

productsRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const [result] = await mysqlDb.getConnection().query(`SELECT * FROM products WHERE id = ${id}`) as RowDataPacket[];

  const product = result[0];

  if (!product) {
    return res.status(404).send({error: 'Not found!'});
  }

  return res.send(product);
});

productsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    if (!req.body.categoryId || !req.body.title || !req.body.price) {
      return res.status(422).send({error: 'Fields is required!'});
    }

    const productData: ProductWithOutId = {
      categoryId: req.body.categoryId,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
    };

    const [result] = await mysqlDb.getConnection().query(
      'INSERT INTO products (category_id, title, price, description, image)' +
      'VALUES (?, ?, ?, ?, ?)',
      [productData.categoryId, productData.title, productData.price, productData.description, productData.image]
    ) as ResultSetHeader[];

    return res.send({
      id: result.insertId,
      ...productData
    });
  } catch (e) {
    next(e);
  }
});

export default productsRouter;