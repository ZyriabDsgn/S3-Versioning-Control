import jwt_decode from 'jwt-decode';

export default function hasTokenExpired(token: string) {
  try {
    const decoded = jwt_decode(token) as { exp: number; iat: number };

    if (decoded) {
      return [undefined, decoded.exp < new Date().getTime() / 1000];
    }

    return [undefined, false];
  } catch (err) {
    return [err as Error];
  }
}
