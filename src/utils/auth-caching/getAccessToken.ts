import fetch from 'cross-fetch';
import storeAuthToken from './storeAccessToken';
import getExistingToken from './getExistingToken';
import hasTokenExpired from './hasTokenExpired';
import deletePreviousTokens from './deletePreviousTokens';


export default async function getAuthToken(): Promise<
[undefined, string] | [Error]
> {
  try {
    const IS_DEV = process.env.NODE_ENV === 'development';
    
    if (!IS_DEV) {
      const [error, token] = await getExistingToken();

      if (error) throw error;

      if (token && !hasTokenExpired(token)) {
        return [undefined, token];
      }
    }

    const reqBody = {
      client_id: process.env.AUTH0_ID,
      client_secret: process.env.AUTH0_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: 'client_credentials',
    };

    const result = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      }
    );

    const resData = await result.json();

    if (!resData.access_token) {
      throw new Error('No Access Token returned');
    }

    if (!IS_DEV) {
      await deletePreviousTokens();
      await storeAuthToken(resData.access_token);
    }

    return [undefined, resData.access_token];
  } catch (err) {
    return [err as Error];
  }
}
