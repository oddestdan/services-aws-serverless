import { winstonLogger } from '../utils/winstonLogger';

enum EffectType {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

const generatePolicy = (
  principalId: string,
  Resource: string,
  Effect = EffectType.ALLOW
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

export const basicAuthorizer = () => async (event, _, cb) => {
  winstonLogger.logInfo(`Authorization event: ${JSON.stringify(event)}`);
  const authToken = event.authorizationToken;

  if (!authToken) {
    return cb(`Unauthorized: Authorization Header is missing`);
  }

  try {
    const encodedCreds = authToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const [username, password] = plainCreds;

    if (!username || !password) {
      return cb(`Forbidden`);
    }

    winstonLogger.logInfo(
      `Retrieved username: ${username} and password: ${password}`
    );

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password
        ? EffectType.DENY
        : EffectType.ALLOW;

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    winstonLogger.logInfo(`Generated policy: ${JSON.stringify(policy)}`);

    return cb(null, policy);
  } catch (error) {
    return cb(`Unauthorized: ${error.message}`);
  }
};
