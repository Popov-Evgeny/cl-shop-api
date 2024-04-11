import * as crypto from 'crypto';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string | null;
}

export type ProductWithOutId = Omit<Product, 'id'>;