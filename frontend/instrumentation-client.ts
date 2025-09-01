// Enforce client-only initialization to prevent SSR errors
async function initPostHog() {
  if (typeof window === 'undefined') return;
  try {
    const mod = await import('posthog-js');
    const posthog = mod.default;
    
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: '/ingest',
        ui_host: 'https://eu.posthog.com',
        defaults: '2025-05-24',
        capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
        debug: process.env.NODE_ENV === 'development',
      });
    }
  } catch (error) {
    // Swallow initialization errors - analytics shouldn't break the app
  }
}

void initPostHog();
