import { S3Client, CreateBucketCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3';
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

async function setupBucket() {
  try {
    console.log(`Setting up bucket: ${BUCKET_NAME}...`);

    // Create bucket
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log('Bucket created successfully.');
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === 'BucketAlreadyOwnedByYou' || err.name === 'BucketAlreadyExists')
      ) {
        console.log('Bucket already exists.');
      } else {
        throw err;
      }
    }

    // Configure CORS
    const corsParams = {
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    };

    await s3Client.send(new PutBucketCorsCommand(corsParams));
    console.log('CORS configuration applied successfully.');
  } catch (error) {
    console.error('Error setting up bucket:', error);
    process.exit(1);
  }
}

setupBucket();
