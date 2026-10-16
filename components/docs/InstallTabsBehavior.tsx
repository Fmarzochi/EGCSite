'use client';

import { useEffect } from 'react';

// Install method tabs of the Get Started page, ported from the get-started.astro script and
// moved to the WAI-ARIA tabs pattern: aria-selected, roving tabindex, arrows, Home and End.
// The tabs and panels are server-rendered; this only switches them. Renders nothing itself.
export default function InstallTabsBehavior() {
  useEffect(() => {
    const tabs = Array.from(document.querySelectorAll<HTMLElement>('.install-tab'));
    const panels = document.querySelectorAll<HTMLElement>('.install-panel');
    if (!tabs.length) return;

    const select = (tab: HTMLElement, focus: boolean) => {
      const target = tab.dataset.tab;

      // Deactivate all
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
      });
      panels.forEach((p) => p.classList.add('hidden'));

      // Activate selected
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.tabIndex = 0;
      document.getElementById(`panel-${target}`)?.classList.remove('hidden');
      if (focus) tab.focus();

      // Scroll active tab into view on mobile
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      tab.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    };

    const handlers = tabs.map((tab, index) => {
      const onClick = () => select(tab, false);
      const onKeyDown = (event: KeyboardEvent) => {
        const last = tabs.length - 1;
        const next =
          event.key === 'ArrowRight'
            ? (index + 1) % tabs.length
            : event.key === 'ArrowLeft'
              ? (index - 1 + tabs.length) % tabs.length
              : event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? last
                  : null;
        const nextTab = next === null ? undefined : tabs[next];
        if (!nextTab) return;
        event.preventDefault();
        select(nextTab, true);
      };
      tab.addEventListener('click', onClick);
      tab.addEventListener('keydown', onKeyDown);
      return () => {
        tab.removeEventListener('click', onClick);
        tab.removeEventListener('keydown', onKeyDown);
      };
    });

    return () => handlers.forEach((off) => off());
  }, []);

  return null;
}
