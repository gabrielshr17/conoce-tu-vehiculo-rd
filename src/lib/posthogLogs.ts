import posthog, { posthogEnabled } from './posthog.ts';

type LogAttributes = Record<string, string | number | boolean>;

export const posthogLogger = {
  info(body: string, attributes?: LogAttributes): void {
    if (!posthogEnabled) return;

    posthog.captureLog({ body, level: 'info', attributes });
  },
};
