import express from "express";
import cors from "cors";
import productsRouter from './routes/products';
import mysqlDb from './mysqlDb';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/products', productsRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Port: ${port}`);
  });
};

void run();