// Behaviour of the Hall of Fame, ported verbatim from the <script> of src/pages/contributors.astro:
// avatar fallback, search, tier filter, sorting, pagination and the daily hype (Abacus counter).
// The texts it writes follow the page language, read from <html lang>.
import { hallText } from '@/lib/hall-i18n';
import { documentLang } from '@/lib/site-i18n';

export function initHall() {
  const t = hallText(documentLang());
  const EN_DASH = String.fromCharCode(0x2013);
  document.querySelectorAll<HTMLImageElement>('.hall .av img').forEach((img) => {
    img.addEventListener('error', () => img.remove(), { once: true });
    if (img.complete && img.naturalWidth === 0) img.remove();
  });
  const search = document.getElementById('contributor-search') as HTMLInputElement | null;
  const rowsRoot = document.getElementById('contributor-rows');
  const rows = rowsRoot
    ? Array.from(rowsRoot.querySelectorAll<HTMLTableRowElement>('tr[data-index]'))
    : [];
  const count = document.getElementById('count');
  const empty = document.getElementById('empty-row');
  const pagination = document.getElementById('contributor-pagination');
  const pageSize = Number(pagination?.dataset.pageSize) || 10;
  const pageButtons = Array.from(
    pagination?.querySelectorAll<HTMLButtonElement>('[data-page]') ?? [],
  );
  const previous = document.getElementById('page-previous') as HTMLButtonElement | null;
  const next = document.getElementById('page-next') as HTMLButtonElement | null;
  const filters = Array.from(document.querySelectorAll<HTMLButtonElement>('#tier-filter button'));
  const sorters = Array.from(
    document.querySelectorAll<HTMLButtonElement>('thead th[data-key] button'),
  );
  const mobileSortKey = document.getElementById('mobile-sort-key') as HTMLSelectElement | null;
  const mobileSortDirection = document.getElementById(
    'mobile-sort-direction',
  ) as HTMLButtonElement | null;
  const mobileSortStatus = document.getElementById('mobile-sort-status');
  let tier = 'all';
  let sortKey: 'commits' | 'prs' | 'additions' = 'commits';
  let sortDirection = -1;
  let currentPage = 1;
  function updateTable() {
    const query = search?.value.trim().toLocaleLowerCase() ?? '';
    const shown = rows.filter(
      (row) =>
        (tier === 'all' || row.dataset.tier === tier) &&
        (!query ||
          [row.dataset.name, row.dataset.login, row.dataset.areas].some((value) =>
            value?.includes(query),
          )),
    );
    const key = sortKey;
    shown.sort((a, b) => {
      const left = a.dataset[key];
      const right = b.dataset[key];
      if (left === '' && right !== '') return 1;
      if (right === '' && left !== '') return -1;
      return (
        ((Number(left) || 0) - (Number(right) || 0)) * sortDirection ||
        Number(a.dataset.index) - Number(b.dataset.index)
      );
    });
    const totalPages = Math.ceil(shown.length / pageSize);
    currentPage = Math.min(currentPage, Math.max(totalPages, 1));
    const start = (currentPage - 1) * pageSize;
    const visible = shown.slice(start, start + pageSize);
    for (const row of rows) row.hidden = true;
    for (const row of visible) {
      row.hidden = false;
      rowsRoot?.appendChild(row);
    }
    if (empty) {
      empty.hidden = shown.length !== 0;
      rowsRoot?.appendChild(empty);
    }
    if (count)
      count.textContent =
        shown.length === 0
          ? t.showingNone
          : t.showing(start + 1, start + visible.length, shown.length, EN_DASH);
    if (pagination) pagination.hidden = totalPages <= 1;
    if (previous) previous.disabled = currentPage === 1;
    if (next) next.disabled = currentPage >= totalPages;
    for (const button of pageButtons) {
      const page = Number(button.dataset.page);
      button.hidden = page > totalPages;
      if (page === currentPage) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
  }
  search?.addEventListener('input', () => {
    currentPage = 1;
    updateTable();
  });
  for (const button of filters)
    button.addEventListener('click', () => {
      tier = button.dataset.tier ?? 'all';
      for (const filter of filters) filter.setAttribute('aria-pressed', String(filter === button));
      currentPage = 1;
      updateTable();
    });
  function setSort(key: 'commits' | 'prs' | 'additions', direction: number) {
    sortKey = key;
    sortDirection = direction;
    document.querySelectorAll('thead th[data-key]').forEach((th) => {
      if ((th as HTMLElement).dataset.key === key)
        th.setAttribute('aria-sort', direction < 0 ? 'descending' : 'ascending');
      else th.removeAttribute('aria-sort');
    });
    if (mobileSortKey) mobileSortKey.value = key;
    if (mobileSortDirection) {
      const label = direction < 0 ? t.descending : t.ascending;
      mobileSortDirection.textContent = `${label} ${direction < 0 ? '↓' : '↑'}`;
      mobileSortDirection.setAttribute(
        'aria-label',
        t.sortSwitch(label, direction < 0 ? t.ascending : t.descending),
      );
    }
    if (mobileSortStatus)
      mobileSortStatus.textContent = t.sortedBy(
        t.sortKeys[key],
        direction < 0 ? t.descending : t.ascending,
      );
    currentPage = 1;
    updateTable();
  }
  for (const button of sorters)
    button.addEventListener('click', () => {
      const key = (button.parentElement as HTMLElement).dataset.key as
        'commits' | 'prs' | 'additions';
      setSort(key, sortKey === key ? -sortDirection : -1);
    });
  mobileSortKey?.addEventListener('change', () =>
    setSort(mobileSortKey.value as 'commits' | 'prs' | 'additions', -1),
  );
  mobileSortDirection?.addEventListener('click', () => setSort(sortKey, -sortDirection));
  previous?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
    }
  });
  next?.addEventListener('click', () => {
    currentPage++;
    updateTable();
  });
  for (const button of pageButtons)
    button.addEventListener('click', () => {
      currentPage = Number(button.dataset.page);
      updateTable();
    });
  updateTable();
  // Namespace v2: contadores zerados em 18/07/2026 (votos de teste do v1 abandonados).
  // Regra: 1 hype por visitante POR DIA no total; o contador global nunca regride.
  const NS = 'egc-halloffame-v2';
  const API = 'https://abacus.jasoncameron.dev';
  const DAILY_KEY = 'hype-daily';
  const hypeStatus = document.getElementById('hype-status');
  const btns = Array.from(document.querySelectorAll('.hype-btn')) as HTMLButtonElement[];
  const today = new Date().toISOString().slice(0, 10);
  const votedDuringLoad = new Set<string>();

  function getDailyVote(): string | null {
    try {
      const raw = localStorage.getItem(DAILY_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.date !== today) {
        localStorage.removeItem(DAILY_KEY);
        return null;
      }
      return parsed.vote || null;
    } catch {
      return null;
    }
  }

  function byLogin(login: string) {
    return btns.filter((b) => b.dataset.hype === login);
  }
  function setCount(login: string, value: number) {
    for (const b of byLogin(login)) {
      const el = b.querySelector('.hype-count');
      if (el) el.textContent = String(value);
      b.setAttribute('aria-label', t.hypeCount(b.dataset.name || login, value));
    }
  }
  function paintStates() {
    const voted = getDailyVote();
    for (const b of btns) {
      const mine = voted !== null && b.dataset.hype === voted;
      b.classList.toggle('hype-voted', mine);
      b.classList.toggle('hype-spent', voted !== null && !mine);
      b.setAttribute('aria-pressed', String(mine));
      if (mine) b.title = t.hypeMine;
      else if (voted !== null) b.title = t.hypeSpent;
      else b.title = t.hypeTitle;
      (b as HTMLButtonElement).disabled = voted !== null && !mine;
    }
  }

  for (const b of btns) {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (getDailyVote() !== null) return;
      const login = b.dataset.hype || '';
      try {
        localStorage.setItem(DAILY_KEY, JSON.stringify({ date: today, vote: login }));
      } catch {
        if (hypeStatus) hypeStatus.textContent = t.hypeNotSaved;
        return;
      }
      votedDuringLoad.add(login);
      paintStates();
      const el = b.querySelector('.hype-count');
      const cur = parseInt(el?.textContent || '0', 10) || 0;
      setCount(login, cur + 1);
      if (hypeStatus) hypeStatus.textContent = t.hypeSaved(login);
      // Fire-and-forget: o Abacus grava o voto global; keepalive garante o envio
      // mesmo se a aba fechar. Sem rollback: o contador global nunca regride.
      try {
        fetch(`${API}/hit/${NS}/${encodeURIComponent(login)}`, { keepalive: true })
          .then(async (response) => {
            if (!response.ok) throw new Error('Hype service unavailable');
            // A leitura iniciada antes do voto pode estar desatualizada.
            // Reconsultar somente após a confirmação, sem reenviar o voto.
            try {
              const latest = await fetch(`${API}/get/${NS}/${encodeURIComponent(login)}`, {
                signal: AbortSignal.timeout(8000),
              });
              if (!latest.ok) return;
              const data = await latest.json();
              if (typeof data.value !== 'number') return;
              const current = parseInt(
                byLogin(login)[0]?.querySelector('.hype-count')?.textContent || '',
                10,
              );
              setCount(login, Math.max(Number.isFinite(current) ? current : 0, data.value));
            } catch {
              /* O voto foi confirmado; manter a contagem otimista. */
            }
          })
          .catch(() => {
            if (hypeStatus) hypeStatus.textContent = t.hypeUnconfirmed;
          });
      } catch {
        if (hypeStatus) hypeStatus.textContent = t.hypeUnconfirmed;
      }
    });
  }
  paintStates();

  const logins = Array.from(new Set(btns.map((b) => b.dataset.hype || '').filter(Boolean)));
  Promise.all(
    logins.map((login) =>
      fetch(`${API}/get/${NS}/${encodeURIComponent(login)}`, { signal: AbortSignal.timeout(8000) })
        .then((r) => {
          if (!r.ok) throw new Error('Hype service unavailable');
          return r.json();
        })
        .then((d) => [login, typeof d.value === 'number' ? d.value : 0] as const)
        .catch(() => [login, null] as const),
    ),
  ).then((pairs) => {
    for (const [login, value] of pairs) {
      // null = servico inacessivel (adblock/offline): botao segue funcional, numero oculto
      if (value !== null && !votedDuringLoad.has(login)) {
        const current = parseInt(
          byLogin(login)[0]?.querySelector('.hype-count')?.textContent || '',
          10,
        );
        setCount(login, Math.max(Number.isFinite(current) ? current : 0, value));
      }
    }
  });
}
