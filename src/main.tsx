import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import posthog, { posthogEnabled } from './lib/posthog.ts';
import { sessionRepository } from './storage';
import './ui/tokens.css';

const session = sessionRepository.get();
if (posthogEnabled && session?.id) {
  posthog.identify(session.id, { email: session.email, name: session.name });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
