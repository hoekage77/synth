'use client';

import { useEffect } from 'react';

export function PostHogProvider() {
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return;

    const initPostHog = async () => {
      try {
        const posthogModule = await import('posthog-js');
        const posthog = posthogModule.default;

        if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: '/ingest',
            ui_host: 'https://eu.posthog.com',
            defaults: '2025-05-24',
            capture_exceptions: true,
            debug: process.env.NODE_ENV === 'development',
          });
        }
      } catch (error) {
        console.warn('Failed to initialize PostHog:', error);
      }
    };

    initPostHog();
  }, []);

  return null; // This component doesn't render anything
}
