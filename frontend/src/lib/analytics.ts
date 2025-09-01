// SSR-safe analytics helper: dynamically load posthog only in the browser
export async function captureEvent(event: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return; // no-op on server/SSR
  try {
    const mod = await import('posthog-js');
    const posthog = mod.default;
    posthog.capture(event, properties);
  } catch {
    // swallow analytics errors
  }
}

// SSR-safe identify helper
export async function identify(
  id: string | null,
  properties?: Record<string, any> | null
) {
  if (typeof window === 'undefined') return; // no-op on server/SSR
  try {
    const mod = await import('posthog-js');
    const posthog = mod.default;
    if (id) {
      posthog.identify(id, properties || undefined);
    } else {
      posthog.reset();
    }
  } catch {
    // swallow analytics errors
  }
}
