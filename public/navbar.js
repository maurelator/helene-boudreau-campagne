/**
 * navbar.js — Barre de navigation partagée entre toutes les pages du site.
 * Usage : ajouter <div id="nav-placeholder"></div> + <script src="/navbar.js"></script>
 */
(function () {

  /* ── 1. CSS ───────────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --forest:       #1a2d4a;
      --forest-mid:   #1e3a5f;
      --forest-light: #2a5080;
      --forest-pale:  #4a7aaa;
      --night:        #0f1e2b;
      --night-mid:    #172635;
      --white:        #ffffff;
      --transition:   0.3s cubic-bezier(0.4,0,0.2,1);
      --font-display: 'Spectral', Georgia, serif;
      --font-body:    'Mulish', system-ui, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; }
    a { text-decoration: none; color: inherit; }

    #navbar {
      position: fixed; top:0; left:0; right:0; z-index:500;
      transition: all 0.4s ease;
      padding: 1.2rem 0;
      background: rgba(15,30,43,0.72);
      backdrop-filter: blur(14px);
    }
    #navbar.scrolled {
      background: rgba(15,30,43,0.97);
      backdrop-filter: blur(20px);
      padding: 0.85rem 0;
      box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; padding: 0 3.5rem;
    }
    .nav-logo {
      display: flex; flex-direction: column;
      font-family: var(--font-display); color: var(--white);
    }
    .nav-logo-name { font-size: 1.05rem; font-weight: 400; letter-spacing: 0.02em; }
    .nav-logo-name em { font-style: italic; color: #7fa8d4; }
    .nav-logo-sub  { font-size: 0.57rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.38); margin-top: 2px; font-family: var(--font-body); }

    .nav-links { display:flex; flex:1; justify-content:center; gap:0; list-style:none; margin:0; padding:0; }
    .nav-links li { display:flex; }
    .nav-links a {
      font-size: 0.78rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
      color: rgba(255,255,255,0.75); transition: color 0.2s;
      position: relative; padding: 0 0.9rem 3px;
    }
    .nav-links a::after {
      content:''; position:absolute; bottom:-2px; left:0; right:0; height:2px;
      background: var(--forest-pale); transform:scaleX(0); transition:transform 0.3s;
    }
    .nav-links a:hover { color:#fff; }
    .nav-links a:hover::after { transform:scaleX(1); }
    .nav-links a.nav-vote {
      color: #a8c8e8; font-weight: 800;
    }

    /* Page tabs */
    .page-tab {
      cursor: pointer; background: none; border: none;
      font-family: var(--font-body); font-size: 0.82rem; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: rgba(255,255,255,0.55); padding: 0.25rem 0.9rem;
      border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s;
    }
    .page-tab:hover { color: rgba(255,255,255,0.85); }
    .page-tab.active-tab { color: #fff; border-bottom-color: var(--forest-pale); }

    .nav-sep { width: 1px; background: rgba(255,255,255,0.2); margin: 0.4rem 0.3rem; align-self: stretch; }

    .mobile-page-tabs {
      display: flex; gap: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding-bottom: 1rem; margin-bottom: 0.5rem;
    }
    .mobile-page-tabs .page-tab { font-size: 0.9rem; padding: 0.4rem 0; }

    .nav-right { display:flex; align-items:center; gap:0.65rem; }

    .lang-toggle {
      display:flex; gap:0; background:rgba(255,255,255,0.08);
      border:2px solid rgba(255,255,255,0.35); border-radius:8px; overflow:hidden;
      flex-shrink: 0;
    }
    .lang-btn {
      padding:0.65rem 1.3rem; font-size:0.85rem; font-weight:900;
      letter-spacing:0.18em; cursor:pointer; transition:all 0.2s;
      color:rgba(255,255,255,0.55); background:none; border:none;
      font-family: var(--font-body);
    }
    .lang-btn + .lang-btn { border-left:2px solid rgba(255,255,255,0.25); }
    .lang-btn:not(.active):hover { color:#fff; background:rgba(255,255,255,0.1); }
    .lang-btn.active { background: var(--forest-pale); color:#fff; }

    .nav-cta-don {
      background: #c9860a; color: #fff;
      padding: 0.55rem 1rem; border-radius: 5px;
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; transition: var(--transition); white-space: nowrap;
      font-family: var(--font-body);
    }
    .nav-cta-don:hover { background: #b07508; transform: translateY(-1px); }
    .nav-cta-pancarte {
      background: transparent; color: rgba(255,255,255,0.85);
      border: 1.5px solid rgba(168,200,232,0.4);
      padding: 0.55rem 1rem; border-radius: 5px;
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; transition: var(--transition); white-space: nowrap;
      font-family: var(--font-body);
    }
    .nav-cta-pancarte:hover { border-color: #a8c8e8; background: rgba(168,200,232,0.08); }
    .nav-cta {
      background: var(--forest-light); color:#fff;
      padding:0.5rem 0.9rem; border-radius:5px;
      font-size:0.68rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase;
      transition: var(--transition); white-space:nowrap;
      font-family: var(--font-body);
    }
    .nav-cta:hover { background: var(--forest-mid); }
    .nav-fb {
      width: 36px; height: 36px; border-radius: 5px; flex-shrink: 0;
      background: #1877f2; color: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: var(--transition);
    }
    .nav-fb:hover { background: #1464cc; transform: translateY(-1px); }

    .nav-burger {
      display:none; flex-direction:column; gap:5px; cursor:pointer;
      padding:4px; background:none; border:none;
    }
    .nav-burger span { width:22px; height:1.5px; background:#fff; display:block; }

    .nav-mobile-drawer {
      display:none; position:fixed; inset:0; z-index:499;
      background:rgba(15,30,43,0.98); backdrop-filter:blur(20px);
      flex-direction:column; justify-content:center; align-items:center; gap:2rem;
    }
    .nav-mobile-drawer.open { display:flex; }
    .nav-mobile-drawer a {
      font-size:1.2rem; font-weight:300; color:rgba(255,255,255,0.75);
      font-family:var(--font-display); transition:color 0.2s;
    }
    .nav-mobile-drawer a:hover { color:#a8c8e8; }
    .nav-mobile-drawer .mobile-vote { color:#a8c8e8; font-weight:400; }
    .nav-mobile-close {
      position:absolute; top:1.5rem; right:1.5rem;
      background:none; border:none; color:#fff; cursor:pointer;
    }

    @media (max-width: 1024px) {
      .nav-links       { display:none; }
      .nav-cta-don     { display:none; }
      .nav-cta-pancarte{ display:none; }
      .nav-cta         { display:none; }
      .nav-fb          { display:none; }
      .nav-burger      { display:flex; }
    }
    @media (max-width: 640px) {
      .nav-inner { padding: 0 1.5rem; }
    }
  `;
  document.head.appendChild(style);

  /* ── 2. Resolve hrefs (anchor links → absolute when not on index) ── */
  const onIndex = ['/', '/index.html', ''].some(p => location.pathname === p)
    || location.pathname.endsWith('/index.html');

  function sec(hash) {
    return onIndex ? hash : ('/' + hash);
  }

  /* ── 3. Inject HTML ────────────────────────────────────────────────── */
  const html = `
    <nav id="navbar">
      <div class="nav-inner">
        <a href="/" class="nav-logo">
          <span class="nav-logo-name">Hélène <em>Boudreau</em></span>
          <span class="nav-logo-sub" data-i18n="nav.home">Accueil</span>
        </a>
        <ul class="nav-links">
          <li><a href="/#about"           data-i18n="nav.about">À propos</a></li>
          <li><a href="/#programme"       data-i18n="nav.programme">Plateforme</a></li>
          <li><a href="/communaute.html"   data-i18n="nav.communaute">Communauté</a></li>
          <li><a href="/benevoles.html"    data-i18n="nav.volunteer">Bénévoles</a></li>
          <li><a href="/contact.html"      data-i18n="nav.contact">Contact</a></li>
          <li><a href="/vote.html" class="nav-vote" data-i18n="nav.vote">Voter</a></li>
        </ul>
        <div class="nav-right">
          <div class="lang-toggle">
            <button class="lang-btn active" onclick="setLang('fr')">FR</button>
            <button class="lang-btn"        onclick="setLang('en')">EN</button>
          </div>
          <a href="/don.html" class="nav-cta-don" data-i18n="nav.don">Faire un don</a>
          <a href="#" class="nav-cta-pancarte" data-i18n="hero.cta_pancarte">Pancarte</a>
          <a href="/benevoles.html" class="nav-cta" data-i18n="hero.cta_vol">Rejoindre</a>
          <a href="https://www.facebook.com/share/17TM7ip9wx/?mibextid=wwXIfr" target="_blank" rel="noopener" class="nav-fb" title="Facebook d'Hélène Boudreau">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <button class="nav-burger" onclick="toggleMobileNav()"><span></span><span></span><span></span></button>
        </div>
      </div>
    </nav>

    <div class="nav-mobile-drawer" id="mobileNav">
      <button class="nav-mobile-close" onclick="toggleMobileNav()">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <a href="/"              onclick="toggleMobileNav()" data-i18n="nav.home">Accueil</a>
      <a href="/#about"        onclick="toggleMobileNav()" data-i18n="nav.about">À propos</a>
      <a href="/#programme"    onclick="toggleMobileNav()" data-i18n="nav.programme">Plateforme</a>
      <a href="/communaute.html" onclick="toggleMobileNav()" data-i18n="nav.communaute">Communauté</a>
      <a href="/benevoles.html"  onclick="toggleMobileNav()" data-i18n="nav.volunteer">Bénévoles</a>
      <a href="/contact.html"    onclick="toggleMobileNav()" data-i18n="nav.contact">Contact</a>
      <a href="/vote.html"       onclick="toggleMobileNav()" class="mobile-vote" data-i18n="nav.vote">Voter</a>
      <a href="/don.html"        onclick="toggleMobileNav()" data-i18n="nav.don">Faire un don</a>
    </div>
  `;

  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  }

  /* ── 4. Scroll behaviour ───────────────────────────────────────────── */
  window.addEventListener('scroll', function () {
    const nb = document.getElementById('navbar');
    if (nb) nb.classList.toggle('scrolled', window.scrollY > 50);
  });
  // Trigger once in case page is loaded mid-scroll
  (function () {
    const nb = document.getElementById('navbar');
    if (nb && window.scrollY > 50) nb.classList.add('scrolled');
  })();

  /* ── 5. Mobile nav toggle ──────────────────────────────────────────── */
  window.toggleMobileNav = function () {
    const d = document.getElementById('mobileNav');
    if (d) d.classList.toggle('open');
  };

  /* ── 6. i18n engine (used on secondary pages; index.html overrides) ── */
  var _T = {};
  window._T = _T;           // expose pour les scripts des pages secondaires
  window.currentLang = 'fr';

  function _apply(lang) {
    window.currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var keys = el.dataset.i18n.split('.');
      var val = _T[lang];
      for (var i = 0; i < keys.length; i++) { if (val) val = val[keys[i]]; }
      if (typeof val === 'string') el.textContent = val;
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.textContent.trim() === lang.toUpperCase());
    });
  }

  async function _load(lang) {
    if (!_T[lang]) {
      try {
        var r = await fetch('/locales/' + lang + '.json');
        if (r.ok) _T[lang] = await r.json();
      } catch (e) {}
    }
    if (_T[lang]) _apply(lang);
  }

  // Only define setLang if index.html hasn't defined it yet
  if (!window.setLang) {
    window.setLang = function (lang) { _load(lang); };
    // Auto-load FR on page ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { _load('fr'); });
    } else {
      _load('fr');
    }
  }

})();
