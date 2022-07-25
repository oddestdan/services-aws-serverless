import { IProductService } from './types/products.type';
import { errorResponse, successResponse } from './utils/apiResponseBuilder';
import { winstonLogger } from './utils/winstonLogger';

export const getAllProductsHandler =
  (productService: IProductService) => async (event) => {
    try {
      winstonLogger.logInfo(`Incoming event: ${JSON.stringify(event)}`);
      const products = await productService.getAll();
      winstonLogger.logInfo(`"Received products: ${JSON.stringify(products)}`);
      return successResponse(products);
    } catch (err) {
      return errorResponse(err);
    }
  };
