import {
  S3Client,
  DeleteBucketCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

async function teardownBucket() {
  try {
    console.log(`Tearing down bucket: ${BUCKET_NAME}...`);

    // List all objects
    const listObjects = await s3Client.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME }));

    if (listObjects.Contents && listObjects.Contents.length > 0) {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: listObjects.Contents.map((obj) => ({ Key: obj.Key })),
        },
      };

      await s3Client.send(new DeleteObjectsCommand(deleteParams));
      console.log(`Deleted ${listObjects.Contents.length} objects.`);
    }

    // Delete bucket
    await s3Client.send(new DeleteBucketCommand({ Bucket: BUCKET_NAME }));
    console.log('Bucket deleted successfully.');
  } catch (error) {
    if (error instanceof Error && error.name === 'NoSuchBucket') {
      console.log('Bucket does not exist.');
    } else {
      console.error('Error tearing down bucket:', error);
      process.exit(1);
    }
  }
}

teardownBucket();
