import { IProductService } from '../types/products.type';
import { errorResponse, successResponse } from '../utils/apiResponseBuilder';
import { winstonLogger } from '../utils/winstonLogger';

export const getProductByIdHandler =
  (productService: IProductService) => async (event) => {
    try {
      winstonLogger.logInfo(`Incoming event: ${JSON.stringify(event)}`);

      const product = await productService.getById(
        event.pathParameters.productId || ''
      );

      winstonLogger.logInfo(
        `"Received product with id: ${
          event.pathParameters.productId || ''
        }: ${JSON.stringify(product)}`
      );

      if (!product)
        return successResponse({ message: 'Product not found' }, 404);

      return successResponse({ product });
    } catch (err) {
      return errorResponse(err);
    }
  };
