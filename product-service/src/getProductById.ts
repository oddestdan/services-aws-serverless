import { IProductService } from './services/products.type';
import { errorResponse, successResponse } from './utils/apiResponseBuilder';

export const getProductByIdHandler =
  (productService: IProductService) => async (event) => {
    try {
      const product = await productService.getById(
        event.pathParameters.productId || ''
      );

      if (!product)
        return successResponse({ message: 'Product not found' }, 404);

      return successResponse({ product });
    } catch (err) {
      return errorResponse(err);
    }
  };
