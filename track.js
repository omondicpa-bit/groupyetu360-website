// Where sign-ups come from (9 Nov 2026).
// Every link into the app carries this page's name (src) and, when the
// visitor arrived from a post on social media or a search, where from (ch).
// The app keeps it and saves it on the account when they sign up, so the
// superadmin user list shows "came from: How to run a harambee · Facebook".
// No cookies, no third parties, nothing about the visitor is collected.
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
})();
