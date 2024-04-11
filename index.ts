import express from "express";
import cors from "cors";
import productsRouter from './routes/products';
import mongoose from 'mongoose';
import config from './config';


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/products', productsRouter);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`Port: ${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();