export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface TokenResponse {
  access_token: string;
  error?: string;
}

interface TokenClient {
  requestAccessToken(overridable?: { prompt?: string }): void;
}

interface GoogleOAuth2 {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    prompt?: string;
    callback: (response: TokenResponse) => void;
  }): TokenClient;
}

declare global {
  interface Window {
    google?: { accounts: { oauth2: GoogleOAuth2 } };
  }
}

function waitForGoogleIdentity(timeoutMs = 5000): Promise<GoogleOAuth2 | null> {
  if (window.google) return Promise.resolve(window.google.accounts.oauth2);

  return new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        resolve(window.google.accounts.oauth2);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  });
}

async function fetchProfile(accessToken: string): Promise<GoogleProfile> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await res.json()) as { sub: string; email: string; name: string; picture?: string };
  return { id: data.sub, email: data.email, name: data.name, picture: data.picture };
}

/**
 * El botón declarativo "Sign In With Google" (renderButton) reutiliza en
 * silencio la sesión de Google ya activa en el navegador —tanto con FedCM
 * como con su alternativa por iframe— sin mostrar nunca un selector. El flujo
 * OAuth2 con `prompt: 'select_account'` es la única vía documentada que
 * garantiza el selector de cuentas de Google en cada clic.
 */
export async function signInWithGoogle(
  onSuccess: (profile: GoogleProfile, accessToken: string) => void,
): Promise<void> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  if (!clientId) return;

  const oauth2 = await waitForGoogleIdentity();
  if (!oauth2) return;

  const client = oauth2.initTokenClient({
    client_id: clientId,
    scope: 'email profile',
    prompt: 'select_account',
    callback: async (response) => {
      if (response.error || !response.access_token) return;
      const profile = await fetchProfile(response.access_token);
      onSuccess(profile, response.access_token);
    },
  });
  client.requestAccessToken();
}
