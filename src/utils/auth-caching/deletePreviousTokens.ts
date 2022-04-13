import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import dbDocClient from './dbDocClient';
import getAllTokens from './getAllTokens';

// eslint-disable-next-line consistent-return
export default async function deletePreviousTokens() {
  try {
    const client = dbDocClient();
    const [error, tokens] = await getAllTokens();

    if (error) throw error;

    if (tokens.Items) {
      tokens.Items.forEach(async (row) => {
        await client.send(
          new DeleteCommand({
            TableName: `${process.env.TOKEN_CACHE_DB}`,
            Key: { token: row.token },
          })
        );
      });
    }
  } catch (err) {
    return [err as Error];
  }
}
