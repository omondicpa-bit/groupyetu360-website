// Where sign-ups come from (9 Nov 2026).
// Every link into the app carries this page's name (src) and, when the
// visitor arrived from a post on social media or a search, where from (ch).
// The app keeps it and saves it on the account when they sign up, so the
// superadmin user list shows "came from: How to run a harambee · Facebook".
// It also sends a small note to GroupYetu360 when a page is opened and when
// someone taps through to the app (page, where from, phone or computer), for
// the live Traffic page in Platform Control. No cookies, no third parties:
// a random number kept in this browser tells a returning visitor from a new
// one. Nothing that identifies a person is collected.
(function () {
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  if (page === 'index') page = 'home';
  var ch = '';
  try {
    var q = new URLSearchParams(location.search);
    ch = q.get('utm_source') || (q.get('fbclid') ? 'facebook' : '') || (q.get('gclid') ? 'google' : '') || (q.get('ttclid') ? 'tiktok' : '');
    if (!ch && document.referrer) {
      var host = new URL(document.referrer).hostname.replace(/^www\.|^m\.|^l\.|^lm\./, '');
      if (host && host.indexOf('groupyetu.org') === -1) ch = host;
    }
    // Keep the first outside source for the whole visit across pages
    if (ch) sessionStorage.setItem('gy_ch', ch); else ch = sessionStorage.getItem('gy_ch') || '';
  } catch (e) {}
  ch = String(ch).toLowerCase().replace(/[^a-z0-9.\-_]/g, '').slice(0, 40);
  function tag() {
    var links = document.querySelectorAll('a[href^="https://app.groupyetu.org"]');
    for (var i = 0; i < links.length; i++) {
      try {
        var u = new URL(links[i].href);
        if (!u.searchParams.has('src')) u.searchParams.set('src', page);
        if (ch && !u.searchParams.has('ch')) u.searchParams.set('ch', ch);
        links[i].href = u.toString();
      } catch (e) {}
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tag); else tag();

  // ── Traffic note (10 Nov 2026) ──
  if (!/(^|\.)groupyetu\.org$/.test(location.hostname)) return;   // not from previews or a laptop
  var rnd = function () { return Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4); };
  var keep = function (st, k) { try { var v = st.getItem(k); if (!v) { v = rnd(); st.setItem(k, v); } return v; } catch (e) { return rnd(); } };
  var vid = keep(localStorage, 'gy_vid'), sid = keep(sessionStorage, 'gy_sid');
  var ua = navigator.userAgent || '';
  var device = /iPad/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'ipad'
    : /iPhone|iPod/i.test(ua) ? 'iphone' : /Android/i.test(ua) ? (/Mobile/i.test(ua) ? 'android' : 'tablet') : 'computer';
  function note(kind) {
    try {
      fetch('https://eengldzvvgplgzvbutal.supabase.co/rest/v1/rpc/gy360_track', {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: 'sb_publishable_YMCrMAvAeQEhVV3dC-8jjw_pVzFDyPH' },
        body: JSON.stringify({ p: { site: 'web', kind: kind, page: page, ch: ch, device: device, vid: vid, sid: sid } })
      }).catch(function () {});
    } catch (e) {}
  }
  note('view');
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (a && /^https:\/\/(app\.groupyetu\.org|play\.google\.com)/.test(a.href)) note('click');
  }, true);
})();
