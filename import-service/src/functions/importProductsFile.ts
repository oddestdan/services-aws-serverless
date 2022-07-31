import { errorResponse, successResponse } from '../utils/apiResponseBuilder';
import { winstonLogger } from '../utils/winstonLogger';

const BUCKET = process.env.BUCKET;

export const importProductsFile = (s3) => async (event) => {
  winstonLogger.logInfo(
    `Importing event named: ${JSON.stringify(event.queryStringParameters)}`
  );

  try {
    const fileName = event.queryStringParameters.name;
    const signedUrlKey = `uploaded/${fileName}`;

    const params = {
      Bucket: BUCKET,
      Key: signedUrlKey,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    return successResponse(url);
  } catch (error) {
    errorResponse(error);
  }
};
