import { CreateProductSchema, IProductService } from '../types/products.type';
import { errorResponse, successResponse } from '../utils/apiResponseBuilder';
import { winstonLogger } from '../utils/winstonLogger';

export const createProductHandler =
  (productService: IProductService) => async (event) => {
    try {
      winstonLogger.logInfo(`Incoming event: ${JSON.stringify(event)}`);
      const productBody = JSON.parse(event.body);

      const validationResult = CreateProductSchema.validate(productBody);

      if (validationResult.error) {
        winstonLogger.logInfo(
          `Validation error: ${JSON.stringify(validationResult)}`
        );

        return successResponse({ message: 'Invalid product data' }, 400);
      }
      const product = await productService.create(productBody);
      winstonLogger.logInfo(`Created product: ${JSON.stringify(product)}`);
      return successResponse(product);
    } catch (err) {
      return errorResponse(err);
    }
  };
