'use client';

import { useEffect } from 'react';
import { identify } from '@/lib/analytics';
import { createClient } from '@/lib/supabase/client';

export const PostHogIdentify = () => {
  useEffect(() => {
    const supabase = createClient();
    const listener = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        void identify(session.user.id, { email: session.user.email });
      } else {
        void identify(null);
      }
    });

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  return null;
};
