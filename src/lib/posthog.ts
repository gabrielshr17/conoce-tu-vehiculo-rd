import posthog from 'posthog-js';

const key = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST;
export const posthogEnabled = Boolean(key && host);

if (!posthogEnabled) {
  if (import.meta.env.DEV) {
    console.error(
      new Error(
        `${!key ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!key ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} is configured`,
      ),
    );
  }
} else {
  posthog.init(key, {
    api_host: host,
    capture_pageview: 'history_change',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    defaults: '2026-05-30',
  });
}

export default posthog;
