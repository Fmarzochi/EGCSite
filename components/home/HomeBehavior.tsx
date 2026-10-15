'use client';

import { useEffect } from 'react';
import { initHome } from '@/components/home/home-behavior';

// Runs the home script once the server-rendered page is hydrated. Renders nothing itself.
export default function HomeBehavior({ texts }: { texts: Record<string, string> }) {
  useEffect(() => {
    // Strict mode runs effects twice in development; the script must attach its listeners once.
    const root = document.documentElement;
    if (root.dataset.homeReady === 'true') return;
    root.dataset.homeReady = 'true';
    initHome(texts);
  }, [texts]);

  return null;
}
