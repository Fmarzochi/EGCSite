import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

// Uses an existing Puppeteer/Chromium installation; does not install dependencies.
// EGC_PUPPETEER_MODULE: module specifier or absolute path to puppeteer-core.
// EGC_CHROME: Chromium executable. EGC_BUILD_DIR: static Astro build to validate.
const { default: puppeteer } = await import(process.env.EGC_PUPPETEER_MODULE ?? 'puppeteer-core');
const buildDir = resolve(process.env.EGC_BUILD_DIR ?? 'dist');
const base = process.env.EGC_BASE_PATH ?? '/EGCSite/';
const phase = process.env.EGC_PHASE ?? 'after';
const before = phase === 'before';
const prefix = process.env.EGC_CAPTURE_PREFIX ?? `/tmp/egc-round7b3-${phase}`;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!path.startsWith(base)) { res.writeHead(404).end(); return; }
    let file = resolve(buildDir, path.slice(base.length) || '.');
    if (file !== buildDir && !file.startsWith(buildDir + sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
const pause = ms => new Promise(r => setTimeout(r, ms));
let browser;
let page;
let url;
let stage = 'starting local server';
let navigation;
const errors = [];
const failedLocalRequests = [];
const checks = [];
const measurements = [];

async function preparePage(target) {
  target.setDefaultTimeout(10000);
  target.setDefaultNavigationTimeout(15000);
  await target.setRequestInterception(true);
  target.on('request', request => {
    // QA uses only the locally served build; external fonts and analytics cannot delay navigation.
    const local = request.url().startsWith(new URL(url).origin + '/') || /^(data|blob):/.test(request.url());
    void (local ? request.continue() : request.abort()).catch(error => errors.push(`request interception: ${error.message}`));
  });
  target.on('requestfailed', request => {
    if (request.url().startsWith(new URL(url).origin + '/')) failedLocalRequests.push(`${request.url()}: ${request.failure()?.errorText}`);
  });
  target.on('pageerror', error => errors.push(error.message));
}

async function openHome(target) {
  const response = await target.goto(url, { waitUntil: 'domcontentloaded' });
  assert.equal(response?.status(), 200, `homepage response at ${url}`);
  await target.waitForSelector('.ben');
  await target.evaluate(() => document.fonts.ready);
  assert.equal(target.url(), url, 'homepage URL');
}

async function openHomeWithoutJavaScript(target) {
  const response = await target.goto(url, { waitUntil: 'domcontentloaded' });
  assert.equal(response?.status(), 200, `no-JavaScript homepage response at ${url}`);
  assert.equal(target.url(), url, 'no-JavaScript homepage URL');
  // DOMContentLoaded is sufficient here. Evaluating document.fonts.ready in a
  // JavaScript-disabled context can yield Chromium's "Promise was collected".
  const identity = await target.evaluate(() => ({ home: !!document.querySelector('.ben'), ready: document.readyState, enhanced: document.documentElement.classList.contains('js') }));
  assert.equal(identity.home, true, 'no-JavaScript homepage content');
  assert.notEqual(identity.ready, 'loading', 'no-JavaScript DOM ready');
  assert.equal(identity.enhanced, false, 'homepage scripts did not execute');
}

async function captureStaticSection(target, selector, path) {
  const clip = await target.$eval(selector, element => {
    const rect = element.getBoundingClientRect();
    return { x: 0, y: rect.top + scrollY, width: innerWidth, height: rect.height };
  });
  await target.screenshot({ path, clip, captureBeyondViewport: true });
}

async function waitForVisualState(target, selector) {
  await target.waitForFunction(selector => {
    const root = document.querySelector(selector);
    if (!root) return false;
    const pending = [...root.querySelectorAll('.rv.is-pending, .metric.is-pending')]
      .some(element => element.getClientRects().length > 0);
    const running = root.getAnimations({ subtree: true }).some(animation =>
      animation.playState === 'running' && Number.isFinite(animation.effect?.getComputedTiming().endTime));
    return !pending && !running;
  }, {}, selector);
}

async function followAndReturn(target, selector, expectedUrl, expectedHeading, expectedCatalogCount) {
  const origin = target.url();
  navigation = { selector, origin, expectedUrl, step: 'before click' };
  assert.equal(origin, url, `source URL before ${selector}`);
  navigation.historyLengthBefore = await target.evaluate(() => history.length);
  const href = await target.$eval(selector, anchor => anchor.href);
  assert.equal(href, expectedUrl, `link destination for ${selector}`);
  navigation.step = 'waiting for destination';
  const [destination] = await Promise.all([
    target.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    target.click(selector),
  ]);
  assert.equal(destination?.status(), 200, `destination response for ${selector}`);
  assert.equal(target.url(), expectedUrl, `destination URL for ${selector}`);
  navigation.historyLengthAtDestination = await target.evaluate(() => history.length);
  assert.ok(navigation.historyLengthAtDestination > 1, `history exists after ${selector}`);
  const heading = await target.$eval('h1', element => element.textContent.trim());
  assert.ok(heading.includes(expectedHeading), `destination heading for ${selector}: ${heading}`);
  if (expectedCatalogCount) {
    const count = await target.evaluate(path => new Set([...document.querySelectorAll('a[href]')]
      .map(anchor => new URL(anchor.href).pathname)
      .filter(route => route.startsWith(path) && route !== path)).size, new URL(expectedUrl).pathname);
    assert.equal(count, expectedCatalogCount, `complete integration catalog at ${expectedUrl}`);
  }
  navigation.step = 'returning through history';
  const returned = await target.goBack({ waitUntil: 'domcontentloaded' });
  assert.ok(returned === null || returned.status() === 200, `return response for ${selector}`);
  assert.equal(target.url(), origin, `return URL for ${selector}`);
  await target.waitForSelector('.ben');
  await target.waitForSelector('.tgrid--featured a.tile');
  navigation = undefined;
}

async function saveFailure(error) {
  const diagnosis = { stage, navigation, message: error.stack ?? String(error), url: page?.isClosed() ? null : page?.url(), errors, failedLocalRequests, checks };
  if (page && !page.isClosed()) {
    try {
      diagnosis.page = await page.evaluate(() => ({ title: document.title, readyState: document.readyState, historyLength: history.length, home: !!document.querySelector('.ben'), activeElement: document.activeElement?.outerHTML?.slice(0, 300) }));
      await page.screenshot({ path: `${prefix}-failure.png`, fullPage: true });
      diagnosis.screenshot = `${prefix}-failure.png`;
    } catch (captureError) { diagnosis.captureError = String(captureError); }
  }
  await writeFile(`${prefix}-failure.json`, JSON.stringify(diagnosis, null, 2));
  console.error(JSON.stringify(diagnosis, null, 2));
}
async function captureSection(page, selector, path) {
  const clip = await page.$eval(selector, e => {
    const r = e.getBoundingClientRect();
    return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height };
  });
  // Visit the complete section so existing scroll reveals also show below-fold
  // paragraphs; no page styles or content are changed for the capture.
  for (let y = clip.y; y < clip.y + clip.height; y += 600) {
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  }
  await waitForVisualState(page, selector);
  // Capture in document coordinates with the fixed header outside the crop.
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  await page.screenshot({ path, clip, captureBeyondViewport: true });
}
try {
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  url = `http://127.0.0.1:${server.address().port}${base}`;
  stage = 'launching Chromium';
  browser = await puppeteer.launch({ executablePath: process.env.EGC_CHROME, headless: true, args: ['--disable-dev-shm-usage'] });
  page = await browser.newPage();
  await preparePage(page);
  for (const width of [320, 375, 430, 768, 1024, 1280, 1440, 1920]) {
    stage = `responsive homepage ${width}px`;
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1, hasTouch: width <= 430 });
    await openHome(page);
    await page.$eval('.ben', e => e.scrollIntoView({ behavior: 'instant' }));
    if ([375, 1440].includes(width)) await captureSection(page, '.ben', `${prefix}-${width}-problem.png`);
    await page.$eval('[data-demo]', e => e.scrollIntoView({ behavior: 'instant', block: 'center' }));
    if (before) {
      const playing = await page.$eval('[data-demo-play]', e => e.dataset.playing === 'true');
      if (playing) await page.click('[data-demo-play]');
      await page.click('[data-step="5"]');
    } else {
      const sizes = [];
      for (let n = 1; n <= 5; n++) {
        stage = `responsive demo ${width}px tab ${n}/5`;
        await page.click(`#demo-tab-${n}`);
        const state = await page.evaluate(n => {
          const tabs = [...document.querySelectorAll('.demo [role="tab"]')];
          const panels = [...document.querySelectorAll('.demo [role="tabpanel"]')];
          const active = panels.filter(p => !p.inert);
          const panel = document.getElementById(`demo-panel-${n}`);
          const tab = document.getElementById(`demo-tab-${n}`);
          return {
            selected: tabs.filter(t => t.getAttribute('aria-selected') === 'true').map(t => t.id),
            visible: active.map(p => p.id),
            text: panel.innerText,
            description: window.EGC_I18N.pt[`demo.d${n}`].replace(/<[^>]*>/g, ''),
            labelled: panel.getAttribute('aria-labelledby') === tab.id && tab.getAttribute('aria-controls') === panel.id,
            hidden: panels.filter(p => p !== panel).every(p => p.inert && p.getAttribute('aria-hidden') === 'true' && getComputedStyle(p).visibility === 'hidden'),
            height: document.querySelector('[data-demo]').getBoundingClientRect().height,
            overflow: document.documentElement.scrollWidth > innerWidth,
            target: { width: tab.getBoundingClientRect().width, height: tab.getBoundingClientRect().height },
          };
        }, n);
        assert.deepEqual(state.selected, [`demo-tab-${n}`], `selected tab ${width}/${n}`);
        assert.deepEqual(state.visible, [`demo-panel-${n}`], `visible panel ${width}/${n}`);
        assert.ok(state.labelled && state.hidden, `panel semantics ${width}/${n}`);
        assert.ok(state.text.includes(state.description), `original description ${width}/${n}`);
        assert.equal(state.overflow, false, `overflow ${width}/${n}`);
        assert.ok(state.target.width >= 44 && state.target.height >= 44, `touch target ${width}/${n}`);
        sizes.push(state.height);
      }
      assert.ok(Math.max(...sizes) - Math.min(...sizes) < 1, `stable demo height ${width}`);
      await page.click('#demo-tab-1');
      checks.push(`${width}px: all 5 tabs, correct content, hidden panels inert, targets >=44px, stable height, no overflow`);
    }
    const m = await page.evaluate(() => {
      const measure = selector => {
        const e = document.querySelector(selector), r = e.getBoundingClientRect(), s = getComputedStyle(e), w = e.querySelector(':scope > .wrap');
        return { height: +r.height.toFixed(1), usefulWidth: +(w.clientWidth - parseFloat(getComputedStyle(w).paddingLeft) * 2).toFixed(1), paddingTop: s.paddingTop, paddingBottom: s.paddingBottom, controls: [...e.querySelectorAll('button,summary')].filter(b => b.getClientRects().length && getComputedStyle(b).visibility !== 'hidden').length };
      };
      return { width: innerWidth, problem: measure('.ben'), demo: measure('.demo-sec'), features: measure('.fx'), integrations: measure('.int'), featureBlocks: document.querySelectorAll('.fitem').length, featuredTools: document.querySelectorAll('.tgrid--featured a.tile').length, pageHeight: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth > innerWidth,
        ctas: [...document.querySelectorAll('.hero__actions a')].map(a => ({ href: a.getAttribute('href'), width: a.getBoundingClientRect().width, height: a.getBoundingClientRect().height })),
        links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).sort() };
    });
    assert.equal(m.overflow, false, `page overflow ${width}`);
    assert.deepEqual(m.ctas.map(cta => cta.href), ['#instalar', '#demo'], `hero CTAs ${width}`);
    assert.ok(m.ctas.every(cta => cta.width >= 44 && cta.height >= 44), `hero CTA targets ${width}`);
    measurements.push(m);
    if (!before) {
      const round7b = await page.evaluate(() => {
        const features = [...document.querySelectorAll('.fitem')];
        const tools = [...document.querySelectorAll('.tgrid--featured a.tile')];
        const catalog = document.querySelector('.int__more a[href]');
        return {
          features: features.map(e => ({ heading: e.querySelector('h3')?.textContent, benefit: e.querySelector('.fitem__short')?.textContent, details: !!e.querySelector('details > summary'), body: !!e.querySelector('.fitem__more p'), link: e.querySelector('.fitem__more a')?.href, visual: !!e.querySelector('.viz') })),
          tools: tools.map(e => ({ name: e.querySelector('b')?.textContent, href: e.href, level: e.querySelector('small')?.textContent })),
          catalog: { href: catalog?.href, text: catalog?.textContent.trim() },
          providerCount: document.querySelectorAll('.tgrid--prov > li:not([aria-hidden])').length,
          controls: document.querySelectorAll('.int button').length,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert.equal(round7b.features.length, 4, `four capabilities ${width}`);
      assert.ok(round7b.features.every(f => f.heading && f.benefit && f.details && f.body && f.link && f.visual), `capability content ${width}`);
      assert.equal(round7b.tools.length, 8, `featured tools ${width}`);
      assert.equal(new Set(round7b.tools.map(t => t.href)).size, 8, `unique tools ${width}`);
      assert.ok(round7b.tools.every(t => t.name && t.level && t.href.startsWith(url + 'integrations/')), `tool links ${width}`);
      assert.equal(round7b.catalog.href, url + 'integrations/');
      assert.equal(round7b.providerCount, 10);
      assert.equal(round7b.controls, 0, `integrations need no JavaScript ${width}`);
      assert.equal(round7b.overflow, false);
      for (const tool of round7b.tools) assert.equal((await fetch(tool.href)).status, 200, tool.href);
      checks.push(`${width}px: 4 complete capabilities; 8 unique integration links; 10 providers; catalog reachable; no overflow`);
    }
    if ([375, 1440].includes(width)) {
      await captureSection(page, '.demo-sec', `${prefix}-${width}-demo.png`);
      const clip = await page.evaluate(() => {
        const a = document.querySelector('.ben').getBoundingClientRect(), b = document.querySelector('.demo-sec').getBoundingClientRect();
        return { x: 0, y: a.top + scrollY, width: innerWidth, height: b.bottom - a.top };
      });
      await page.screenshot({ path: `${prefix}-${width === 375 ? 'mobile' : 'desktop'}.png`, clip });
      if (!before) {
        await captureSection(page, '.fx', `${prefix}-${width}-features.png`);
        await captureSection(page, '.int', `${prefix}-${width}-integrations.png`);
        for (let y = 0; y < m.pageHeight; y += 750) {
          await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await waitForVisualState(page, 'body');
        await page.screenshot({ path: `${prefix}-${width}-home.png`, fullPage: true });
      }
    }
  }
  if (!before) {
    stage = 'feature scroll indicator';
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await openHome(page);
    const featureHeight = await page.$eval('.fx', element => element.getBoundingClientRect().height);
    for (const n of [1, 2, 3, 4, 3, 2, 1]) {
      stage = `feature scroll indicator ${n}`;
      await page.$eval(`.fitem[data-f="${n}"]`, element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(n => document.querySelector('[data-fx-list]').getAttribute('data-active') === String(n), {}, n);
      const indicator = await page.evaluate(n => {
        const article = document.querySelector(`.fitem[data-f="${n}"]`);
        const rect = article.getBoundingClientRect();
        return {
          mark: document.querySelector('[data-fx-mark]').getAttribute('data-active'),
          number: document.querySelector('[data-fx-num]').textContent,
          name: document.querySelector('[data-fx-name]').textContent,
          articleName: article.querySelector('.fitem__num span').textContent,
          centered: rect.top < innerHeight / 2 && rect.bottom > innerHeight / 2,
          sectionHeight: document.querySelector('.fx').getBoundingClientRect().height,
          activeCount: document.querySelectorAll('.fitem.is-active').length,
        };
      }, n);
      assert.equal(indicator.mark, String(n), `feature petal ${n}`);
      assert.equal(indicator.number, `0${n}`, `feature number ${n}`);
      assert.equal(indicator.name, indicator.articleName, `feature name ${n}`);
      assert.equal(indicator.centered, true, `dominant feature ${n}`);
      assert.equal(indicator.activeCount, 1, `one active feature ${n}`);
      assert.equal(indicator.sectionHeight, featureHeight, `no feature layout shift ${n}`);
    }
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const n of [4, 1]) {
      stage = `reduced motion feature scroll indicator ${n}`;
      await page.$eval(`.fitem[data-f="${n}"]`, element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(n => document.querySelector('[data-fx-mark]').getAttribute('data-active') === String(n), {}, n);
    }
    checks.push('Feature indicator: 1→4→1 follows centered article, stable height, and updates with reduced motion');
    stage = 'demo keyboard and touch';
    await page.setViewport({ width: 375, height: 900, hasTouch: true });
    await openHome(page);
    await page.$eval('#demo-tab-1', e => e.focus());
    for (const [key, n] of [['ArrowRight', 2], ['End', 5], ['ArrowRight', 1], ['ArrowLeft', 5], ['Home', 1]]) {
      await page.keyboard.press(key);
      const focus = await page.evaluate(() => ({ id: document.activeElement.id, visible: document.activeElement.matches(':focus-visible'), outline: getComputedStyle(document.activeElement).outlineWidth }));
      assert.equal(focus.id, `demo-tab-${n}`);
      assert.equal(focus.visible, true);
      assert.ok(parseFloat(focus.outline) >= 2);
    }
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'demo-panel-1');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'demo-tab-1');
    await page.tap('#demo-tab-5');
    assert.equal(await page.$eval('#demo-tab-5', e => e.getAttribute('aria-selected')), 'true');
    await page.tap('#demo-tab-1');
    await pause(4500);
    assert.equal(await page.$eval('#demo-tab-1', e => e.getAttribute('aria-selected')), 'true', 'no autoplay');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.tap('#demo-tab-4');
    assert.equal(await page.$eval('#demo-tab-4', e => e.getAttribute('aria-selected')), 'true');
    await page.waitForFunction(() => document.querySelector('[data-demo]').getAnimations({ subtree: true }).every(a => a.playState !== 'running'));
    assert.equal(await page.$eval('[data-demo]', e => e.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0);
    await page.$eval('[data-set-lang="en"]', e => e.click());
    assert.equal(await page.$eval('#demo-panel-4 h3', e => e.textContent), 'EGC restores the decision');
    await page.$eval('[data-set-lang="pt"]', e => e.click());
    checks.push('Keyboard ArrowLeft/Right, Home/End, Tab/Shift+Tab; visible focus; touch; no autoplay; reduced motion; PT/EN');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    stage = 'feature details keyboard and touch';
    const featureSummary = '#memoria details > summary';
    const featureDetails = '#memoria details';
    await page.focus(featureSummary);
    assert.equal(await page.$eval(featureSummary, e => document.activeElement === e), true, 'feature summary has focus before opening');
    await page.keyboard.press('Enter');
    await page.waitForFunction(selector => document.querySelector(selector).open, {}, featureDetails);
    assert.equal(await page.$eval(featureDetails, e => e.open), true, 'feature details keyboard activation');
    assert.equal(await page.$eval(featureSummary, e => e.matches(':focus-visible')), true, 'feature focus visible');
    assert.equal(await page.$eval(featureSummary, e => document.activeElement === e), true, 'feature summary keeps focus before closing');
    await page.keyboard.press('Enter');
    await page.waitForFunction(selector => !document.querySelector(selector).open, {}, featureDetails);
    assert.equal(await page.$eval(featureDetails, e => e.open), false, 'feature details close with Enter');
    await page.$eval(featureSummary, e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForFunction(() => {
      const article = document.querySelector('#memoria');
      return !article.classList.contains('is-pending') && article.getAnimations().every(animation => animation.playState !== 'running');
    });
    const touchHit = await page.$eval(featureSummary, summary => {
      const rect = summary.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return { summary: hit === summary || summary.contains(hit), element: hit?.tagName, className: hit?.getAttribute('class') };
    });
    assert.equal(touchHit.summary, true, `feature summary must be the touch target: ${JSON.stringify(touchHit)}`);
    await page.evaluate(selector => {
      const summary = document.querySelector(selector);
      const events = [];
      const controller = new AbortController();
      for (const type of ['touchstart', 'touchend', 'click']) {
        document.addEventListener(type, event => {
          events.push({ type, target: event.target.tagName, summary: event.target === summary || summary.contains(event.target), open: summary.parentElement.open });
        }, { capture: true, signal: controller.signal });
      }
      window.__egcFeatureTapProbe = { before: summary.parentElement.open, events, controller };
    }, featureSummary);
    const touchConsoleErrors = [];
    const onTouchConsole = message => { if (message.type() === 'error') touchConsoleErrors.push(message.text()); };
    page.on('console', onTouchConsole);
    await page.tap(featureSummary);
    let touchWaitError;
    try {
      await page.waitForFunction(() => window.__egcFeatureTapProbe.events.some(event => event.type === 'click'));
    } catch (error) {
      touchWaitError = error;
    }
    const touchProbe = await page.evaluate(() => ({
      before: window.__egcFeatureTapProbe.before,
      after: document.querySelector('#memoria details').open,
      events: window.__egcFeatureTapProbe.events,
      focused: document.activeElement?.tagName,
    }));
    await page.evaluate(() => {
      window.__egcFeatureTapProbe.controller.abort();
      delete window.__egcFeatureTapProbe;
    });
    page.off('console', onTouchConsole);
    const touchDiagnostic = JSON.stringify({ ...touchProbe, consoleErrors: touchConsoleErrors, pageErrors: errors });
    if (touchWaitError) throw new Error(`touch produced no click: ${touchDiagnostic}`, { cause: touchWaitError });
    assert.equal(touchProbe.before, false, `feature closed before touch: ${touchDiagnostic}`);
    for (const type of ['touchstart', 'touchend', 'click']) {
      assert.ok(touchProbe.events.some(event => event.type === type && event.summary), `summary missed ${type}: ${touchDiagnostic}`);
    }
    assert.equal(touchProbe.events.filter(event => event.type === 'click' && event.summary).length, 1, `unexpected touch click count: ${touchDiagnostic}`);
    assert.equal(touchProbe.after, true, `feature did not open after touch click: ${touchDiagnostic}`);
    await page.waitForFunction(selector => {
      const details = document.querySelector(selector);
      return details.open && details.querySelector('.fitem__more').getAnimations().every(animation => animation.playState !== 'running');
    }, {}, featureDetails);
    assert.equal(await page.$eval(featureDetails, e => e.open), true, 'feature details open with touch and remain open');
    checks.push('Feature details: keyboard, visible focus, touch');
    stage = 'eight integration links and browser history';
    const featured = await page.$$eval('.tgrid--featured a.tile', anchors => anchors.map(anchor => ({ href: anchor.href, name: anchor.querySelector('b')?.textContent.trim() })));
    assert.equal(featured.length, 8, 'featured links available for navigation');
    for (let index = 0; index < featured.length; index++) {
      stage = `integration ${index + 1}/8: ${featured[index].name}`;
      await followAndReturn(page, `.tgrid--featured li:nth-child(${index + 1}) a.tile`, featured[index].href, featured[index].name);
    }
    stage = 'integration catalog and browser history';
    await followAndReturn(page, '.int__more a', url + 'integrations/', 'One brain', 28);
    checks.push('Eight integration pages and complete catalog: link click, 200 response, heading, history return, functional homepage');
    stage = 'hero CTAs';
    for (const hash of ['#demo', '#instalar']) {
      await page.click(`.hero__actions a[href="${hash}"]`);
      await page.waitForFunction(expected => location.hash === expected && !!document.querySelector(expected), {}, hash);
    }
    checks.push('Hero CTAs: demo and install anchors activate; both targets exist and are at least 44px at all eight widths');
    stage = 'navbar and internal links';
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.focus('.burger');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement.closest('#mnav'));
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'burger');
    const localLinks = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith(location.origin) && !h.includes('#')))]);
    for (const link of localLinks) assert.equal((await fetch(link)).status, 200, link);
    checks.push(`Navbar menu/Escape/focus and ${localLinks.length} internal links`);
    stage = 'fallback without JavaScript';
    const interactivePage = page;
    for (const width of [375, 1440]) {
      stage = `fallback without JavaScript ${width}px`;
      const fallbackPage = await browser.newPage();
      page = fallbackPage;
      await preparePage(fallbackPage);
      await fallbackPage.setViewport({ width, height: 900 });
      await fallbackPage.setJavaScriptEnabled(false);
      await openHomeWithoutJavaScript(fallbackPage);
      const fallback = await fallbackPage.evaluate(() => ({
        panels: [...document.querySelectorAll('.demo__panel')].map(p => ({ text: p.innerText, visible: p.getBoundingClientRect().height > 0 && getComputedStyle(p).visibility === 'visible', inert: p.inert })),
        controls: (() => { const tabs = document.querySelector('.demo__tabs'); return tabs.hidden && getComputedStyle(tabs).display === 'none'; })(),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      assert.equal(fallback.panels.length, 5, `five no-JavaScript steps ${width}`);
      assert.ok(fallback.panels.every(p => p.visible && !p.inert && p.text.length > 80), `readable no-JavaScript steps ${width}`);
      assert.equal(fallback.controls, true, `inactive demo controls hidden ${width}`);
      assert.equal(fallback.overflow, false, `no-JavaScript overflow ${width}`);
      const staticSections = await fallbackPage.evaluate(() => ({
        features: [...document.querySelectorAll('.fitem')].map(e => ({ heading: e.querySelector('h3')?.textContent, summary: e.querySelector('summary')?.textContent, body: e.querySelector('.fitem__more')?.textContent, link: e.querySelector('.fitem__more a')?.href, visible: e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility === 'visible', inert: e.inert })),
        tools: [...document.querySelectorAll('.tgrid--featured a.tile')].map(e => ({ href: e.href, visible: e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility === 'visible' })),
        catalog: document.querySelector('.int__more a')?.href,
      }));
      assert.equal(staticSections.features.length, 4, `four no-JavaScript capabilities ${width}`);
      assert.ok(staticSections.features.every(f => f.heading && f.summary && f.body.length > 50 && f.link && f.visible && !f.inert), `complete no-JavaScript capabilities ${width}`);
      assert.equal(staticSections.tools.length, 8, `eight no-JavaScript integration links ${width}`);
      assert.ok(staticSections.tools.every(tool => tool.visible && tool.href.startsWith(url + 'integrations/')), `accessible no-JavaScript integration links ${width}`);
      for (const tool of staticSections.tools) assert.equal((await fetch(tool.href)).status, 200, `no-JavaScript integration destination ${width}: ${tool.href}`);
      assert.equal(staticSections.catalog, url + 'integrations/', `no-JavaScript catalog link ${width}`);
      if (width === 375) {
        stage = 'fallback without JavaScript native details and navigation 375px';
        await fallbackPage.click('#memoria details > summary');
        assert.equal(await fallbackPage.$eval('#memoria details', element => element.open), true, 'native details opens without JavaScript');
        await fallbackPage.click('#memoria details > summary');
        assert.equal(await fallbackPage.$eval('#memoria details', element => element.open), false, 'native details closes without JavaScript');
        const destinationUrl = staticSections.tools[0].href;
        navigation = { origin: url, expectedUrl: destinationUrl, step: 'no-JavaScript link' };
        const [destination] = await Promise.all([
          fallbackPage.waitForNavigation({ waitUntil: 'domcontentloaded' }),
          fallbackPage.click('.tgrid--featured a.tile'),
        ]);
        assert.equal(destination?.status(), 200, 'no-JavaScript integration response');
        assert.equal(fallbackPage.url(), destinationUrl, 'no-JavaScript integration URL');
        assert.ok((await fallbackPage.$eval('h1', element => element.textContent)).includes('Claude Code'), 'no-JavaScript integration content');
        navigation.step = 'no-JavaScript history return';
        const returned = await fallbackPage.goBack({ waitUntil: 'domcontentloaded' });
        assert.ok(returned === null || returned.status() === 200, 'no-JavaScript history response');
        assert.equal(fallbackPage.url(), url, 'no-JavaScript return URL');
        assert.equal(await fallbackPage.$eval('.demo__panel', element => element.getBoundingClientRect().height > 0), true, 'no-JavaScript homepage remains readable after return');
        navigation = undefined;
        await captureStaticSection(fallbackPage, '.demo-sec', `${prefix}-375-no-js.png`);
      }
      checks.push(`${width}px no JavaScript: five readable steps, hidden controls, four capabilities, eight visible links, no overflow`);
      await fallbackPage.close();
      page = interactivePage;
    }
    checks.push('No JavaScript: native details and integration navigation/return work at 375px');
  }
  stage = 'reduced motion mobile menu';
  const menuPage = await browser.newPage();
  page = menuPage;
  await preparePage(menuPage);
  await menuPage.setViewport({ width: 375, height: 900 });
  await menuPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await openHome(menuPage);
  await menuPage.focus('.burger');
  await menuPage.keyboard.press('Enter');
  await menuPage.waitForFunction(() => {
    const menu = document.querySelector('#mnav');
    return document.querySelector('.burger').getAttribute('aria-expanded') === 'true'
      && menu.getAttribute('data-open') === 'true'
      && getComputedStyle(menu).visibility === 'visible';
  });
  const menuAutoFocus = await menuPage.evaluate(() => Boolean(document.activeElement.closest('#mnav')));
  if (!menuAutoFocus) await menuPage.keyboard.press('Tab');
  assert.equal(await menuPage.evaluate(() => Boolean(document.activeElement.closest('#mnav'))), true, 'mobile menu keyboard access');
  assert.equal(await menuPage.evaluate(() => document.activeElement.matches(':focus-visible')), true, 'mobile menu visible focus');
  await menuPage.keyboard.press('Escape');
  assert.equal(await menuPage.evaluate(() => document.activeElement.className), 'burger');
  assert.equal(await menuPage.$eval('.burger', button => button.getAttribute('aria-expanded')), 'false', 'mobile menu closes on Escape');
  if (!menuAutoFocus) console.warn('Reduced-motion mobile menu: automatic focus did not occur; Tab reached the menu.');
  checks.push(`Reduced-motion mobile menu: automatic focus=${menuAutoFocus}; keyboard access, visible focus, and Escape verified`);
  await menuPage.close();
  assert.deepEqual(errors, [], 'browser runtime errors');
  assert.deepEqual(failedLocalRequests, [], 'local resource requests');
  await writeFile(`${prefix}-metrics.json`, JSON.stringify({ phase, base, measurements, checks }, null, 2));
  console.log(JSON.stringify({ phase, base, measurements: measurements.map(({ links, ...m }) => m), checks }, null, 2));
} catch (error) {
  try { await saveFailure(error); } catch (diagnosticError) { console.error('Could not save browser diagnosis:', diagnosticError); }
  throw error;
} finally {
  if (browser) await browser.close();
  if (server.listening) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
