import { IProductService, IProduct } from '../types/products.type';
import { v4 as uuidv4 } from 'uuid';

import products from './products-data.json';

class StaticProductService implements IProductService {
  getById(id: string) {
    return Promise.resolve(products.find((product) => product.id === id));
  }

  getAll() {
    return Promise.resolve(products);
  }

  create(
    product: Pick<
      IProduct,
      'title' | 'description' | 'price' | 'image' | 'count'
    >
  ) {
    products.push({
      id: uuidv4(),
      ...product,
    });
    return Promise.resolve(products[products.length - 1]);
  }
}

export { StaticProductService };
