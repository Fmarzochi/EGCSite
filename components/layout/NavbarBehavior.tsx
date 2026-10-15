'use client';

import { useEffect } from 'react';
import { isolateBackground, trapTab } from '@/lib/isolate';
import { documentLang, siteText } from '@/lib/site-i18n';

// Mobile drawer and hide-on-scroll header for Navbar.tsx, ported from the Navbar.astro script.
// It enhances the server-rendered markup and renders nothing itself.
export default function NavbarBehavior() {
  useEffect(() => {
    const button = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-backdrop');
    const header = document.getElementById('site-header');
    if (!button || !menu || !backdrop || !header) return;
    let restoreBackground: (() => void) | null = null;
    const timers: number[] = [];

    const isOpen = () => button.getAttribute('aria-expanded') === 'true';
    const shown = ['opacity-100', 'pointer-events-auto', 'visible'];
    const hidden = ['opacity-0', 'pointer-events-none', 'invisible'];

    function openMenu() {
      button!.setAttribute('aria-expanded', 'true');
      button!.setAttribute('aria-label', siteText(documentLang()).nav.closeMenu);
      menu!.classList.remove(...hidden);
      menu!.classList.add(...shown);
      menu!.removeAttribute('inert');
      menu!.setAttribute('aria-hidden', 'false');
      backdrop!.classList.remove(...hidden);
      backdrop!.classList.add(...shown);
      document.body.style.overflow = 'hidden';

      const links = Array.from(menu!.querySelectorAll<HTMLElement>('.mobile-nav-link'));
      const firstLink = links[0];
      firstLink?.style.removeProperty('opacity');
      firstLink?.style.removeProperty('transform');
      menu!.focus();
      restoreBackground = isolateBackground([menu!, button!, backdrop!]);
      timers.push(window.setTimeout(() => {
        if (isOpen() && document.activeElement === menu) firstLink?.focus();
      }, 0));
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      links.forEach((el, i) => {
        if (i === 0) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(-8px)';
        timers.push(window.setTimeout(() => {
          el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 50 + i * 40));
      });
    }

    function closeMenu(restoreFocus = false) {
      restoreBackground?.();
      restoreBackground = null;
      button!.setAttribute('aria-expanded', 'false');
      button!.setAttribute('aria-label', siteText(documentLang()).nav.openMenu);
      menu!.classList.add(...hidden);
      menu!.classList.remove(...shown);
      menu!.setAttribute('inert', '');
      menu!.setAttribute('aria-hidden', 'true');
      backdrop!.classList.add(...hidden);
      backdrop!.classList.remove(...shown);
      document.body.style.overflow = '';
      if (restoreFocus) button!.focus();
    }

    const onButton = () => (isOpen() ? closeMenu(true) : openMenu());
    const onBackdrop = () => closeMenu(true);
    const onMenuClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest('a')) closeMenu(true);
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') closeMenu(true);
      if (e.key === 'Tab') trapTab(e, menu, Array.from(menu.querySelectorAll<HTMLElement>('a')));
    };
    const onResize = () => {
      if (window.innerWidth >= 1024 && isOpen()) {
        const focusWasInMenu = menu.contains(document.activeElement);
        closeMenu();
        if (focusWasInMenu) document.querySelector<HTMLElement>('#site-header a')?.focus();
      }
    };

    // Hide on scroll down, reveal on scroll up. Small deltas are ignored so trackpad
    // jitter does not make the header flicker; work is batched into one frame.
    const SCROLL_DELTA = 8;
    let lastScrollY = window.scrollY;
    let headerHidden = false;
    let scrollTicking = false;

    function setHeaderHidden(value: boolean) {
      if (value === headerHidden) return;
      headerHidden = value;
      header!.classList.toggle('-translate-y-full', value);
      header!.classList.toggle('translate-y-0', !value);
    }

    function updateHeader() {
      scrollTicking = false;
      const currentScrollY = window.scrollY;
      if (isOpen() || currentScrollY <= 64) {
        setHeaderHidden(false);
        lastScrollY = currentScrollY;
        return;
      }
      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) < SCROLL_DELTA) return;
      setHeaderHidden(delta > 0);
      lastScrollY = currentScrollY;
    }

    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(updateHeader);
    };
    const onHeaderFocus = () => setHeaderHidden(false);

    button.addEventListener('click', onButton);
    backdrop.addEventListener('click', onBackdrop);
    menu.addEventListener('click', onMenuClick);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    header.addEventListener('focusin', onHeaderFocus);

    return () => {
      if (isOpen()) closeMenu();
      timers.forEach((t) => window.clearTimeout(t));
      button.removeEventListener('click', onButton);
      backdrop.removeEventListener('click', onBackdrop);
      menu.removeEventListener('click', onMenuClick);
      document.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      header.removeEventListener('focusin', onHeaderFocus);
    };
  }, []);

  return null;
}
