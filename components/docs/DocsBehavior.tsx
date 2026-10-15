'use client';

import { useEffect } from 'react';
import { isolateBackground, trapTab } from '@/lib/isolate';

// Client behaviour of DocsShell, ported from the DocsLayout.astro script: generated TOC,
// copy buttons, section focus view and the mobile sidebar drawer. Renders nothing itself.

function setupDocsContent() {
  const content = document.querySelector<HTMLElement>('.docs-content');
  if (!content || content.dataset.enhanced === 'true') return;
  content.dataset.enhanced = 'true';
  document.querySelector<HTMLElement>('.docs-mobile-links [aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  const toc = document.querySelector<HTMLElement>('.docs-toc');
  const tocNav = toc?.querySelector<HTMLElement>('nav[data-generated="true"]');
  if (tocNav) {
    const headings = Array.from(content.querySelectorAll<HTMLElement>('h2'));
    if (headings.length < 2 && toc) toc.style.display = 'none';
    else {
      for (const heading of headings) {
        if (!heading.id) {
          const slug =
            heading.textContent?.trim().toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
            'section';
          let id = slug;
          let suffix = 2;
          while (document.getElementById(id)) id = `${slug}-${suffix++}`;
          heading.id = id;
        }
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.className = 'block py-1.5 pl-3 border-l border-[rgba(226,240,233,0.12)] text-xs text-[#8E9E96] hover:text-[#3DF69B] hover:border-[#3DF69B] transition-colors';
        link.textContent = heading.textContent?.trim() || heading.id;
        tocNav.appendChild(link);
      }
    }
  }
  for (const pre of content.querySelectorAll<HTMLPreElement>('pre')) {
    if (pre.closest('.snippet') || pre.closest('.docs-code-wrapper')) continue;
    const wrapper = document.createElement('div');
    wrapper.className = 'docs-code-wrapper';
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'docs-copy-code';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code');
    button.setAttribute('aria-live', 'polite');
    wrapper.appendChild(button);
  }
}

// Section focus view. The HTML always holds the whole page; this only hides the other
// sections while the URL hash points into one, so anchors, back/forward and no-JS keep working.
function focusRoot() {
  return document.querySelector<HTMLElement>('.docs-content[data-focus-sections]');
}

function focusableSections(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(':scope > section[id]'));
}

function hashTarget() {
  const id = decodeURIComponent(location.hash.slice(1));
  return id ? document.getElementById(id) : null;
}

function sectionLabel(section: HTMLElement) {
  const link = document.querySelector<HTMLAnchorElement>(`.docs-toc a[href="#${CSS.escape(section.id)}"]`);
  return link?.textContent?.trim() || section.querySelector('h2')?.textContent?.trim() || section.id;
}

function markActiveSection(id: string | undefined) {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('.docs-toc nav a, .docs-section-picker nav a')) {
    if (id && link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  const current = document.querySelector<HTMLElement>('[data-section-current]');
  const section = id ? document.getElementById(id) : null;
  if (current) current.textContent = section ? sectionLabel(section) : '';
}

function sectionLink(section: HTMLElement | undefined, rel: 'prev' | 'next') {
  if (!section) return '';
  const caption = rel === 'prev' ? '← Previous section' : 'Next section →';
  return `<a href="#${section.id}" rel="${rel}"><span>${caption}</span><strong></strong></a>`;
}

function clearSectionChrome(root: HTMLElement) {
  root.querySelector('.docs-section-bar')?.remove();
  root.querySelector('.docs-section-nav')?.remove();
}

function renderSectionChrome(root: HTMLElement, sections: HTMLElement[], active: HTMLElement) {
  clearSectionChrome(root);
  const index = sections.indexOf(active);
  const bar = document.createElement('div');
  bar.className = 'docs-section-bar';
  bar.innerHTML = '<span class="eyebrow"></span><button type="button" class="docs-section-full">Show full page</button>';
  const eyebrow = root.querySelector('.hero .eyebrow')?.textContent?.trim();
  bar.querySelector('.eyebrow')!.textContent = `${eyebrow ? `${eyebrow} · ` : ''}${index + 1} / ${sections.length}`;
  active.before(bar);
  const nav = document.createElement('nav');
  nav.className = 'docs-section-nav';
  nav.setAttribute('aria-label', 'Page sections');
  const previous = sections[index - 1];
  const next = sections[index + 1];
  nav.innerHTML = sectionLink(previous, 'prev') + sectionLink(next, 'next');
  nav.querySelector('[rel="prev"] strong')?.append(previous ? sectionLabel(previous) : '');
  nav.querySelector('[rel="next"] strong')?.append(next ? sectionLabel(next) : '');
  active.after(nav);
  return bar;
}

function focusAndReveal(element: HTMLElement, scrollTarget: HTMLElement = element) {
  if (!element.matches('a, button, input, select, textarea, summary, [tabindex]')) element.setAttribute('tabindex', '-1');
  element.focus({ preventScroll: true });
  scrollTarget.scrollIntoView({ block: 'start', behavior: 'instant' });
}

function applySectionFocus(moveFocus: boolean) {
  const root = focusRoot();
  if (!root) return;
  const sections = focusableSections(root);
  const target = hashTarget();
  const active = target ? sections.find((section) => section.contains(target)) : undefined;
  root.classList.toggle('is-section-focus', Boolean(active));
  for (const section of sections) section.hidden = Boolean(active) && section !== active;
  markActiveSection(active?.id);
  if (!active) {
    clearSectionChrome(root);
    return;
  }
  const bar = renderSectionChrome(root, sections, active);
  if (!moveFocus || !target) return;
  // A section link lands on the bar above the section; a deeper link (a method, a group) lands on itself.
  if (target === active) focusAndReveal(active.querySelector<HTMLElement>('h2') ?? active, bar);
  else focusAndReveal(target);
}

function showFullPage(root: HTMLElement) {
  const active = focusableSections(root).find((section) => !section.hidden);
  // history.state, not null: the Next.js router keeps its own entry state there.
  history.pushState(history.state, '', location.pathname + location.search);
  applySectionFocus(false);
  if (active) focusAndReveal(active.querySelector<HTMLElement>('h2') ?? active);
}

// Outside focus mode the TOC still marks the section being read.
function trackScrolledSection() {
  const root = focusRoot();
  if (!root || root.classList.contains('is-section-focus')) return;
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
  let currentId: string | undefined;
  for (const section of focusableSections(root)) {
    if (section.getBoundingClientRect().top - offset <= 1) currentId = section.id;
  }
  markActiveSection(currentId);
}

function setupSectionFocus() {
  const root = focusRoot();
  if (!root || root.dataset.focusReady === 'true') return;
  root.dataset.focusReady = 'true';
  applySectionFocus(Boolean(location.hash));
  trackScrolledSection();
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('Clipboard unavailable');
}

function setupSidebar(): () => void {
  const toggleBtn = document.getElementById('docs-sidebar-toggle');
  const closeBtn = document.getElementById('docs-sidebar-close');
  const sidebar = document.getElementById('docs-sidebar');
  const backdrop = document.getElementById('docs-sidebar-backdrop');
  const iconOpen = document.getElementById('docs-sidebar-icon-open');
  const iconClose = document.getElementById('docs-sidebar-icon-close');
  if (!toggleBtn || !sidebar || !backdrop) return () => {};
  let restoreBackground: (() => void) | null = null;
  const isOpen = () => toggleBtn.getAttribute('aria-expanded') === 'true';

  function openSidebar() {
    sidebar!.classList.remove('-translate-x-full', 'invisible', 'pointer-events-none');
    sidebar!.classList.add('translate-x-0', 'visible', 'pointer-events-auto');
    sidebar!.setAttribute('role', 'dialog');
    sidebar!.setAttribute('aria-modal', 'true');
    sidebar!.setAttribute('aria-label', 'Documentation navigation');
    backdrop!.classList.remove('opacity-0', 'pointer-events-none', 'invisible');
    backdrop!.classList.add('opacity-100', 'pointer-events-auto', 'visible');
    iconOpen?.classList.add('hidden');
    iconClose?.classList.remove('hidden');
    toggleBtn!.setAttribute('aria-expanded', 'true');
    toggleBtn!.setAttribute('aria-label', 'Close docs menu');
    document.body.classList.add('docs-sidebar-open');
    sidebar!.focus();
    restoreBackground = isolateBackground([sidebar!, toggleBtn!, backdrop!]);
    setTimeout(() => {
      if (isOpen() && document.activeElement === sidebar) sidebar!.querySelector<HTMLElement>('a')?.focus();
    }, 0);
  }

  function closeSidebar(restoreFocus = false) {
    restoreBackground?.();
    restoreBackground = null;
    sidebar!.classList.add('-translate-x-full', 'invisible', 'pointer-events-none');
    sidebar!.classList.remove('translate-x-0', 'visible', 'pointer-events-auto');
    sidebar!.removeAttribute('role');
    sidebar!.removeAttribute('aria-modal');
    sidebar!.removeAttribute('aria-label');
    backdrop!.classList.add('opacity-0', 'pointer-events-none', 'invisible');
    backdrop!.classList.remove('opacity-100', 'pointer-events-auto', 'visible');
    iconOpen?.classList.remove('hidden');
    iconClose?.classList.add('hidden');
    toggleBtn!.setAttribute('aria-expanded', 'false');
    toggleBtn!.setAttribute('aria-label', 'Open docs menu');
    document.body.classList.remove('docs-sidebar-open');
    if (restoreFocus) toggleBtn!.focus();
  }

  const onToggle = () => (isOpen() ? closeSidebar(true) : openSidebar());
  const onClose = () => closeSidebar(true);
  const onSidebarClick = (e: MouseEvent) => {
    if ((e.target as Element | null)?.closest('a')) closeSidebar(true);
  };
  const onKeydown = (e: KeyboardEvent) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') closeSidebar(true);
    if (e.key === 'Tab') trapTab(e, sidebar, Array.from(sidebar.querySelectorAll<HTMLElement>('button, a')));
  };
  const onResize = () => {
    if (window.innerWidth >= 768 && isOpen()) closeSidebar();
    else if (window.innerWidth < 768 && sidebar.contains(document.activeElement) && !isOpen()) toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', onToggle);
  closeBtn?.addEventListener('click', onClose);
  backdrop.addEventListener('click', onClose);
  sidebar.addEventListener('click', onSidebarClick);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', onResize);
  return () => {
    if (isOpen()) closeSidebar();
    toggleBtn.removeEventListener('click', onToggle);
    closeBtn?.removeEventListener('click', onClose);
    backdrop.removeEventListener('click', onClose);
    sidebar.removeEventListener('click', onSidebarClick);
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);
  };
}

export default function DocsBehavior() {
  useEffect(() => {
    setupDocsContent();
    setupSectionFocus();
    const teardownSidebar = setupSidebar();

    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        trackScrolledSection();
      });
    };
    const onHashChange = () => applySectionFocus(true);
    const onClick = async (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      const root = focusRoot();
      if (root && target.closest('.docs-section-full')) showFullPage(root);
      if (root && target.closest('.docs-section-picker nav a')) target.closest('details')?.removeAttribute('open');

      // Clipboard copy helper
      const btn = target.closest('.copy-btn, .docs-copy-code');
      if (!btn) return;
      const source = btn.getAttribute('data-copy') || btn.parentElement?.querySelector('pre')?.textContent || '';
      const text = btn.closest('.install-panel') ? source.replace(/^(?:\$|PS>)\s?/gm, '') : source;
      if (!text) return;
      const orig = btn.textContent;
      try {
        await copyText(text);
        btn.textContent = 'Copied ✓';
        btn.setAttribute('aria-label', 'Code copied');
      } catch {
        btn.textContent = 'Copy failed';
        btn.setAttribute('aria-label', 'Copy failed');
      }
      setTimeout(() => {
        btn.textContent = orig;
        btn.setAttribute('aria-label', 'Copy code');
      }, 1500);
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick);
    return () => {
      teardownSidebar();
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
