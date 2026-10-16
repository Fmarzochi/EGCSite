// Behaviour of the home, ported from the inline script of src/pages/index.astro.
// The code is the original; only the runtime language switch is gone, because each language
// is its own static page now (/ and /en/). `D` holds the texts the script swaps in at runtime
// (copy feedback, menu label, active feature name), already in the page language.
export function initHome(D) {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function t(k) { return D[k] != null ? D[k] : k; }

  /* =========================================================== i18n */
  function applyAttrs(el) {
    el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
      var p = pair.split(':'); el.setAttribute(p[0], t(p[1]));
    });
  }
  var hooks = [];

  /* =========================================================== header + menu */
  var hdr = $('.hdr');
  var hdrScrolled = null;
  function onScrollHdr() { var s = window.scrollY > 24; if (s !== hdrScrolled) { hdrScrolled = s; hdr.setAttribute('data-scrolled', String(s)); } }
  onScrollHdr(); window.addEventListener('scroll', onScrollHdr, { passive: true });

  var burger = $('.burger'), mnav = $('#mnav'), menuTimer;
  function setMenu(open) {
    clearTimeout(menuTimer);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('data-i18n-attr', 'aria-label:' + (open ? 'a.menuClose' : 'a.menuOpen')); applyAttrs(burger);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      mnav.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        mnav.setAttribute('data-open', 'true'); var first = $('a', mnav); if (first) first.focus();
      }); });
    } else {
      mnav.setAttribute('data-open', 'false');
      menuTimer = setTimeout(function () { mnav.hidden = true; }, reduce ? 0 : 420);
    }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
    if (e.key === 'Tab' && burger.getAttribute('aria-expanded') === 'true') {
      var f = [burger].concat($$('a, button', mnav)); var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', function (m) { if (m.matches && burger.getAttribute('aria-expanded') === 'true') setMenu(false); });

  // active nav link
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a[href^="#"]');
    var navIO = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['demo', 'funcoes', 'integracoes', 'instalar'].forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
  }

  /* =========================================================== copy */
  function copyText(text) {
    var fallback = function () {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); var ok;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove(); return ok;
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
  }
  var status = $('[data-term-status]');
  function flash(btn, ok) {
    var label = $('[data-copy-label]', btn), key = btn.getAttribute('data-label-key');
    clearTimeout(btn._t);
    btn.setAttribute('data-state', ok ? 'done' : 'error');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- comma expression kept from the original script
    if (label) label.setAttribute('data-i18n', ok ? 'ui.copied' : 'ui.copyFail'), label.innerHTML = t(ok ? 'ui.copied' : 'ui.copyFail');
    if (status && btn.hasAttribute('data-copy-active')) { status.setAttribute('data-i18n', ok ? 'ui.copiedMsg' : 'ui.copyFailMsg'); status.innerHTML = t(ok ? 'ui.copiedMsg' : 'ui.copyFailMsg'); }
    btn._t = setTimeout(function () {
      btn.setAttribute('data-state', '');
      if (label) { label.setAttribute('data-i18n', key); label.innerHTML = t(key); }
      if (status && btn.hasAttribute('data-copy-active')) { status.removeAttribute('data-i18n'); status.textContent = ''; }
    }, 2400);
  }
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () { copyText(btn.getAttribute('data-copy')).then(function (ok) { flash(btn, ok); }); });
  });

  /* =========================================================== install tabs */
  var tabs = $$('.term__tab');
  function selectTab(tab, focus) {
    tabs.forEach(function (x) {
      var on = x === tab; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls'));
      if (p) { p.hidden = !on; if (on && !reduce) { p.classList.remove('is-in'); void p.offsetWidth; p.classList.add('is-in'); } }
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (x, i) {
    x.addEventListener('click', function () { selectTab(x); });
    x.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = (i + 1) % tabs.length; else if (k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0; else if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); selectTab(tabs[n], true); }
    });
  });
  var copyActive = $('[data-copy-active]');
  if (copyActive) copyActive.addEventListener('click', function () {
    var p = $('.term__panel:not([hidden])'); copyText(p ? p.getAttribute('data-cmd') : '').then(function (ok) { flash(copyActive, ok); });
  });

  /* =========================================================== reveals */
  var rv = $$('.rv, .metric');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('is-pending'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    rv.forEach(function (el) { if (el.getBoundingClientRect().top > window.innerHeight * 0.92) { el.classList.add('is-pending'); io.observe(el); } });
    setTimeout(function () { rv.forEach(function (el) { el.classList.remove('is-pending'); }); }, 7000);
    window.addEventListener('beforeprint', function () { rv.forEach(function (el) { el.classList.remove('is-pending'); }); });
  }

  /* =========================================================== hero: anchor mark to title + parallax */
  var heroMain = $('[data-hero-main]'), l1 = $('[data-l1]');
  function measureTitle() { if (heroMain && l1) heroMain.style.setProperty('--l1w', l1.offsetWidth + 'px'); }
  hooks.push(measureTitle);
  window.addEventListener('resize', measureTitle);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureTitle);

  var hero = $('[data-hero]');
  // The hero mark and orbits spin forever; stop them while the hero is scrolled out of view.
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { hero.toggleAttribute('data-offscreen', !en[0].isIntersecting); }).observe(hero);
  }
  if (hero && !reduce && window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var loop = function () {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      hero.style.setProperty('--mx', cx.toFixed(4)); hero.style.setProperty('--my', cy.toFixed(4));
      raf = (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) ? requestAnimationFrame(loop) : 0;
    };
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* =========================================================== benefit lanes */
  var lanes = $('[data-lanes]'), clips = lanes ? $$('.lane-clip', lanes) : [];
  if (lanes && clips.length && !reduce) {
    var maxP = 0, tick = false;
    var upd = function () {
      var r = lanes.getBoundingClientRect(), vh = window.innerHeight;
      maxP = Math.max(maxP, Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.55 + r.height * 0.35))));
      clips.forEach(function (c) { c.setAttribute('width', String(Math.max(0.001, maxP * 300))); });
      tick = false;
    };
    upd();
    window.addEventListener('scroll', function () { if (!tick && maxP < 1) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  }

  /* =========================================================== demo tabs */
  var demo = $('[data-demo]');
  if (demo) {
    var demoTabs = $$('.step', demo), demoPanels = $$('.demo__panel', demo);
    var demoTablist = $('.demo__tabs', demo);
    function selectDemoTab(tab, focus) {
      demoTabs.forEach(function (button, i) {
        var on = button === tab, panel = demoPanels[i];
        button.setAttribute('aria-selected', String(on));
        button.tabIndex = on ? 0 : -1;
        panel.inert = !on;
        panel.tabIndex = on ? 0 : -1;
        if (on) panel.removeAttribute('aria-hidden');
        else panel.setAttribute('aria-hidden', 'true');
      });
      if (focus) tab.focus();
    }
    demoTabs.forEach(function (tab, i) {
      tab.setAttribute('role', 'tab');
      demoPanels[i].setAttribute('role', 'tabpanel');
      demoPanels[i].setAttribute('aria-labelledby', tab.id);
      tab.addEventListener('click', function () { selectDemoTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % demoTabs.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + demoTabs.length) % demoTabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = demoTabs.length - 1;
        if (n !== null) { e.preventDefault(); selectDemoTab(demoTabs[n], true); }
      });
    });
    demoTablist.setAttribute('role', 'tablist');
    selectDemoTab(demoTabs[0]);
    demo.setAttribute('data-enhanced', '');
    demoTablist.hidden = false;
  }

  /* =========================================================== features: active petal + visuals in view */
  var fxMark = $('[data-fx-mark]'), fxList = $('[data-fx-list]'), fxNum = $('[data-fx-num]'), fxName = $('[data-fx-name]');
  var items = $$('.fitem');
  function activate(el) {
    var n = el.getAttribute('data-f');
    if (fxMark) fxMark.setAttribute('data-active', n);
    if (fxList) fxList.setAttribute('data-active', n);
    items.forEach(function (x) { x.classList.toggle('is-active', x === el); });
    if (fxNum) fxNum.textContent = '0' + n;
    if (fxName) { fxName.setAttribute('data-i18n', 'f' + n + '.name'); fxName.innerHTML = t('f' + n + '.name'); }
  }
  if ('IntersectionObserver' in window) {
    // Entries can arrive out of order after a jump (anchor, scrollIntoView) while the .rv reveal is
    // still moving items, so pick the item that is actually at the reading line instead.
    var activateAtLine = function () {
      var line = window.innerHeight * 0.45, best = null, bestD = Infinity;
      items.forEach(function (x) {
        var r = x.getBoundingClientRect(), d = r.top > line ? r.top - line : (r.bottom < line ? line - r.bottom : 0);
        if (d < bestD) { bestD = d; best = x; }
      });
      if (best && bestD < window.innerHeight * 0.1) activate(best);
    };
    // Re-check on scroll (one frame at most) and when a reveal transition settles, only while the
    // features section is on screen; intersection events alone miss items that move into place.
    var fxSec = $('.fx'), fxVisible = false, fxTick = false;
    var queueFx = function () {
      if (!fxVisible || fxTick) return;
      fxTick = true;
      requestAnimationFrame(function () { fxTick = false; activateAtLine(); });
    };
    if (fxSec) new IntersectionObserver(function (en) { fxVisible = en[0].isIntersecting; queueFx(); }).observe(fxSec);
    window.addEventListener('scroll', queueFx, { passive: true });
    items.forEach(function (x) { x.addEventListener('transitionend', queueFx); });
    var vio = new IntersectionObserver(function (en) { en.forEach(function (e) { e.target.classList.toggle('in-view', e.isIntersecting); }); }, { threshold: 0.25 });
    $$('.viz').forEach(function (v) { vio.observe(v); });
  } else { $$('.viz').forEach(function (v) { v.classList.add('in-view'); }); }

  /* =========================================================== animated <details> (FAQ + technical details) */
  $$('details').forEach(function (d) {
    var sum = $('summary', d), body = sum.nextElementSibling;
    sum.addEventListener('click', function (e) {
      if (reduce || !body.animate) return;
      e.preventDefault();
      if (d._anim) d._anim.cancel();
      if (d.open) {
        var h = body.offsetHeight;
        d._anim = body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(.65,0,.35,1)' });
        d._anim.onfinish = function () { d.open = false; d._anim = null; };
      } else {
        d.open = true; var h2 = body.offsetHeight;
        d._anim = body.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
        d._anim.onfinish = function () { d._anim = null; };
      }
    });
  });

  /* =========================================================== go */
  measureTitle();
}
