export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface CredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize(config: { client_id: string; callback: (response: CredentialResponse) => void }): void;
  renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

function waitForGoogleIdentity(timeoutMs = 5000): Promise<GoogleAccountsId | null> {
  if (window.google) return Promise.resolve(window.google.accounts.id);

  return new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        resolve(window.google.accounts.id);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  });
}

function profileFromCredential(credential: string): GoogleProfile {
  const payload = credential.split('.')[1];
  const json = decodeURIComponent(
    atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      .split('')
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  );
  const claims = JSON.parse(json) as { sub: string; email: string; name: string; picture?: string };
  return { id: claims.sub, email: claims.email, name: claims.name, picture: claims.picture };
}

/**
 * Monta el botón oficial de Google en `container`. Simular un clic sobre un
 * botón renderizado por Google no funciona (vive en un iframe de otro origen),
 * así que el botón real es la única UI de entrada soportada.
 */
export async function renderGoogleSignInButton(
  container: HTMLElement,
  onSuccess: (profile: GoogleProfile) => void,
): Promise<void> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  if (!clientId) return;

  const accountsId = await waitForGoogleIdentity();
  if (!accountsId) return;

  accountsId.initialize({
    client_id: clientId,
    callback: (response) => onSuccess(profileFromCredential(response.credential)),
  });
  accountsId.renderButton(container, {
    type: 'standard',
    theme: 'filled_blue',
    size: 'large',
    text: 'continue_with',
    shape: 'pill',
  });
}
