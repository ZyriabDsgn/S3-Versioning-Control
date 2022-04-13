import getAllTokens from './getAllTokens';

export default async function getExistingToken(): Promise<
  [undefined, string] | [Error]
> {
  try {
    const [error, tokens] = await getAllTokens();

    if (error) throw error;

    if (tokens.Items?.length! > 0) {
      return [undefined, tokens.Items![0].token];
    }

    return [undefined, ''];
  } catch (err) {
    return [err as Error];
  }
}
