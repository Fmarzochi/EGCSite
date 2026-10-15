// Makes everything outside an open drawer inert and hidden from assistive tech,
// then restores each element's own inert / aria-hidden values when it closes.
type Saved = { element: HTMLElement; inert: string | null; ariaHidden: string | null };

export function isolateBackground(allowed: HTMLElement[]): () => void {
  const saved: Saved[] = [];
  function isolate(parent: Element) {
    for (const child of Array.from(parent.children)) {
      if (!(child instanceof HTMLElement) || child.tagName === 'SCRIPT' || child.tagName === 'STYLE' || allowed.includes(child)) continue;
      if (allowed.some((element) => child.contains(element))) {
        isolate(child);
      } else {
        saved.push({ element: child, inert: child.getAttribute('inert'), ariaHidden: child.getAttribute('aria-hidden') });
        child.setAttribute('inert', '');
        child.setAttribute('aria-hidden', 'true');
      }
    }
  }
  isolate(document.body);
  return () => {
    for (const { element, inert, ariaHidden } of saved) {
      if (inert === null) element.removeAttribute('inert');
      else element.setAttribute('inert', inert);
      if (ariaHidden === null) element.removeAttribute('aria-hidden');
      else element.setAttribute('aria-hidden', ariaHidden);
    }
  };
}

/** Keeps Tab and Shift+Tab inside `focusables` while a drawer is open. */
export function trapTab(e: KeyboardEvent, container: HTMLElement | null, focusables: HTMLElement[]) {
  if (focusables.length === 0) return;
  const first = focusables[0]!;
  const last = focusables[focusables.length - 1]!;
  if (document.activeElement === container) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  } else if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
