import type { BADGE_DEFS, TIER_CONFIG } from '@/data/contributors';
import type { Lang } from '@/lib/lang';

// Texts of the Hall of Fame and the contributor profiles, in English and Portuguese. Used on the
// server by the pages and in the browser by hall-behavior.ts, so nothing here imports server code.
// Each contributor's own highlight stays as written in data/contributors.ts, in English.

type BadgeKey = keyof typeof BADGE_DEFS;
type TierKey = keyof typeof TIER_CONFIG;

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** 'July 2026' in `lang`: kept as is in English, 'julho de 2026' in Portuguese. */
function monthLabel(month: string, locale: string): string {
  const [name, year] = month.split(' ');
  const index = MONTHS_EN.indexOf(name ?? '');
  if (index < 0 || !year) return month;
  return new Date(Date.UTC(Number(year), index, 1)).toLocaleString(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** 'Sep 5, 2026' in `lang`: kept as is in English, '5 de set. de 2026' in Portuguese. */
function dayLabel(day: string, locale: string): string {
  const parsed = new Date(`${day} UTC`);
  if (Number.isNaN(parsed.getTime())) return day;
  return parsed.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const en = {
  locale: 'en-US',
  meta: {
    title: 'Hall of Fame · EGC',
    description:
      'The developers who shaped EGC. Every commit, every bug fix, every translation, permanently recognized.',
  },
  kicker: 'The people behind the project',
  titleTop: 'Built by people.',
  titleBottom: 'Remembered by EGC.',
  lead: (dash: string) =>
    `A permanent place for the contributors who turn ideas into working software ${dash} one issue, review, and pull request at a time.`,
  stats: {
    contributors: 'Contributors',
    commits: 'Commits',
    lines: 'Lines added',
    prs: 'Pull requests merged',
  },
  recognition: 'Recognition',
  topContributors: 'Top contributors',
  rankedBy: 'Ranked by merged commits, then lines added.',
  medal: (rank: number): string => (rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'),
  position: (rank: number) => `${rank}${rank === 1 ? 'st' : rank === 2 ? 'nd' : 'rd'} place`,
  medalWord: (medal: string) => `${medal} medal`,
  viewProfile: ', view contributor profile',
  onGithubNewTab: ' on GitHub (opens in new tab)',
  specialtyBadges: 'Specialty badges',
  viewProfileCue: 'View contributor profile ↗',
  commits: 'commits',
  hype: 'Hype',
  hypeLabel: (name: string) => `Hype ${name}`,
  hypeTitle: 'Hype this contributor (1 hype a day)',
  allContributors: 'All contributors',
  everyone: 'Everyone who shipped',
  countAll: (n: number) => `${n} of ${n} contributors`,
  searchLabel: 'Search contributors by name, login or area',
  searchPlaceholder: 'Search by name, handle or area',
  filterByTier: 'Filter by tier',
  all: 'All',
  tierButton: (key: TierKey) =>
    key === 'core' ? 'Core' : key.charAt(0).toUpperCase() + key.slice(1),
  sortBy: 'Sort by',
  sortKeys: { commits: 'Commits', prs: 'PRs', additions: 'Lines' },
  columns: { contributor: 'Contributor', tier: 'Tier', areas: 'Areas' },
  opensGithub: 'Opens GitHub in a new tab.',
  noMatch: 'No contributor matches this search.',
  pagination: 'Contributor pagination',
  previous: 'Previous',
  next: 'Next',
  page: (n: number) => `Page ${n}`,
  fewerThanTwo: 'Fewer than two commits.',
  orMore: (n: number) => `${n} or more commits.`,
  archive: 'A living archive',
  pastChampions: 'Past champions',
  pastLead: 'Recognition remains discoverable beyond the current month.',
  viewChampion: (name: string, month: string) => `View ${name}, ${month}`,
  ctaTitle: 'Your name belongs on this page.',
  ctaLead: 'Pick an open issue, ship the fix, and you are in the Hall of Fame for good.',
  browseIssues: 'Browse open issues',
  contributingGuide: 'Contributing guide',
  newTab: '(opens in new tab)',
  sponsors: 'Sponsors',
  keepingMoving: 'Keeping EGC moving',
  toolPartners: 'Tool partners',
  backers: 'Backers',
  monthlySponsors: 'Monthly sponsors',
  open: 'Open.',
  becomeFirst: 'Become the first.',
  championStats: (commits: number, additions: number, month: string) =>
    `${commits} commit${commits !== 1 ? 's' : ''}${additions > 0 ? ` and +${additions.toLocaleString('en')} lines` : ''} in ${month}.`,
  month: (month: string) => month,
  day: (day: string) => day,
  // Contributor profile
  profileTitle: (name: string) => `${name}, EGC Hall of Fame`,
  contributorOfMonth: 'Contributor of the Month',
  profileStats: {
    prs: 'PRs merged',
    badges: 'Badges',
    repos: 'GitHub repos',
    followers: 'Followers',
  },
  whatTheyBuilt: 'What they built',
  commitCount: (n: number) => `${n} commit${n === 1 ? '' : 's'}`,
  linesCount: (n: number) => `+${n.toLocaleString('en')} lines`,
  joined: (since: string) => `Joined ${since}`,
  badgesTitle: 'Badges',
  viewGithubProfile: 'View GitHub profile',
  viewCommits: 'View commits on EGC',
  backToHall: 'Back to Hall of Fame',
  // Behaviour (hall-behavior.ts)
  showingNone: 'Showing 0 of 0 contributors',
  showing: (from: number, to: number, total: number, dash: string) =>
    `Showing ${from}${dash}${to} of ${total} contributors`,
  descending: 'Descending',
  ascending: 'Ascending',
  sortSwitch: (current: string, next: string) =>
    `Currently ${current.toLowerCase()}; switch to ${next.toLowerCase()}`,
  sortedBy: (key: string, direction: string) => `Sorted by ${key}, ${direction.toLowerCase()}.`,
  hypeCount: (name: string, value: number) => `Hype ${name}, ${value} hypes`,
  hypeMine: 'Your hype of the day! Comes back tomorrow',
  hypeSpent: "You've used today's hype. Come back tomorrow!",
  hypeNotSaved: 'Hype could not be saved on this device. Please try again.',
  hypeSaved: (login: string) => `Your hype for ${login} is saved on this device for today.`,
  hypeUnconfirmed: 'Hype was saved on this device, but the server could not confirm it.',
};

export type HallText = typeof en;

const pt: HallText = {
  locale: 'pt-BR',
  meta: {
    title: 'Hall of Fame · EGC',
    description:
      'As pessoas que construíram o EGC. Cada commit, cada correção, cada tradução, reconhecidos para sempre.',
  },
  kicker: 'As pessoas por trás do projeto',
  titleTop: 'Feito por pessoas.',
  titleBottom: 'Lembrado pelo EGC.',
  lead: () =>
    'Um lugar permanente para quem transforma ideias em software que funciona, uma issue, uma revisão e um pull request de cada vez.',
  stats: {
    contributors: 'Contribuidores',
    commits: 'Commits',
    lines: 'Linhas adicionadas',
    prs: 'Pull requests aceitos',
  },
  recognition: 'Reconhecimento',
  topContributors: 'Quem mais contribuiu',
  rankedBy: 'Ordenado por commits aceitos e, depois, por linhas adicionadas.',
  medal: (rank: number) => (rank === 1 ? 'Ouro' : rank === 2 ? 'Prata' : 'Bronze'),
  position: (rank: number) => `${rank}º lugar`,
  medalWord: (medal: string) => `medalha de ${medal.toLowerCase()}`,
  viewProfile: ', ver o perfil',
  onGithubNewTab: ' no GitHub (abre em nova aba)',
  specialtyBadges: 'Selos de especialidade',
  viewProfileCue: 'Ver o perfil ↗',
  commits: 'commits',
  hype: 'Hype',
  hypeLabel: (name: string) => `Dar hype para ${name}`,
  hypeTitle: 'Dê hype para quem contribuiu (1 hype por dia)',
  allContributors: 'Todos os contribuidores',
  everyone: 'Todo mundo que entregou',
  countAll: (n: number) => `${n} de ${n} contribuidores`,
  searchLabel: 'Buscar contribuidores por nome, login ou área',
  searchPlaceholder: 'Busque por nome, usuário ou área',
  filterByTier: 'Filtrar por nível',
  all: 'Todos',
  tierButton: (key: TierKey) =>
    ({ core: 'Core', gold: 'Ouro', silver: 'Prata', community: 'Comunidade' })[key],
  sortBy: 'Ordenar por',
  sortKeys: { commits: 'Commits', prs: 'PRs', additions: 'Linhas' },
  columns: { contributor: 'Contribuidor', tier: 'Nível', areas: 'Áreas' },
  opensGithub: 'Abre o GitHub em uma nova aba.',
  noMatch: 'Nenhum contribuidor corresponde a esta busca.',
  pagination: 'Paginação dos contribuidores',
  previous: 'Anterior',
  next: 'Próxima',
  page: (n: number) => `Página ${n}`,
  fewerThanTwo: 'Menos de dois commits.',
  orMore: (n: number) => `${n} commits ou mais.`,
  archive: 'Um arquivo vivo',
  pastChampions: 'Campeões anteriores',
  pastLead: 'O reconhecimento continua visível depois que o mês acaba.',
  viewChampion: (name: string, month: string) => `Ver ${name}, ${month}`,
  ctaTitle: 'Seu nome tem lugar nesta página.',
  ctaLead: 'Escolha uma issue aberta, entregue a correção e você entra para o Hall of Fame de vez.',
  browseIssues: 'Ver as issues abertas',
  contributingGuide: 'Guia de contribuição',
  newTab: '(abre em nova aba)',
  sponsors: 'Patrocinadores',
  keepingMoving: 'Quem mantém o EGC andando',
  toolPartners: 'Parceiros de ferramentas',
  backers: 'Apoiadores',
  monthlySponsors: 'Patrocinadores mensais',
  open: 'Vagas abertas.',
  becomeFirst: 'Seja o primeiro.',
  championStats: (commits: number, additions: number, month: string) =>
    `${commits} commit${commits !== 1 ? 's' : ''}${additions > 0 ? ` e +${additions.toLocaleString('pt-BR')} linhas` : ''} em ${monthLabel(month, 'pt-BR')}.`,
  month: (month: string) => monthLabel(month, 'pt-BR'),
  day: (day: string) => dayLabel(day, 'pt-BR'),
  profileTitle: (name: string) => `${name}, Hall of Fame do EGC`,
  contributorOfMonth: 'Contribuidor do mês',
  profileStats: {
    prs: 'PRs aceitos',
    badges: 'Selos',
    repos: 'Repos no GitHub',
    followers: 'Seguidores',
  },
  whatTheyBuilt: 'O que construiu',
  commitCount: (n: number) => `${n} commit${n === 1 ? '' : 's'}`,
  linesCount: (n: number) => `+${n.toLocaleString('pt-BR')} linhas`,
  joined: (since: string) => `Chegou em ${dayLabel(since, 'pt-BR')}`,
  badgesTitle: 'Selos',
  viewGithubProfile: 'Ver o perfil no GitHub',
  viewCommits: 'Ver os commits no EGC',
  backToHall: 'Voltar ao Hall of Fame',
  showingNone: 'Mostrando 0 de 0 contribuidores',
  showing: (from: number, to: number, total: number, dash: string) =>
    `Mostrando ${from}${dash}${to} de ${total} contribuidores`,
  descending: 'Decrescente',
  ascending: 'Crescente',
  sortSwitch: (current: string, next: string) =>
    `Agora em ordem ${current.toLowerCase()}; mudar para ${next.toLowerCase()}`,
  sortedBy: (key: string, direction: string) => `Ordenado por ${key}, ${direction.toLowerCase()}.`,
  hypeCount: (name: string, value: number) => `Dar hype para ${name}, ${value} hypes`,
  hypeMine: 'Seu hype do dia! Volta amanhã',
  hypeSpent: 'Você já usou o hype de hoje. Volte amanhã!',
  hypeNotSaved: 'Não foi possível salvar o hype neste dispositivo. Tente de novo.',
  hypeSaved: (login: string) => `Seu hype para ${login} está salvo neste dispositivo por hoje.`,
  hypeUnconfirmed: 'O hype foi salvo neste dispositivo, mas o servidor não confirmou.',
};

const TEXT: Record<Lang, HallText> = { en, pt };

/** Portuguese tier and badge names; the English ones are the labels in data/contributors.ts. */
export const HALL_LABELS_PT: { tiers: Record<TierKey, string>; badges: Record<BadgeKey, string> } =
  {
    tiers: {
      core: 'Mantenedor principal',
      gold: 'Contribuidor ouro',
      silver: 'Contribuidor prata',
      community: 'Membro da comunidade',
    },
    badges: {
      pioneer: 'Pioneiro',
      bugHunter: 'Caçador de bugs',
      translator: 'Tradutor',
      speedDemon: 'Velocista',
      reliability: 'Confiabilidade',
      crossPlatform: 'Multiplataforma',
      newFeature: 'Nova função',
      codeQuality: 'Qualidade de código',
      coAuthor: 'Coautor',
      cli: 'Especialista em CLI',
      multiFeature: 'Várias funções',
      security: 'Segurança',
    },
  };

export function hallText(lang: Lang): HallText {
  return TEXT[lang];
}
