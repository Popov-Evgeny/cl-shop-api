import { Model } from 'mongoose';

export interface ProductMutation {
  category: string;
  title: string;
  price: number;
  description: string;
  image: string | null;
}

export interface UserFields {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName?: string;
  googleID?: string;
}

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, unknown, UserMethods>;
