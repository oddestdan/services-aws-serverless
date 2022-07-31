interface IResponse {
  statusCode: number;
  headers: Object;
  body: Object;
}

const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
};

const errorResponse = (error: Error, statusCode: number = 500): IResponse => {
  return {
    statusCode,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({ message: error.message || 'Error' }),
  };
};

const successResponse = (body: Object, statusCode: number = 200): IResponse => {
  return {
    statusCode,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(body),
  };
};

export { errorResponse, successResponse, IResponse };
