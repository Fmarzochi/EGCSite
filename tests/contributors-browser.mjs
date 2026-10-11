import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

// Run with a local Astro preview and Chromium --remote-debugging-port=9223.
// Fetch interception is enabled before navigation; Abacus never receives a vote.
const siteUrl = process.env.EGC_BROWSER_BASE_URL ?? 'http://127.0.0.1:4322/EGCSite';
const cdpUrl = process.env.EGC_CDP_URL ?? 'http://127.0.0.1:9223';

const tabs = await fetch(`${cdpUrl}/json`).then(r => r.json());
const tab = tabs.find(t => t.type === 'page');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0;
const pending = new Map();
const paused = [];
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const p = pending.get(message.id);
    if (p) { pending.delete(message.id); message.error ? p.reject(message.error) : p.resolve(message.result); }
  } else if (message.method === 'Fetch.requestPaused') paused.push(message.params);
};
function call(method, params = {}) {
  const id = ++nextId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout ${method}`)); }, 20000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
  });
}
const pause = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, label, limit = 30000) {
  const start = Date.now();
  while (Date.now() - start < limit) {
    const result = await fn();
    if (result) return result;
    await pause(100);
  }
  throw new Error(`Timeout waiting for ${label}`);
}
async function evalJs(expression) {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function fulfill(request, value, fail = false) {
  if (fail) return call('Fetch.failRequest', { requestId: request.requestId, errorReason: 'Failed' }).catch(error => { if (error.code !== -32602) throw error; });
  const isGet = request.request.url.includes('/get/');
  const body = Buffer.from(JSON.stringify(isGet ? { value } : { success: true })).toString('base64');
  return call('Fetch.fulfillRequest', { requestId: request.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: '*' }], body }).catch(error => { if (error.code !== -32602) throw error; });
}
async function getRequests(kind) { return paused.filter(r => r.request.url.includes(`/${kind}/`)); }
async function clearRequests(kind, target, targetValue, fail = false, only = null) {
  const requests = only ?? await getRequests(kind);
  for (const request of requests) {
    await fulfill(request, request.request.url.endsWith(`/${target}`) ? targetValue : 0, fail);
    paused.splice(paused.indexOf(request), 1);
  }
  return requests.length;
}
await call('Page.enable');
await call('Runtime.enable');
await call('Fetch.enable', { patterns: [{ urlPattern: '*abacus.jasoncameron.dev/*', requestStage: 'Request' }] });
await call('Page.addScriptToEvaluateOnNewDocument', { source: 'try { localStorage.removeItem("hype-daily") } catch {}' });
await call('Page.navigate', { url: `${siteUrl}/contributors` });
await until(() => evalJs('document.querySelectorAll("#contributor-rows tr[data-index]").length'), 'contributor rows');
await until(() => evalJs('getComputedStyle(document.querySelector(".podium")).display === "grid"'), 'podium styles');
const target = await evalJs('document.querySelector(".hype-btn").dataset.hype');
const podium = await evalJs(`(() => Array.from(document.querySelectorAll('.podium-entry')).map(entry => { const card=entry.querySelector('.podium-person'); return {
  rank: Number(entry.dataset.rank),
  href: card.querySelector('.podium-link')?.getAttribute('href'),
  medal: card.querySelector('.podium-medal')?.textContent.trim(),
  step: entry.querySelector('.podium-step')?.textContent.trim(),
  tier: card.querySelector('.podium-tier')?.textContent.trim(),
  commits: card.querySelector('.podium-commits')?.textContent.trim(),
  nestedInteractive: Boolean(card.querySelector('a button, button a')),
}}))()`);
assert.deepEqual(podium.map(card => card.rank), [1, 2, 3]);
assert.deepEqual(podium.map(card => card.medal), ['1', '2', '3']);
assert.deepEqual(podium.map(card => card.step), ['1', '2', '3']);
assert.ok(podium.every(card => card.href && card.tier && /^\d+ commits$/.test(card.commits) && !card.nestedInteractive));
const routeBase = new URL(siteUrl).pathname.replace(/\/$/, '');
const validProfileHref = href => href.startsWith(`${routeBase}/contributors/`) || href.startsWith('https://github.com/');
assert.ok(podium.every(card => validProfileHref(card.href)), 'podium profile paths');
const tableLinks = await evalJs(`Array.from(document.querySelectorAll('#contributor-rows .who-link')).map(a=>({href:a.getAttribute('href'),target:a.target,rel:a.rel}))`);
assert.ok(tableLinks.every(link => validProfileHref(link.href)), 'contributor profile paths');
assert.ok(tableLinks.filter(link => link.href.startsWith('https://github.com/')).every(link => link.target === '_blank' && link.rel.includes('noopener')), 'external profile fallback');
const measures = [];
for (const width of [320, 375, 430, 768, 900, 901, 1024, 1280, 1440]) {
  await call('Emulation.setDeviceMetricsOverride', { width, height: 850, deviceScaleFactor: 1, mobile: false });
  await evalJs('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  const m = await evalJs(`(() => { const select=document.querySelector('#mobile-sort-key'), head=document.querySelector('thead'), doc=document.documentElement, entries=Array.from(document.querySelectorAll('.podium-entry')), rects=entries.map(entry=>entry.getBoundingClientRect()), cards=entries.map(entry=>entry.querySelector('.podium-person').getBoundingClientRect()), podium=document.querySelector('.podium').getBoundingClientRect(); return {mobile:getComputedStyle(select.parentElement).display!=='none', desktop:getComputedStyle(head).display!=='none', overflow:doc.scrollWidth>doc.clientWidth, rows:document.querySelectorAll('#contributor-rows tr[data-index]').length, podiumWidth:Math.round(podium.width), podiumOrder:entries.map((entry,i)=>({rank:Number(entry.dataset.rank),x:rects[i].x,y:rects[i].y})).sort((a,b)=>innerWidth<=900?a.y-b.y:a.x-b.x).map(entry=>entry.rank), podiumHeights:cards.map(rect=>Math.round(rect.height)), podiumBottoms:rects.map(rect=>Math.round(rect.bottom)), steps:entries.map(entry=>getComputedStyle(entry.querySelector('.podium-step')).display)}; })()`);
  assert.equal(m.mobile, width <= 900, `mobile controls ${width}`);
  assert.equal(m.desktop, width > 900, `desktop headings ${width}`);
  assert.equal(m.overflow, false, `horizontal overflow ${width}: ${JSON.stringify(m)}`);
  assert.deepEqual(m.podiumOrder, width <= 900 ? [1, 2, 3] : [2, 1, 3], `podium order ${width}`);
  if (width > 900) {
    assert.ok(m.podiumHeights[0] > m.podiumHeights[1] && m.podiumHeights[1] > m.podiumHeights[2], `podium heights ${width}`);
    assert.ok(Math.max(...m.podiumBottoms)-Math.min(...m.podiumBottoms) <= 1, `podium baseline ${width}`);
    assert.ok(m.podiumWidth <= 900, `compact podium ${width}`);
    assert.ok(m.steps.every(step => step === 'grid'), `visible steps ${width}`);
  } else {
    assert.ok(m.steps.every(step => step === 'none'), `hidden mobile steps ${width}`);
  }
  measures.push({ width, ...m });
  if (width === 375 || width === 901) {
    await evalJs('window.scrollTo({top:document.querySelector(".tools").getBoundingClientRect().top+window.scrollY-80,behavior:"instant"})');
    await pause(200);
    const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(`/tmp/egc-3a-hall-${width}.png`, Buffer.from(shot.data, 'base64'));
  }
}
await call('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value:'reduce' }] });
const reducedMotion = await evalJs('getComputedStyle(document.querySelector(".podium-person")).transitionDuration');
assert.ok(reducedMotion.split(',').every(value => parseFloat(value) <= .01), 'reduced motion');
await call('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value:'no-preference' }] });
await call('Emulation.setDeviceMetricsOverride', { width: 375, height: 850, deviceScaleFactor: 1, mobile: false });
const sorting = await evalJs(`(() => {
  const select=document.querySelector('#mobile-sort-key'), direction=document.querySelector('#mobile-sort-direction');
  const first=()=>document.querySelector('#contributor-rows tr[data-index]:not([hidden])');
  const order=()=>Array.from(document.querySelectorAll('#contributor-rows tr[data-index]:not([hidden])')).map(r=>Number(r.dataset.commits));
  const baseline=order();
  direction.click(); const ascending=order();
  select.value='prs';select.dispatchEvent(new Event('change',{bubbles:true}));
  const prsFirst=first()?.dataset.prs, prsDirection=direction.textContent;
  const prsOrder=Array.from(document.querySelectorAll('#contributor-rows tr[data-index]:not([hidden])')).map(r=>r.dataset.prs);
  document.querySelector('thead th[data-key="additions"] button').click();
  const synced={key:select.value,direction:direction.textContent,heading:document.querySelector('thead th[data-key="additions"]').getAttribute('aria-sort')};
  const search=document.querySelector('#contributor-search'); search.value='no-such-contributor-3a'; search.dispatchEvent(new Event('input',{bubbles:true}));
  const empty=!document.querySelector('#empty-row').hidden && document.querySelector('#count').textContent==='Showing 0 of 0 contributors' && document.querySelector('#contributor-pagination').hidden;
  search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
  const filter=document.querySelector('#tier-filter button[data-tier="core"]'); filter.click();
  const filtered=Array.from(document.querySelectorAll('#contributor-rows tr[data-index]:not([hidden])')).every(r=>r.dataset.tier==='core');
  document.querySelector('#tier-filter button[data-tier="all"]').click();
  return {baseline,ascending,prsFirst,prsOrder,prsDirection,synced,empty,filtered,count:document.querySelector('#count').textContent,link:!!first()?.querySelector('a[href]')};
})()`);
assert.ok(sorting.baseline.length > 1);
assert.deepEqual(sorting.baseline, [...sorting.baseline].sort((a,b)=>b-a));
assert.deepEqual(sorting.ascending, [...sorting.ascending].sort((a,b)=>a-b));
assert.deepEqual(sorting.prsOrder.filter(Boolean).map(Number), [...sorting.prsOrder.filter(Boolean).map(Number)].sort((a,b)=>b-a));
assert.equal(sorting.prsDirection.includes('Descending'), true);
assert.deepEqual(sorting.synced, {key:'additions',direction:'Descending ↓',heading:'descending'});
assert.equal(sorting.empty, true);
assert.equal(sorting.filtered, true);
assert.equal(sorting.link, true);
console.log(JSON.stringify({ responsive: measures, sorting: { ...sorting, baseline: `${sorting.baseline.length} rows`, ascending: `${sorting.ascending.length} rows`, prsOrder: `${sorting.prsOrder.length} rows` } }));
await evalJs('document.querySelector("#mobile-sort-key").focus()');
await call('Input.dispatchKeyEvent', { type:'keyDown', key:'Tab', code:'Tab', windowsVirtualKeyCode:9 });
await call('Input.dispatchKeyEvent', { type:'keyUp', key:'Tab', code:'Tab', windowsVirtualKeyCode:9 });
const focused = await evalJs('({onDirection:document.activeElement.id==="mobile-sort-direction", visible:document.querySelector("#mobile-sort-direction").matches(":focus-visible"), before:document.querySelector("#mobile-sort-direction").textContent, name:document.querySelector("#mobile-sort-direction").getAttribute("aria-label")})');
assert.equal(focused.onDirection, true);
assert.equal(focused.visible, true);
assert.equal(focused.name, 'Currently descending; switch to ascending');
await call('Input.dispatchKeyEvent', { type:'keyDown', key:' ', code:'Space', windowsVirtualKeyCode:32 });
await call('Input.dispatchKeyEvent', { type:'keyUp', key:' ', code:'Space', windowsVirtualKeyCode:32 });
const keyboard = await evalJs('({after:document.querySelector("#mobile-sort-direction").textContent, heading:document.querySelector("thead th[data-key=additions]").getAttribute("aria-sort"), name:document.querySelector("#mobile-sort-direction").getAttribute("aria-label")})');
assert.notEqual(keyboard.after, focused.before);
assert.equal(keyboard.heading, 'ascending');
assert.equal(keyboard.name, 'Currently ascending; switch to descending');
console.log(JSON.stringify({ keyboard:{...focused,...keyboard} }));

const pagination = await evalJs(`(() => {
  const rows=Array.from(document.querySelectorAll('#contributor-rows tr[data-index]'));
  const nav=document.querySelector('#contributor-pagination');
  const pages=Array.from(nav.querySelectorAll('[data-page]'));
  const visible=()=>Array.from(document.querySelectorAll('#contributor-rows tr[data-index]:not([hidden])'));
  const state=()=>({ids:visible().map(r=>r.dataset.index),count:document.querySelector('#count').textContent,current:nav.querySelector('[aria-current="page"]')?.dataset.page,previous:document.querySelector('#page-previous').disabled,next:document.querySelector('#page-next').disabled,hidden:nav.hidden});
  const total=rows.length, totalPages=Math.ceil(total/10), first=state(), seen=[];
  for (let page=1;page<=totalPages;page++) { pages[page-1].click();seen.push(...visible().map(r=>r.dataset.index)); }
  const last=state();
  pages[1].click(); const second=state();
  const search=document.querySelector('#contributor-search');
  const candidate='abcdefghijklmnopqrstuvwxyz'.split('').find(ch=>{const n=rows.filter(r=>[r.dataset.name,r.dataset.login,r.dataset.areas].some(v=>v.includes(ch))).length;return n>10&&n<total});
  search.value=candidate;search.dispatchEvent(new Event('input',{bubbles:true}));
  const searched=state(), matching=rows.filter(r=>[r.dataset.name,r.dataset.login,r.dataset.areas].some(v=>v.includes(candidate))).length;
  pages[1].click(); const searchedSecond=state();
  search.value='';search.dispatchEvent(new Event('input',{bubbles:true})); const searchReset=state();
  const tier=Array.from(new Set(rows.map(r=>r.dataset.tier))).find(value=>rows.filter(r=>r.dataset.tier===value).length>10);
  document.querySelector('#tier-filter button[data-tier="'+tier+'"]').click();
  const filtered=state(), tierCount=rows.filter(r=>r.dataset.tier===tier).length;
  pages[1].click(); const filteredSecond=state(), filterValid=visible().every(r=>r.dataset.tier===tier);
  document.querySelector('#tier-filter button[data-tier="all"]').click(); const filterReset=state();
  document.querySelector('thead th[data-key="additions"] button').click(); const sortReset=state(), additions=[];
  for (let page=1;page<=totalPages;page++) { pages[page-1].click();additions.push(...visible().map(r=>Number(r.dataset.additions))); }
  search.value='no-such-contributor-5a';search.dispatchEvent(new Event('input',{bubbles:true})); const empty=state(), emptyRow=!document.querySelector('#empty-row').hidden;
  search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
  return {total,totalPages,first,second,last,seen,search:{candidate,matching,searched,searchedSecond,searchReset},filter:{tier,tierCount,filtered,filteredSecond,filterValid,filterReset},sort:{sortReset,additions},empty,emptyRow,restored:state()};
})()`);
assert.equal(pagination.first.ids.length, 10);
assert.equal(pagination.first.count, `Showing 1–10 of ${pagination.total} contributors`);
assert.equal(pagination.first.previous, true);
assert.equal(pagination.second.current, '2');
assert.equal(pagination.second.ids.length, 10);
assert.equal(pagination.second.count, `Showing 11–20 of ${pagination.total} contributors`);
assert.equal(pagination.last.ids.length, pagination.total-(pagination.totalPages-1)*10);
assert.equal(pagination.last.next, true);
assert.equal(pagination.seen.length, pagination.total);
assert.equal(new Set(pagination.seen).size, pagination.total);
assert.ok(pagination.search.candidate);
assert.equal(pagination.search.searched.current, '1');
assert.equal(pagination.search.searchedSecond.current, '2');
assert.equal(pagination.search.searchedSecond.count, `Showing 11–${Math.min(20,pagination.search.matching)} of ${pagination.search.matching} contributors`);
assert.equal(pagination.search.searchReset.current, '1');
assert.ok(pagination.filter.tier);
assert.equal(pagination.filter.filtered.current, '1');
assert.equal(pagination.filter.filteredSecond.current, '2');
assert.equal(pagination.filter.filteredSecond.count, `Showing 11–${Math.min(20,pagination.filter.tierCount)} of ${pagination.filter.tierCount} contributors`);
assert.equal(pagination.filter.filterValid, true);
assert.equal(pagination.filter.filterReset.current, '1');
assert.equal(pagination.sort.sortReset.current, '1');
assert.deepEqual(pagination.sort.additions, [...pagination.sort.additions].sort((a,b)=>b-a));
assert.equal(pagination.empty.hidden, true);
assert.equal(pagination.emptyRow, true);
assert.equal(pagination.restored.current, '1');
console.log(JSON.stringify({pagination:{total:pagination.total,totalPages:pagination.totalPages,first:pagination.first.count,second:pagination.second.count,last:pagination.last.count,search:pagination.search.searchedSecond.count,filter:pagination.filter.filteredSecond.count,noDuplicates:true}}));

await evalJs('document.querySelectorAll("#contributor-pagination [data-page]")[1].focus()');
await call('Input.dispatchKeyEvent', { type:'keyDown', key:' ', code:'Space', windowsVirtualKeyCode:32 });
await call('Input.dispatchKeyEvent', { type:'keyUp', key:' ', code:'Space', windowsVirtualKeyCode:32 });
const pageFocus = await evalJs('({focused:document.activeElement.dataset.page==="2",visible:document.activeElement.matches(":focus-visible"),current:document.activeElement.getAttribute("aria-current"),status:document.querySelector("#count").textContent})');
assert.deepEqual(pageFocus, {focused:true,visible:true,current:'page',status:`Showing 11–20 of ${pagination.total} contributors`});
console.log(JSON.stringify({pageFocus}));
const sequentialPages = await evalJs(`(() => { const previous=document.querySelector('#page-previous'), next=document.querySelector('#page-next'), current=()=>document.querySelector('#contributor-pagination [aria-current="page"]').dataset.page; previous.click(); const back=current(); next.click(); return {back,forward:current(),url:location.href}; })()`);
assert.equal(sequentialPages.back, '1');
assert.equal(sequentialPages.forward, '2');
assert.equal(sequentialPages.url, `${siteUrl}/contributors`);
const pageTwoVote = await evalJs(`(() => { const button=document.querySelector('#contributor-rows tr[data-index]:not([hidden]) .hype-btn'); const login=button.dataset.hype; button.click(); document.querySelector('#contributor-pagination [data-page="1"]').click(); document.querySelector('#contributor-pagination [data-page="2"]').click(); const restored=document.querySelector('#contributor-rows tr[data-index]:not([hidden]) .hype-btn'); return {login,count:restored.querySelector('.hype-count').textContent,pressed:restored.getAttribute('aria-pressed'),page:document.querySelector('#contributor-pagination [aria-current="page"]').dataset.page}; })()`);
assert.equal(pageTwoVote.page, '2');
assert.equal(pageTwoVote.pressed, 'true');
assert.equal(pageTwoVote.count, '1');
await until(async () => (await getRequests('hit')).some(request => request.request.url.endsWith(`/${pageTwoVote.login}`)), 'page two Hype');
await clearRequests('hit', pageTwoVote.login, 0);
console.log(JSON.stringify({pageTwoVote}));

// Every Abacus request remains intercepted. No real vote can leave this browser.
for (const [name, initialGet, afterVoteGet, failHit] of [
  ['A-old-zero', null, 0, false],
  ['B-old-positive', null, 5, false],
  ['C-get-first', 5, null, false],
  ['D-duplicates', null, 5, false],
  ['E-hit-failure', null, 5, true],
]) {
  paused.length = 0;
  await call('Page.navigate', { url: `${siteUrl}/contributors?case=` + name });
  await until(() => evalJs('document.querySelectorAll(".hype-btn").length'), `${name} buttons`);
  const uniqueCount = await evalJs('new Set(Array.from(document.querySelectorAll(".hype-btn"),b=>b.dataset.hype)).size');
  await until(async () => (await getRequests('get')).length >= uniqueCount, `${name} initial GETs`);
  const initialRequests = [...await getRequests('get')];
  const initialIds = new Set(initialRequests.map(r=>r.requestId));
  if (initialGet !== null) {
    await clearRequests('get', target, initialGet, false, initialRequests);
    await until(() => evalJs(`document.querySelector('[data-hype="${target}"] .hype-count').textContent !== '—'`), `${name} initial count`);
  }
  const before = await evalJs(`(() => { const b=document.querySelector('[data-hype="${target}"]');return b.querySelector('.hype-count').textContent; })()`);
  await evalJs(`document.querySelector('[data-hype="${target}"]').click()`);
  await until(async () => (await getRequests('hit')).length > 0, `${name} HIT`);
  await clearRequests('hit', target, 0, failHit);
  if (!failHit) {
    await until(async () => (await getRequests('get')).some(r => !initialIds.has(r.requestId) && r.request.url.endsWith(`/${target}`)), `${name} refresh GET`);
  }
  if (afterVoteGet !== null) await clearRequests('get', target, afterVoteGet, false, initialRequests);
  if (!failHit) {
    const refresh = (await getRequests('get')).filter(r => !initialIds.has(r.requestId));
    await clearRequests('get', target, initialGet !== null ? initialGet+1 : afterVoteGet+1, false, refresh);
  }
  await pause(100);
  const after = await evalJs(`(() => { const bs=Array.from(document.querySelectorAll('[data-hype="${target}"]'));return {counts:bs.map(b=>b.querySelector('.hype-count').textContent), pressed:bs.map(b=>b.getAttribute('aria-pressed')), status:document.querySelector('#hype-status').textContent, stored:localStorage.getItem('hype-daily')}; })()`);
  console.log(JSON.stringify({ case:name, before, ...after }));
  const expected = failHit ? 1 : initialGet !== null ? initialGet+1 : afterVoteGet+1;
  assert.ok(after.counts.length > 1, `${name} duplicate representation`);
  assert.ok(after.counts.every(value=>value===String(expected)), `${name} expected ${expected}`);
  assert.ok(after.pressed.every(value=>value==='true'));
}
ws.close();
