'use client';

import { useEffect } from 'react';

// Install method tabs of the Get Started page, ported from the get-started.astro script.
// The tabs and panels are server-rendered; this only switches them. Renders nothing itself.
export default function InstallTabsBehavior() {
  useEffect(() => {
    const tabs = document.querySelectorAll<HTMLElement>('.install-tab');
    const panels = document.querySelectorAll<HTMLElement>('.install-panel');
    if (!tabs.length) return;

    const handlers = Array.from(tabs, (tab) => {
      const onClick = () => {
        const target = tab.dataset.tab;

        // Deactivate all
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        });
        panels.forEach((p) => p.classList.add('hidden'));

        // Activate selected
        tab.classList.add('active');
        tab.setAttribute('aria-pressed', 'true');
        document.getElementById(`panel-${target}`)?.classList.remove('hidden');

        // Scroll active tab into view on mobile
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        tab.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
      };
      tab.addEventListener('click', onClick);
      return () => tab.removeEventListener('click', onClick);
    });

    return () => handlers.forEach((off) => off());
  }, []);

  return null;
}
