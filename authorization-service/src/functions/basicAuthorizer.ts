import { successResponse } from '../utils/apiResponseBuilder';
import { winstonLogger } from '../utils/winstonLogger';

const generatePolicy = (
  principalId: string,
  Resource: string,
  Effect = 'Allow'
) => {
  return {
    principalId,
    policyDocument: {
      Version: '2021-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource,
        },
      ],
    },
  };
};

export const basicAuthorizer = () => async (event) => {
  winstonLogger.logInfo(`Authorization event: ${JSON.stringify(event)}`);

  try {
    const authToken = event.authorizationToken;

    const encodedCreds = authToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const [username, password] = plainCreds;

    winstonLogger.logInfo(
      `Retrieved username: ${username} and password: ${password}`
    );

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    if (effect === 'Deny') {
      return successResponse({ message: `Forbidden` }, 403);
    }

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    winstonLogger.logInfo(`Generated policy: ${JSON.stringify(policy)}`);

    return successResponse(policy);
  } catch (error) {
    return successResponse({ message: `Unauthorized: ${error.message}` }, 401);
  }
};
