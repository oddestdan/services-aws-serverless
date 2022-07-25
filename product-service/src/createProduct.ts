import { IProductService } from './types/products.type';
import { errorResponse, successResponse } from './utils/apiResponseBuilder';
import { winstonLogger } from './utils/winstonLogger';

export const createProductHandler =
  (productService: IProductService) => async (event) => {
    try {
      winstonLogger.logInfo(`Incoming event: ${JSON.stringify(event)}`);
      const productBody = JSON.parse(event.body);

      // TODO: do validation
      if (!productBody)
        return successResponse({ message: 'Invalid product data' }, 404);

      const product = await productService.create(productBody);
      winstonLogger.logInfo(`Created product: ${JSON.stringify(product)}`);
      return successResponse(product);
    } catch (err) {
      return errorResponse(err);
    }
  };
