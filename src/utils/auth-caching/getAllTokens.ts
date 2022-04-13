import { ScanCommand, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import dbDocClient from './dbDocClient';

export default async function getAllTokens(): Promise<
  [undefined, ScanCommandOutput] | [Error]
> {
  try {
    const res = await dbDocClient().send(
      new ScanCommand({ TableName: `${process.env.TOKEN_CACHE_DB}` })
    );

    return [undefined, res];
  } catch (err) {
    return [err as Error];
  }
}
