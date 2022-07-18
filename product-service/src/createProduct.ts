import { IProductService } from './types/products.type';
import { errorResponse, successResponse } from './utils/apiResponseBuilder';

export const createProductHandler =
  (productService: IProductService) => async (event) => {
    try {
      const product = await productService.create(event.body);
      return successResponse(product);
    } catch (err) {
      return errorResponse(err);
    }
  };
