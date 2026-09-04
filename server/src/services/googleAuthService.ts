export interface GoogleProfile {
  email?: string;
  name?: string;
}

export class InvalidAccessTokenError extends Error {}

/**
 * `accessToken` es un token opaco (no un JWT), así que no hay nada que
 * decodificar localmente: Google mismo lo valida en cada llamada.
 * tokeninfo confirma que el token se emitió para nuestro client_id;
 * userinfo, ya autenticado con ese token, entrega el perfil.
 */
export async function verifyAccessTokenAndGetProfile(
  accessToken: string,
  googleClientId: string,
): Promise<GoogleProfile> {
  const tokenInfoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
  );
  if (!tokenInfoRes.ok) throw new InvalidAccessTokenError('invalid access token');
  const tokenInfo = (await tokenInfoRes.json()) as { aud?: string };
  if (tokenInfo.aud !== googleClientId) throw new InvalidAccessTokenError('audience mismatch');

  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userInfoRes.ok) throw new InvalidAccessTokenError('failed to fetch profile');
  return userInfoRes.json() as Promise<GoogleProfile>;
}
