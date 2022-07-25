export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
  image: string;
}

export interface IProductService {
  getById: (id: string) => Promise<IProduct>;
  getAll: () => Promise<IProduct[]>;
  create: (product: Omit<IProduct, 'id'>) => Promise<IProduct>;
}
