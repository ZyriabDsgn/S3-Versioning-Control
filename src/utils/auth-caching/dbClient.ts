import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export default function dbClient() {
  return new DynamoDBClient({
    region: process.env.DB_REGION!,
    credentials: {
      accessKeyId: process.env.DB_ACCESS_KEY_ID!,
      secretAccessKey: process.env.DB_SECRET_ACCESS_KEY!,
    },
  });
}
