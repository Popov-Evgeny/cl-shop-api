import mongoose from "mongoose";
import config from './config';
import Category from './models/Category';
import Product from './models/Product';
import User from './models/User';

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch(e) {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};

const collections = ['products', 'categories', 'users'];

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  for (const collection of collections) {
    await dropCollection(db, collection);
  }

  const [cpuCategory, ssdCategory] = await Category.create({
    title: 'CPUs',
    description: 'Central Processing Units',
  },{
    title: 'SSDs',
    description: 'Solid State Drives',
  });

  await Product.create({
    title: 'Intel Core i7',
    price: 450,
    category: cpuCategory,
    image: 'fixtures/cpu.jpg',
  },{
    title: 'Samsung 990 Pro 1TB',
    price: 150,
    category: ssdCategory,
    image: 'fixtures/ssd.jpg',
  });

  await User.create({
    username: 'user',
    password: '123Qwerty%',
    token: crypto.randomUUID(),
  });

  await db.close();
};

void run();