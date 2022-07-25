import * as handlers from './src';
import { StaticProductService } from './src/services/static-product-service';

const productService = new StaticProductService();

export const getProductById = handlers.getProductByIdHandler(productService);
export const getAllProducts = handlers.getAllProductsHandler(productService);
export const createProduct = handlers.createProductHandler(productService);
