import * as crypto from 'crypto';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string | null;
}

export type ProductWithOutId = Omit<Product, 'id'>;