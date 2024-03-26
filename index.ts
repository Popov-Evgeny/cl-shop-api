import express from "express";
import productsRouter from './routes/products';
import fileDb from './fileDb';

const app = express();
const port = 8000;

app.use(express.json());
app.use('/products', productsRouter);


const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`Port: ${port}`);
  });
};

void run();