import * as handlers from './src';
import { Client } from 'pg';
// import { StaticProductService } from './src/services/static-product-service';
import { ProductService } from './src/services/product-service';
// import { seedProducts } from './src/services/seed-products';

const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env;

const dbClient = new Client({
  host: PGHOST,
  user: PGUSER,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: Number(PGPORT),
});
dbClient.connect();
// const productService = new StaticProductService();
const productService = new ProductService(dbClient);

// seed database with mock data
// seedProducts(dbClient);

export const getProductById = handlers.getProductByIdHandler(productService);
export const getAllProducts = handlers.getAllProductsHandler(productService);
export const createProduct = handlers.createProductHandler(productService);
