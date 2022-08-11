import { CreateProductSchema, IProductService } from '../types/products.type';
import {
  errorResponse,
  IResponse,
  successResponse,
} from '../utils/apiResponseBuilder';
import { winstonLogger } from '../utils/winstonLogger';

import { SNS } from 'aws-sdk';

export const catalogBatchProcessHandler =
  (productService: IProductService) => async (event) => {
    const snsInstance = new SNS();
    const snsTopic = process.env.SNS_ARN;

    try {
      winstonLogger.logInfo(`Incoming event: ${JSON.stringify(event)}`);
      const products = event.Records.map(({ body }) => JSON.parse(body));

      const results: IResponse[] = products.map(async (productBody) => {
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
      });

      if (results.some((r) => r.statusCode === 400)) {
        return successResponse({ message: 'Invalid product data' }, 400);
      }

      winstonLogger.logInfo(
        `Sending ${snsTopic} SNS notification for ${products}`
      );
      await snsInstance
        .publish({
          TopicArn: snsTopic,
          Subject: 'Batch created',
          Message: results.map((r) => r.body).join(' --- '),
        })
        .promise();

      return successResponse(results);
    } catch (err) {
      return errorResponse(err);
    }
  };
