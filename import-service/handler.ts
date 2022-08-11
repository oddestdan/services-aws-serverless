import AWS from 'aws-sdk';
import * as handlers from './src/functions';

const s3 = new AWS.S3({ region: 'us-east-1' });

export const importProductsFile = handlers.importProductsFile(s3);
export const importFileParser = handlers.importFileParser(s3);
