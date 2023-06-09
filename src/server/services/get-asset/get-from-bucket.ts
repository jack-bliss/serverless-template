import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { NotFoundError } from './not-found-error';
import { BaseRegion } from '../../../../infra/base-region';

const client = new S3Client({
  region: BaseRegion,
});

export async function getFromBucket(path: string) {
  const params = {
    Bucket: process.env.BUCKET,
    Key: path.startsWith('/') ? path.replace('/', '') : path,
  };
  try {
    const { Body } = (await client.send(new GetObjectCommand(params))) as {
      Body: Readable;
    };
    if (!Body) {
      throw new Error(`Couldn't get asset!`);
    }
    return await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      Body.on('data', (chunk) => chunks.push(chunk));
      Body.on('error', reject);
      Body.on('end', () => resolve(Buffer.concat(chunks)));
    });
  } catch (error) {
    if (error instanceof NoSuchKey) {
      throw new NotFoundError(path);
    }
    throw error;
  }
}
