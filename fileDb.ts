import {promises as fs} from 'fs';
import {Product, ProductWithOutId} from './types';
import crypto from 'crypto';

const filename = './db.json';
let data: Product[] = [];

const fileDb = {
  async init() {
    try {
      const fileContentes = await fs.readFile(filename);
      data = JSON.parse(fileContentes.toString());
    } catch (e) {
      data = [];
    }
  },
  async getItems() {
    return data;
  },
  async getItemById(id: string) {
    return data.find(product => product.id === id);
  },
  async addItem(item: ProductWithOutId) {
    const product = {
      id: crypto.randomUUID(),
      ...item
    };
    data.push(product);
    await this.save();
    return product;
  },
  async save() {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
  }
}

export default fileDb;