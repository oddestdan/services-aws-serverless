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

export interface ISeparateStock {
  product_id: string;
  count: number;
}

export interface IProductService {
  getById: (id: string) => Promise<IProduct>;
  getAll: () => Promise<IProduct[]>;
  create: (product: Omit<IProduct, 'id'>) => Promise<IProduct>;
}
