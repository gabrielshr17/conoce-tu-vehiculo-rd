/**
 * Best-effort: un fallo aquí no debe bloquear el flujo de sign-in.
 * El backend vuelve a verificar `accessToken` contra Google antes de enviar nada.
 */
export function sendWelcomeEmail(accessToken: string): void {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!apiBaseUrl) return;

  fetch(`${apiBaseUrl}/api/welcome-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken }),
  }).catch((err) => console.error('welcome email request failed', err));
}
