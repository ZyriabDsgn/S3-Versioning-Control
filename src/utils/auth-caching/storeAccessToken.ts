import { PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import dbDocClient from './dbDocClient';

export default async function storeAuthToken(
  token: string
): Promise<[undefined, PutCommandOutput] | [Error]> {
  try {
    const res = await dbDocClient().send(
      new PutCommand({
        TableName: `${process.env.TOKEN_CACHE_DB}`,
        Item: { token },
      })
    );

    return [undefined, res];
  } catch (err) {
    return [err as Error];
  }
}
