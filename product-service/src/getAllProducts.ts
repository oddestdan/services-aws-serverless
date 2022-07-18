import { IProductService } from './types/products.type';
import { errorResponse, successResponse } from './utils/apiResponseBuilder';

export const getAllProductsHandler =
  (productService: IProductService) => async () => {
    try {
      const products = await productService.getAll();
      return successResponse(products);
    } catch (err) {
      return errorResponse(err);
    }
  };
