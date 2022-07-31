import * as handlers from './src/functions';
import { ProductService } from './src/services/product-service';
// import { seedProducts } from './src/services/seed-products';

// pooling connection is moved into lambdas
// https://github.com/brianc/node-postgres/issues/1206#issuecomment-375021365
const productService = new ProductService();

// seed database with mock data
// seedProducts();

export const getProductById = handlers.getProductByIdHandler(productService);
export const getAllProducts = handlers.getAllProductsHandler(productService);
export const createProduct = handlers.createProductHandler(productService);
