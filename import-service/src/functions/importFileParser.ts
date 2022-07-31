import csv from 'csv-parser';
import { winstonLogger } from '../utils/winstonLogger';

export const importFileParser = (s3) => async (event) => {
  winstonLogger.logInfo(
    `Parsing file event records: ${JSON.stringify(event.Records)}`
  );

  event.Records.filter((record) => !!record.s3.object.size).forEach(
    async (record) => {
      const {
        bucket: { name: bucketName },
        object: { key: objectKey },
      } = record.s3;

      winstonLogger.logInfo(`
					Creating a stream off of object: ${JSON.stringify({
            bucket: bucketName,
            keyFrom: objectKey,
            keyTo: objectKey.replace('uploaded', 'parsed'),
          })}
				`);

      const s3Stream = s3
        .getObject({
          Bucket: bucketName,
          Key: objectKey,
        })
        .createReadStream();

      s3Stream
        .pipe(csv())
        .on('error', (error) => {
          winstonLogger.logError(error);
        })
        .on('data', (data) => {
          winstonLogger.logInfo(data);
        })
        .on('end', async () => {
          winstonLogger.logInfo(`Copy from ${bucketName}/${objectKey}`);

          await s3
            .copyObject({
              Bucket: bucketName,
              CopySource: `${bucketName}/${objectKey}`,
              Key: objectKey.replace('uploaded', 'parsed'),
            })
            .promise();

          winstonLogger.logInfo(
            `Copied into ${bucketName}/${objectKey.replace(
              'uploaded',
              'parsed'
            )}`
          );
        });
    }
  );
};
