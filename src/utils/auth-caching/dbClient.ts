import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export default function dbClient() {
  return new DynamoDBClient({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}
