import { winstonLogger } from '../utils/winstonLogger';

export const basicAuthorizer = () => async (event) => {
  winstonLogger.logInfo(
    `Authorization event: ${JSON.stringify(event.queryStringParameters)}`
  );
};
