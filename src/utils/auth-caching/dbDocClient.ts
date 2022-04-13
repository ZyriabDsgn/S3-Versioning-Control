import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dbClient from './dbClient'

export default function dbDocClient() {
  return DynamoDBDocumentClient.from(dbClient());
}