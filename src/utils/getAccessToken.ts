import fetch from 'cross-fetch';

export default async function getAccessToken(): Promise<
  [undefined, string] | [Error]
> {
  try {
    const reqBody = {
      client_id: process.env.AUTH0_ID,
      client_secret: process.env.AUTH0_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: 'client_credentials',
    };

    const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    return [undefined, resData.access_token];
  } catch (err) {
    return [err as Error];
  }
}
