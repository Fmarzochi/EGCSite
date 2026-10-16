'use client';

import { useEffect } from 'react';
import { initHall } from '@/components/contributors/hall-behavior';

// Runs the Hall of Fame script once the server-rendered page is hydrated. Renders nothing itself.
export default function HallBehavior() {
  useEffect(() => {
    // Strict mode runs effects twice in development; the listeners must be attached once.
    const root = document.querySelector<HTMLElement>('.hall');
    if (!root || root.dataset.ready === 'true') return;
    root.dataset.ready = 'true';
    initHall();
  }, []);

  return null;
}
