import csv from 'csv-parser';
import { winstonLogger } from '../utils/winstonLogger';
import { errorResponse, successResponse } from '../utils/apiResponseBuilder';

import type { S3Event } from 'aws-lambda';
import type { Readable } from 'stream';
import { S3 } from 'aws-sdk';

function processRecordsFromStream(
  stream: Readable,
  processRecord: (record: Record<string, unknown>) => Promise<void>
) {
  const chunks: Promise<void>[] = [];

  stream.on('data', (data) => {
    chunks.push(processRecord(data));
  });

  return new Promise<void>((resolve, reject) => {
    stream
      .on('end', async () => {
        await Promise.allSettled(chunks);
        resolve();
      })
      .on('error', reject);
  });
}

export const importFileParser = (s3: S3) => async (event: S3Event) => {
  winstonLogger.logInfo(
    `START Parse file event records: ${JSON.stringify(event.Records)}`
  );

  try {
    const fileRecords = event.Records.filter(
      (record) => !!record.s3.object.size
    );

    const fileRecordProcessing = fileRecords.map(
      ({
        s3: {
          bucket: { name: bucketName },
          object: { key: objectKey },
        },
      }) => {
        const csvS3Stream = s3
          .getObject({ Bucket: bucketName, Key: objectKey })
          .createReadStream()
          .pipe(csv());

        return processRecordsFromStream(csvS3Stream, async (product) => {
          winstonLogger.logInfo(
            `END Parsed product: ${JSON.stringify(product)}`
          );

          winstonLogger.logInfo(`START Copy from ${bucketName}/${objectKey}`);
          await s3
            .copyObject({
              Bucket: bucketName,
              CopySource: `${bucketName}/${objectKey}`,
              Key: objectKey.replace('uploaded', 'parsed'),
            })
            .promise();
          winstonLogger.logInfo(
            `END Copied into ${bucketName}/${objectKey.replace(
              'uploaded',
              'parsed'
            )}`
          );

          winstonLogger.logInfo(`START Delete from ${bucketName}/${objectKey}`);
          await s3
            .deleteObject({
              Bucket: bucketName,
              Key: objectKey,
            })
            .promise();
          winstonLogger.logInfo(`END Deleted from ${bucketName}/${objectKey}`);
        });
      }
    );

    await Promise.allSettled(fileRecordProcessing);
    return successResponse({
      message: 'Products parsed and moved from',
    });
  } catch (error) {
    winstonLogger.logError(JSON.stringify(error));
    return errorResponse(error);
  }
};
