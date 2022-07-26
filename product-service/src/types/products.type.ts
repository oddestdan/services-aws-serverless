import Joi from 'joi';

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
  image: string;
}

export interface ISeparateProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export const CreateProductSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  price: Joi.number,
  image: Joi.string().pattern(new RegExp('/(https?://.*.(?:png|jpg))/i')),
  count: Joi.number,
});

export interface ISeparateStock {
  product_id: string;
  count: number;
}

export interface IProductService {
  getById: (id: string) => Promise<IProduct>;
  getAll: () => Promise<IProduct[]>;
  create: (product: Omit<IProduct, 'id'>) => Promise<IProduct>;
}
