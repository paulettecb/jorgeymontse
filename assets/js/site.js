/* ============================================================
   Jorge & Montse — sitio de boda
   Port a JS plano de la lógica del componente DC
   `templates/wedding-site/WeddingSite.dc.html` (clase `DCLogic`).

   El .dc.html corre sobre el runtime de Claude Design (React +
   support.js + ds-base.js). Aquí no hay runtime: los `ref="{{ x }}"`
   son ids, los `onClick="{{ f }}"` son addEventListener y los
   `props` del panel de edición viven en CONFIG.
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* --------------------------------------------------------
     CONFIG — equivalente a los `data-props` del .dc.html.
     Editar aquí es lo mismo que mover los controles del panel.
     -------------------------------------------------------- */
  var CONFIG = {
    sealColor: 'verde',               // 'dorado' | 'vino' | 'verde'
    backdrop: 'vino',                 // 'vino' | 'tinta' | 'verde'
    photoTone: 'blanco y negro',      // 'blanco y negro' | 'sepia' | 'color'
    floatingDetails: false,           // los novios pidieron quitar los destellos
    openOnLoad: false,
    musicSrc: '',                     // vacío = usa el src del <audio>
    bodaCivil: false,                 // true = el itinerario muestra la ceremonia
                                      // civil a las 19:30 en lugar de las fotos.
                                      // Los novios siguen decidiendo.
    weddingDate: new Date(2027, 0, 30, 16, 0, 0)
  };

  var BACKDROPS = { vino: '#551724', tinta: '#2A1016', verde: '#2F3A28' };
  var SEALS = {
    dorado: 'radial-gradient(circle at 34% 30%,#D6B47E 0%,#B8935A 46%,#8E6D3C 100%)',
    vino:   'radial-gradient(circle at 34% 30%,#8A3243 0%,#631B29 46%,#3A0F16 100%)',
    verde:  'radial-gradient(circle at 34% 30%,#77855F 0%,#55624A 46%,#333C2C 100%)'
  };
  var SEAL_INK = { dorado: '#4A1420', vino: '#EEEBE6', verde: '#EEEBE6' };
  var PHOTO_FILTERS = {
    'blanco y negro': 'grayscale(1) contrast(1.04)',
    'sepia': 'sepia(.55) contrast(1.03) saturate(.85)',
    'color': 'none'
  };

  /* Los 34 destellos dorados del .dc.html.
     [left%, fall s, fallDelay s, sway s, sway px, size px, opacity, glow px, twinkle s, twinkleDelay s] */
  var DRIFT = [[32.56,34.4,-14.4,4.3,10.5,3.4,0.95,5.3,4.9,-0],[80.9,21.2,-3.5,6.2,15.7,7.8,0.51,0,4.6,-0.4],[72.62,17.3,-7.4,4.2,10.5,7.5,0.73,0,5.2,-0.8],[89.47,23,-16.9,8.4,12.9,5.6,0.83,10.6,3.8,-1.2],[51.84,33.6,-9.9,6,11.8,7.1,0.93,0,4.9,-1.6],[54.49,13.3,-17.2,7.9,6.7,5.9,0.55,0,3.3,-2],[38.11,21.1,-5,4.3,10.3,6,0.72,11.5,4.5,-2.4],[20.58,34.7,-16.1,5.8,11.5,7.4,0.8,0,4.1,-2.8],[23.25,18.3,-9.2,8.8,12.3,5.1,0.91,0,4.7,-3.2],[2.62,26.3,-16.5,6.8,13.4,7.7,0.95,15.6,4.7,-3.6],[73.71,23.2,-23.7,6,13.3,4.3,0.94,0,3.2,-4],[34.33,18.2,-7.1,6.1,9.9,5.9,0.94,0,5.2,-4.4],[42.42,19,-28.4,8.4,11.9,5.5,0.58,10.3,5.5,-4.8],[74.9,32.2,-11.2,5.7,10.1,5,0.85,0,3.7,-5.2],[93.55,13.9,-31.9,8.4,14.3,3.7,0.54,0,3.4,-5.6],[45.23,19,-14.8,7.4,12.9,8.1,0.84,16.6,2.7,-6],[50.53,20.2,-27.2,5.7,10.3,4.8,0.87,0,4.2,-6.4],[74.39,16.3,-28.3,6.4,14.3,8.1,0.8,0,2.3,-6.8],[74,19,-0.5,6,14.3,5.8,0.91,11,3.8,-7.2],[75.63,28.2,-13.7,4.1,12.2,6.1,0.8,0,3,-7.6],[28.72,29.8,-19.4,8.1,7,7.9,0.59,0,3.9,-8],[32.64,16.3,-1.4,6.8,15.1,7.6,0.88,15.4,5.5,-8.4],[6.99,25.3,-11.9,6.9,6,6.4,0.71,0,3.3,-8.8],[94.12,27.1,-3.9,7.2,11.1,6.7,0.61,0,2.6,-9.2],[42.17,28.7,-29.4,7.5,13.5,4.4,0.95,7.7,4.4,-9.6],[60.41,22.5,-29,4.9,6.8,8.1,0.78,0,4,-10],[13.68,21,-11.9,5.5,10.1,8.7,0.81,0,4.1,-10.4],[42.54,31.6,-20.5,4.9,13.8,5.3,0.78,9.8,4.3,-10.8],[46.75,21.1,-15.2,7.8,7.3,6.2,0.89,0,5.5,-11.2],[79.01,26,-34.2,6.6,9.3,3.4,0.76,0,2.9,-11.6],[30.91,28.3,-34.7,4.9,9.1,4.8,0.95,8.6,3.3,-12],[29.49,17.9,-14.7,4.2,11.9,7,0.57,0,5,-12.4],[73.26,21.4,-2.8,6.4,14.2,3.7,0.82,0,3.2,-12.8],[35.5,25.2,-5.7,7.9,9.9,6.3,0.95,12.2,3.2,-13.2]];

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var el = {
    root: $('jm-root'), drift: $('jm-drift'), stage: $('jm-stage'),
    opening: $('jm-opening'), env: $('jm-env'), envInner: $('jm-env-inner'),
    flap: $('jm-flap'), seal: $('jm-seal'), glow: $('jm-glow'),
    hero: $('jm-hero'), heroFoto: $('jm-hero-foto'),
    hint: $('jm-hint'), scrollHint: $('jm-scrollhint'),
    stageOrn: $('jm-stage-orn'), nav: $('jm-nav'), navLinks: $('jm-navlinks'),
    pill: $('jm-pill'), dd: $('jm-dd'), hh: $('jm-hh'), mm: $('jm-mm'), ss: $('jm-ss'),
    cuentaLive: $('jm-cuenta-live'), cuentaDone: $('jm-cuenta-done'),
    music: $('jm-music'), bars: $('jm-bars'), musicLabel: $('jm-music-label'),
    audio: $('jm-audio'), grid: $('jm-grid'),
    lb: $('jm-lightbox'), lbImg: $('jm-lb-img'), lbCount: $('jm-lb-count')
  };

  var state = {
    opened: false, live: false, p: 0, raf: null, L: null,
    navDark: null, pending: [], lastReveal: 0, plx: [],
    lbOpen: false, lbIndex: 0, lbReturnFocus: null,
    lunaOpen: false, lunaReturnFocus: null,
    locks: {}, timer: null, jumpT: [],
    galMode: null, galModeFijo: false, carRaf: 0, carIndex: 0, obsCentro: null
  };

  /* ---------- bloqueo de scroll con varios dueños ---------- */
  function lock(name, on) {
    if (on) { state.locks[name] = true; } else { delete state.locks[name]; }
    var any = Object.keys(state.locks).length > 0;
    document.documentElement.classList.toggle('jm-locked', any);
  }

  /* ---------- destellos ---------- */
  function renderDrift() {
    if (!el.drift || reduceMotion) return;
    var html = '';
    for (var i = 0; i < DRIFT.length; i++) {
      var d = DRIFT[i];
      var glow = d[7] ? ';box-shadow:0 0 ' + d[7] + 'px rgba(212,175,106,.9)' : '';
      html += '<span style="position:absolute;left:' + d[0] + '%;top:-6%;animation:jmFall ' + d[1] +
        's linear infinite;animation-delay:' + d[2] + 's"><span style="display:block;animation:jmSway ' +
        d[3] + 's ease-in-out infinite alternate;--sway:' + d[4] +
        'px"><span style="display:block;width:' + d[5] + 'px;height:' + d[5] +
        'px;border-radius:50%;background:#C39A55;opacity:' + d[6] + glow +
        ';animation:jmTwinkle ' + d[8] + 's ease-in-out infinite alternate;animation-delay:' +
        d[9] + 's"></span></span></span>';
    }
    el.drift.innerHTML = html;
  }

  /* ---------- medidas de la escena del sobre ---------- */
  function measure() {
    var W = window.innerWidth, H = window.innerHeight;
    var portrait = W / H < 1.25;
    var u = portrait ? Math.min(H / 118, W / 62) : Math.min(H / 100, W / 172);
    var cardW = 40 * u, cardH = cardW * 1.4;
    var envW = 52 * u, envH = envW / 1.45;
    var L = { W: W, H: H, u: u, portrait: portrait, cardW: cardW, cardH: cardH, envW: envW, envH: envH };
    if (portrait) { L.cardX = 6.5 * u; L.cardY = 15 * u; L.envX = -6 * u; L.envY = -19 * u; }
    else { L.cardX = 30 * u; L.cardY = 0; L.envX = -30 * u; L.envY = 0; }
    L.fsRest = cardW / 21;
    L.fsFull = Math.max(L.fsRest * 1.85, Math.min(W, H * 1.7) / 38);
    L.openH = H * 2.6;
    return L;
  }

  function applyStatic() {
    var L = state.L;
    if (!el.env || !el.hero || !el.seal) return;
    el.env.style.width = L.envW + 'px';
    el.env.style.height = L.envH + 'px';
    var sd = Math.round(L.envW * 0.25);
    el.seal.style.width = sd + 'px';
    el.seal.style.height = sd + 'px';
    el.seal.style.margin = (-sd / 2) + 'px 0 0 ' + (-sd / 2) + 'px';
    el.hero.style.width = L.cardW + 'px';
    el.hero.style.height = L.cardH + 'px';
    el.hero.style.fontSize = L.fsRest + 'px';

    var bg = BACKDROPS[CONFIG.backdrop] || BACKDROPS.vino;
    if (el.stage) el.stage.style.background = bg;
    if (el.root) el.root.style.background = bg;
    document.body.style.background = bg;

    el.seal.style.background = SEALS[CONFIG.sealColor] || SEALS.dorado;
    var ink = el.seal.firstElementChild;
    if (ink) ink.style.background = SEAL_INK[CONFIG.sealColor] || '#4A1420';

    var pf = PHOTO_FILTERS[CONFIG.photoTone] || PHOTO_FILTERS['blanco y negro'];
    Array.prototype.forEach.call(document.querySelectorAll('[data-photo]'), function (n) {
      n.style.filter = pf;
    });

    var hideOrn = CONFIG.floatingDetails === false;
    if (el.drift) el.drift.style.display = hideOrn ? 'none' : '';
    if (el.stageOrn) el.stageOrn.style.display = hideOrn ? 'none' : '';
  }

  /* ---------- itinerario: versión con o sin boda civil ----------
     El HTML trae las dos filas de las 19:30 (fotos y ceremonia civil);
     aquí se enciende la que toque. Son estilos inline con display, así
     que no basta el atributo hidden.

     A la civil no va todo el mundo, así que la decisión es por
     invitación: si el link personalizado trae `civil: true`, esa
     persona ve la ceremonia civil. Quien llegue sin link —o sin ese
     campo— ve lo que diga CONFIG.bodaCivil, que es el valor general. */
  function applyItinerario(civilParaEsteInvitado) {
    var fotos = $('jm-itin-fotos'), civil = $('jm-itin-civil');
    if (!fotos || !civil) return;
    var mostrar = typeof civilParaEsteInvitado === 'boolean'
      ? civilParaEsteInvitado
      : CONFIG.bodaCivil;
    fotos.style.display = mostrar ? 'none' : 'grid';
    civil.style.display = mostrar ? 'grid' : 'none';
  }

  /* ---------- tinta de la nav sobre bandas oscuras ---------- */
  var darkBands = [];
  function setNavInk(dark) {
    if (state.navDark === dark || !el.nav) return;
    state.navDark = dark;
    var ink = dark ? '#F6F4EE' : '#631B29';
    el.nav.classList.toggle('is-dark', dark);   /* el backdrop se invierte con la tinta */
    var mark = el.nav.querySelector('a[href="#top"]');
    if (mark) mark.style.background = ink;
    if (el.navLinks) el.navLinks.style.color = ink;
    if (el.pill) {
      el.pill.style.borderColor = dark ? 'rgba(246,244,238,.42)' : 'rgba(99,27,41,.35)';
      el.pill.classList.toggle('is-dark', dark);
    }
  }
  function watchDarkBands() {
    darkBands = Array.prototype.slice.call(document.querySelectorAll('[data-dark]'));
    syncNavInk();
  }
  function syncNavInk() {
    var dark = false;
    for (var i = 0; i < darkBands.length; i++) {
      var r = darkBands[i].getBoundingClientRect();
      if (r.top < 74 && r.bottom > 8) { dark = true; break; }
    }
    setNavInk(dark);
  }

  /* ---------- reveal on scroll ---------- */
  function setupReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    els.forEach(function (node) {
      if (node.dataset.revealInit === '1') return;
      node.dataset.revealInit = '1';
      if (reduceMotion) { node.dataset.revealDone = '1'; return; }
      node.style.opacity = '0';
      node.style.transform = 'translateY(26px)';
      node.style.transition = 'opacity .95s cubic-bezier(.22,1,.36,1),transform .95s cubic-bezier(.22,1,.36,1)';
    });
    state.pending = els.filter(function (n) { return n.dataset.revealDone !== '1'; });
    syncReveal(false);
    [700, 2000, 5000].forEach(function (t) { setTimeout(function () { syncReveal(false); }, t); });
  }

  function syncReveal(force) {
    if (!state.pending.length) return;
    var now = Date.now();
    if (!force && state.lastReveal && now - state.lastReveal < 180) return;
    state.lastReveal = now;
    var H = window.innerHeight, trigger = force ? 1e9 : H * 0.88;
    var still = [];
    for (var i = 0; i < state.pending.length; i++) {
      var node = state.pending[i];
      var r = node.getBoundingClientRect();
      if (r.top < trigger && r.bottom > -40) {
        var sibs = Array.prototype.slice.call(node.parentElement.children)
          .filter(function (c) { return c.hasAttribute('data-reveal'); });
        var idx = Math.max(0, sibs.indexOf(node));
        node.style.transitionDelay = Math.min(idx * 0.09, 0.45) + 's';
        node.style.opacity = '1';
        node.style.transform = 'none';
        node.dataset.revealDone = '1';
      } else if (r.top >= trigger) {
        still.push(node);
      } else {
        node.style.opacity = '1';
        node.style.transform = 'none';
        node.dataset.revealDone = '1';
      }
    }
    state.pending = still;
  }

  /* ---------- cuenta regresiva ---------- */
  function tick() {
    var target = CONFIG.weddingDate.getTime();
    if (Date.now() >= target) {
      if (el.cuentaLive) el.cuentaLive.style.display = 'none';
      if (el.cuentaDone) el.cuentaDone.style.display = 'flex';
      if (state.timer) { clearInterval(state.timer); state.timer = null; }
      return;
    }
    var d = Math.max(0, target - Date.now());
    var day = Math.floor(d / 86400000); d -= day * 86400000;
    var hr = Math.floor(d / 3600000); d -= hr * 3600000;
    var mi = Math.floor(d / 60000); d -= mi * 60000;
    var se = Math.floor(d / 1000);
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var put = function (node, v) { if (node && node.textContent !== v) node.textContent = v; };
    put(el.dd, String(day)); put(el.hh, pad(hr)); put(el.mm, pad(mi)); put(el.ss, pad(se));
  }

  /* ---------- link personalizado (?i=…) ----------
     Los novios reparten un link por invitación. Con él, el RSVP ya sabe
     quién confirma y no se lo pregunta; sin él —o si el id no existe—
     el formulario se queda como estaba y pide el nombre a mano. Ese
     respaldo es a propósito: un link mal copiado no debe dejar a nadie
     sin poder confirmar.

     La lista de invitados no vive en el navegador. Se le pregunta a
     /api/invitacion por un id y sólo contesta esa invitación. */
  function personalizar() {
    var caja = $('jm-quien'), campo = $('jm-campo-nombre'),
        seccion = $('rsvp'), pill = $('jm-pill');
    if (!caja || !campo || !seccion || !window.fetch) return;

    /* Confirmar es sólo con link personalizado. Los pases los controlan los
       novios, y en el link genérico cualquiera podría escribir el nombre y
       los lugares que quisiera. Así que la sección entera se apaga —junto
       con el botón «confirmar» de la nav, que si no apuntaría a la nada— y
       se enciende únicamente si el id existe.

       El formulario se queda en el HTML aunque no se vea: Netlify Forms lo
       detecta leyendo el archivo, no la página pintada. */
    var apagar = function () {
      seccion.hidden = true;
      if (pill) pill.hidden = true;
    };

    /* El id puede llegar de dos formas: como ?i=paloma-cambron, o como
       /paloma-cambron. La segunda es una reescritura de Netlify (status
       200), así que la barra de direcciones conserva el link bonito y no
       hay query string que leer: el id viene en la ruta. */
    var id = '';
    try {
      id = (new URLSearchParams(window.location.search).get('i') || '').trim().toLowerCase();
      if (!id) {
        var ruta = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
        if (ruta.indexOf('/') === -1 && ruta.indexOf('.') === -1) id = ruta;
      }
    } catch (e) { apagar(); return; }
    if (!id || !/^[a-z0-9-]{1,60}$/.test(id)) { apagar(); return; }

    /* Mientras se resuelve el id, el formulario se queda apagado pero sin
       el aviso: todavía no se sabe si el link es bueno. Como esto corre al
       cargar y el RSVP está hasta abajo, se resuelve mucho antes de que
       nadie llegue. El campo del nombre se oculta desde ya para que, en el
       caso normal, nadie lo vea aparecer y desaparecer. */
    campo.hidden = true;
    seccion.hidden = true;
    if (pill) pill.hidden = true;

    fetch('/api/invitacion?i=' + encodeURIComponent(id), { headers: { accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (inv) {
        if (!inv || !inv.saludo) throw new Error('sin invitación');
        aplicar(inv);
      })
      .catch(apagar);            // link malo: mismo trato que sin link

    function aplicar(inv) {
      $('jm-quien-nombre').textContent = inv.saludo;

      var pases = parseInt(inv.pases, 10) || 1;
      $('jm-quien-pases').textContent = pases === 1
        ? 'Tu invitación es para una persona.'
        : 'Tu invitación es para ' + pases + ' personas.';

      /* El input de texto se desactiva —no sólo se esconde— para que el
         formulario no mande dos campos «nombre». Y el oculto estrena su
         `name` justo ahora, por lo mismo. */
      var texto = $('jm-input-nombre');
      if (texto) { texto.disabled = true; texto.required = false; }
      var input = $('jm-quien-nombre-input'), idInput = $('jm-quien-id-input');
      if (input) { input.name = 'nombre'; input.value = inv.invitados.join(', '); }
      if (idInput) { idInput.name = 'invitacion'; idInput.value = inv.id; }

      caja.hidden = false;
      seccion.hidden = false;
      if (pill) pill.hidden = false;

      /* A la ceremonia civil sólo va parte de los invitados, así que el
         itinerario se arma según lo que traiga esta invitación. */
      if (typeof inv.civil === 'boolean') applyItinerario(inv.civil);

      /* Los pases ya se saben: el contador arranca completo y no deja
         pasarse. Los acompañantes con nombre se prellenan. */
      var cuantos = document.querySelector('#jm-rsvp-form input[name="personas"]');
      if (cuantos) { cuantos.value = String(pases); cuantos.max = String(pases); }
      var acomp = document.querySelector('#jm-rsvp-form input[name="acompanantes"]');
      if (acomp && inv.invitados.length > 1) {
        acomp.value = inv.invitados.slice(1).filter(function (n) {
          return !/^invitad[oa]s?$/i.test(n);
        }).join(', ');
      }
    }
  }

  /* ---------- la invitación crece con el scroll ---------- */
  function place(p) {
    var L = state.L;
    if (!el.env || !el.hero) return;
    var e = p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p);
    var w = L.cardW + (L.W - L.cardW) * e, h = L.cardH + (L.H - L.cardH) * e;
    var cx = L.cardX * (1 - e), cy = L.cardY * (1 - e);
    el.hero.style.width = w + 'px';
    el.hero.style.height = h + 'px';
    el.hero.style.fontSize = (L.fsRest + (L.fsFull - L.fsRest) * e) + 'px';
    el.hero.style.transform = 'translate(-50%,-50%) translate(' + cx + 'px,' + cy + 'px)';
    el.hero.style.borderRadius = (4 * (1 - e)) + 'px';
    el.hero.style.boxShadow = e > 0.985 ? 'none'
      : '0 ' + (34 * (1 - e)) + 'px ' + (72 * (1 - e)) + 'px rgba(0,0,0,' + (0.5 * (1 - e)) + ')';
    el.hero.style.opacity = '1';

    /* La foto entra sólo al final, cuando la tarjeta ya es la pantalla: de
       0 en p=0.78 a 1 en p=1. Antes de eso la invitación se ve como siempre,
       en blanco, que es como sale del sobre. */
    if (el.heroFoto) {
      el.heroFoto.style.opacity = String(Math.min(1, Math.max(0, (p - 0.78) / 0.22)));
    }

    var ep = Math.min(1, p / 0.42);
    el.env.style.transform = 'translate(-50%,-50%) translate(' + (L.envX - 46 * ep * L.u) + 'px,' +
      (L.envY + 14 * ep * L.u) + 'px) rotate(' + (-4 * ep) + 'deg) scale(' + (1 - 0.08 * ep) + ')';
    el.env.style.opacity = String(1 - ep);

    if (el.stageOrn) el.stageOrn.style.opacity = String(1 - Math.min(1, p / 0.55));
    if (el.nav) {
      var n = Math.min(1, Math.max(0, (p - 0.7) / 0.3));
      el.nav.style.opacity = String(n);
      el.nav.style.pointerEvents = n > 0.85 ? 'auto' : 'none';
    }
    if (el.scrollHint) el.scrollHint.style.opacity = String(Math.max(0, 1 - p / 0.14));
  }

  function syncParallax() {
    if (reduceMotion) return;
    var H = window.innerHeight;
    for (var i = 0; i < state.plx.length; i++) {
      var node = state.plx[i];
      var p = node.parentElement.getBoundingClientRect();
      if (p.bottom < -80 || p.top > H + 80) continue;
      var t = (p.top + p.height / 2 - H / 2) / H;
      node.style.transform = 'translate3d(0,' + (-t * 7).toFixed(2) + '%,0)';
    }
  }

  /* ---------- galería: color al centrarse, en pantallas sin mouse ----------
     En compu la foto pasa de blanco y negro a color al pasar el mouse
     (ver `enter` más abajo). En celular no hay hover, así que se colorea
     cuando la foto cruza el centro de la pantalla al hacer scroll.

     Se monta sólo donde NO hay hover: si se montara en las dos, el mouse
     y el scroll se pelearían por el mismo filtro. Y con
     prefers-reduced-motion no se monta: el color entraría y saldría solo
     mientras la persona se desplaza. */
  function setupGaleriaSinMouse() {
    if (state.obsCentro) { state.obsCentro.disconnect(); state.obsCentro = null; }
    if (!window.matchMedia || !window.IntersectionObserver || reduceMotion) return;
    if (window.matchMedia('(hover: hover)').matches) return;

    var gris = PHOTO_FILTERS[CONFIG.photoTone] || PHOTO_FILTERS['blanco y negro'];
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.target.dataset.unavailable === '1') return;
        var inner = e.target.querySelector('[data-photo]');
        if (inner) inner.style.filter = e.isIntersecting ? 'none' : gris;
      });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });   /* la banda central */

    cells.forEach(function (c) { obs.observe(c); });
    state.obsCentro = obs;
  }

  /* ---------- galería + lightbox ---------- */
  var cells = [];
  function setupGallery() {
    cells = Array.prototype.slice.call(document.querySelectorAll('[data-gcell]'));
    cells.forEach(function (cell) {
      var inner = cell.querySelector('[data-photo]');
      var img = cell.querySelector('img');
      var veil = cell.querySelector('[data-veil]');
      var frame = cell.querySelector('[data-gframe]');
      /* El hover escribe variables y no `transform` directo: en el carrusel
         la animación del scroll empuja la misma celda, y si las dos
         escribieran `transform` la última en correr borraría a la otra. */
      var enter = function () {
        if (cell.dataset.unavailable === '1') return;
        if (state.galMode === 'carrusel') return;   /* ahí manda el scroll */
        if (inner) inner.style.filter = 'none';
        if (img) img.style.setProperty('--jm-zoom', '1.07');
        if (veil) veil.style.setProperty('--jm-velo', '0');
        if (frame) frame.style.setProperty('--jm-marco', '1');
        cell.style.setProperty('--jm-lift', '-6px');
        cell.style.boxShadow = '0 26px 50px rgba(58,15,22,.28)';
      };
      var leave = function () {
        if (state.galMode === 'carrusel') return;
        if (inner) inner.style.filter = PHOTO_FILTERS[CONFIG.photoTone] || PHOTO_FILTERS['blanco y negro'];
        if (img) img.style.setProperty('--jm-zoom', '1');
        if (veil) veil.style.setProperty('--jm-velo', '1');
        if (frame) frame.style.setProperty('--jm-marco', '0');
        cell.style.setProperty('--jm-lift', '0px');
        cell.style.boxShadow = 'none';
      };
      cell.addEventListener('mouseenter', enter);
      cell.addEventListener('focus', enter);
      cell.addEventListener('mouseleave', leave);
      cell.addEventListener('blur', leave);
      cell.addEventListener('click', function (ev) {
        ev.preventDefault();
        if (cell.dataset.unavailable === '1') return;
        openLB(parseInt(cell.getAttribute('data-gcell'), 10) || 0);
      });
    });
  }

  /* ==================== galería: mosaico y carrusel ====================
     Las mismas celdas en los dos modos; sólo cambia la clase del
     contenedor. Por eso el lightbox y el conteo no se enteran de nada.

     El modo de arranque lo decide el aparato: en celular el carrusel
     —una foto a la vez, del tamaño de la pantalla— y en compu el mosaico,
     que es donde se aprovecha el ancho. Se puede cambiar en cualquiera
     de los dos. */
  function anchoChico() { return window.innerWidth < 900; }

  function setupModos() {
    if (!el.grid) return;
    var mos = $('jm-modo-mosaico'), car = $('jm-modo-carrusel');
    if (mos) mos.addEventListener('click', function () { setGalMode('mosaico', true); });
    if (car) car.addEventListener('click', function () { setGalMode('carrusel', true); });

    var prev = $('jm-car-prev'), next = $('jm-car-next');
    if (prev) prev.addEventListener('click', function () { pasoCarrusel(-1); });
    if (next) next.addEventListener('click', function () { pasoCarrusel(1); });

    el.grid.addEventListener('scroll', function () {
      if (state.galMode !== 'carrusel') return;
      if (state.carRaf) return;
      state.carRaf = requestAnimationFrame(function () {
        state.carRaf = 0;
        pintaCarrusel();
      });
    }, { passive: true });

    setGalMode(anchoChico() ? 'carrusel' : 'mosaico', false);
  }

  function setGalMode(modo, deLaPersona) {
    if (!el.grid || state.galMode === modo) return;
    state.galMode = modo;
    /* Si la persona eligió, se respeta aunque después gire el teléfono;
       si no, el resize puede volver a decidir. */
    if (deLaPersona) state.galModeFijo = true;

    el.grid.classList.toggle('is-mosaico', modo === 'mosaico');
    el.grid.classList.toggle('is-carrusel', modo === 'carrusel');

    var mos = $('jm-modo-mosaico'), car = $('jm-modo-carrusel');
    if (mos) mos.setAttribute('aria-pressed', String(modo === 'mosaico'));
    if (car) car.setAttribute('aria-pressed', String(modo === 'carrusel'));

    var pie = $('jm-gal-pie');
    if (pie) pie.hidden = modo !== 'carrusel';

    /* Cada modo colorea las fotos a su manera y hay que apagar la del
       otro: si las dos observaran las mismas celdas se pelearían por el
       mismo filtro. */
    if (modo === 'carrusel') {
      if (state.obsCentro) { state.obsCentro.disconnect(); state.obsCentro = null; }
      el.grid.scrollLeft = 0;
      pintaCarrusel();
      /* El layout del carrusel aún no está firme en el mismo frame en que
         se pone la clase; sin este segundo pase la primera foto arranca
         apagada. */
      requestAnimationFrame(pintaCarrusel);
    } else {
      limpiaCarrusel();
      setupGaleriaSinMouse();
    }
  }

  /* Deja las celdas como si nadie las hubiera tocado, para que el mosaico
     no herede el estado a medias del carrusel. */
  function limpiaCarrusel() {
    var gris = PHOTO_FILTERS[CONFIG.photoTone] || PHOTO_FILTERS['blanco y negro'];
    cells.forEach(function (cell) {
      var inner = cell.querySelector('[data-photo]');
      var img = cell.querySelector('img');
      var veil = cell.querySelector('[data-veil]');
      var frame = cell.querySelector('[data-gframe]');
      cell.style.setProperty('--jm-esc', '1');
      cell.style.setProperty('--jm-lift', '0px');
      cell.style.boxShadow = 'none';
      if (img) { img.style.setProperty('--jm-px', '0px'); img.style.setProperty('--jm-zoom', '1'); }
      if (veil) veil.style.setProperty('--jm-velo', '1');
      if (frame) frame.style.setProperty('--jm-marco', '0');
      if (inner) inner.style.filter = gris;
    });
  }

  /* La animación de cada diapositiva.

     No se usa IntersectionObserver: eso sólo avisa cuándo entra y cuándo
     sale, y aquí hace falta saber *qué tan* al centro va cada foto para
     que crezca y se coloree mientras se arrastra. Tampoco
     `animation-timeline: view()`, que sería lo elegante, porque Safari
     todavía no lo trae y el carrusel es justamente lo del celular.

     Así que: distancia de cada diapositiva al centro del riel, normalizada
     a [-1, 1], y de ahí salen la escala, el velo, el marco y el
     desplazamiento de la foto dentro de su marco —que es lo que da la
     sensación de profundidad al arrastrar. */
  function pintaCarrusel() {
    if (!el.grid || state.galMode !== 'carrusel' || !cells.length) return;
    var caja = el.grid.getBoundingClientRect();
    var centro = caja.left + caja.width / 2;
    var gris = PHOTO_FILTERS[CONFIG.photoTone] || PHOTO_FILTERS['blanco y negro'];
    var masCerca = 0, mejor = Infinity;

    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var r = cell.getBoundingClientRect();
      var d = (r.left + r.width / 2) - centro;
      var t = Math.max(-1, Math.min(1, d / (caja.width / 2 || 1)));
      var a = Math.abs(t);
      if (a < mejor) { mejor = a; masCerca = i; }

      var img = cell.querySelector('img');
      var veil = cell.querySelector('[data-veil]');
      var frame = cell.querySelector('[data-gframe]');
      var inner = cell.querySelector('[data-photo]');

      if (reduceMotion) {
        cell.style.setProperty('--jm-esc', '1');
        if (img) img.style.setProperty('--jm-px', '0px');
      } else {
        cell.style.setProperty('--jm-esc', (1 - a * 0.12).toFixed(4));
        if (img) img.style.setProperty('--jm-px', (-t * 26).toFixed(1) + 'px');
        if (img) img.style.setProperty('--jm-zoom', '1.1');
      }
      if (veil) veil.style.setProperty('--jm-velo', Math.min(1, a * 1.6).toFixed(3));
      if (frame) frame.style.setProperty('--jm-marco', Math.max(0, 1 - a * 3).toFixed(3));
      if (inner) inner.style.filter = a < 0.34 ? 'none' : gris;
    }

    var cuenta = $('jm-car-cuenta');
    if (cuenta) cuenta.textContent = (masCerca + 1) + ' / ' + cells.length;
    var avance = $('jm-car-avance');
    if (avance) avance.style.width = ((masCerca + 1) / cells.length * 100).toFixed(2) + '%';
    var prev = $('jm-car-prev'), next = $('jm-car-next');
    if (prev) prev.disabled = masCerca === 0;
    if (next) next.disabled = masCerca === cells.length - 1;
    state.carIndex = masCerca;
  }

  function pasoCarrusel(dir) {
    if (!el.grid || !cells.length) return;
    var i = Math.max(0, Math.min(cells.length - 1, (state.carIndex || 0) + dir));
    var cell = cells[i];
    if (!cell) return;
    var caja = el.grid.getBoundingClientRect();
    var r = cell.getBoundingClientRect();
    var salto = (r.left + r.width / 2) - (caja.left + caja.width / 2);
    el.grid.scrollBy({ left: salto, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function fitGrid() {
    /* El resize sólo re-decide mientras nadie haya elegido a mano. */
    if (!el.grid || state.galModeFijo) { pintaCarrusel(); return; }
    setGalMode(anchoChico() ? 'carrusel' : 'mosaico', false);
    pintaCarrusel();
  }

  function cellSrc(i) {
    var img = cells[i] && cells[i].querySelector('img');
    return img ? img.getAttribute('src') : null;
  }
  function usable(i) {
    return cells[i] && cells[i].dataset.unavailable !== '1';
  }
  function usableCount() {
    var n = 0;
    for (var i = 0; i < cells.length; i++) if (usable(i)) n++;
    return n;
  }

  function openLB(i) {
    if (!el.lb || !el.lbImg || !usable(i)) return;
    state.lbReturnFocus = document.activeElement;
    state.lbIndex = i;
    state.lbOpen = true;
    el.lbImg.src = cellSrc(i);
    paintCount();
    el.lb.style.display = 'flex';
    lock('lb', true);
    requestAnimationFrame(function () {
      el.lb.style.opacity = '1';
      el.lbImg.style.opacity = '1';
      el.lbImg.style.transform = 'scale(1)';
    });
    var close = $('jm-lb-close');
    if (close) close.focus();
  }

  function paintCount() {
    if (!el.lbCount) return;
    var pos = 0, total = 0;
    for (var i = 0; i < cells.length; i++) {
      if (!usable(i)) continue;
      total++;
      if (i === state.lbIndex) pos = total;
    }
    el.lbCount.textContent = pos + ' / ' + total;
  }

  function closeLB() {
    if (!el.lb || !state.lbOpen) return;
    state.lbOpen = false;
    el.lb.style.opacity = '0';
    if (el.lbImg) { el.lbImg.style.opacity = '0'; el.lbImg.style.transform = 'scale(.94)'; }
    lock('lb', false);
    setTimeout(function () { if (!state.lbOpen) el.lb.style.display = 'none'; }, 460);
    if (state.lbReturnFocus && state.lbReturnFocus.focus) state.lbReturnFocus.focus();
  }

  function stepLB(dir) {
    if (!el.lbImg || usableCount() < 2) return;
    var i = state.lbIndex, guard = 0;
    do {
      i = (i + dir + cells.length) % cells.length;
      guard++;
    } while (!usable(i) && guard <= cells.length);
    if (!usable(i)) return;
    state.lbIndex = i;
    el.lbImg.style.opacity = '0';
    el.lbImg.style.transform = 'scale(.97)';
    setTimeout(function () {
      el.lbImg.src = cellSrc(state.lbIndex);
      paintCount();
      requestAnimationFrame(function () {
        el.lbImg.style.opacity = '1';
        el.lbImg.style.transform = 'scale(1)';
      });
    }, 220);
  }

  function onKey(e) {
    if (state.lunaOpen && e.key === 'Escape') { closeLuna(); return; }
    if (!state.lbOpen) return;
    if (e.key === 'Escape') closeLB();
    else if (e.key === 'ArrowLeft') stepLB(-1);
    else if (e.key === 'ArrowRight') stepLB(1);
  }

  /* ---------- fondo para la luna de miel ----------
     El botón de la mesa de regalos abre una tarjeta con los datos de
     la cuenta. Mismo patrón que el lightbox: overlay, Escape y foco
     de regreso al botón. */
  function openLuna() {
    var m = $('jm-luna');
    if (!m) return;
    state.lunaReturnFocus = document.activeElement;
    state.lunaOpen = true;
    m.style.display = 'flex';
    lock('luna', true);
    requestAnimationFrame(function () { m.style.opacity = '1'; });
    var close = $('jm-luna-close');
    if (close) close.focus();
  }

  function closeLuna() {
    var m = $('jm-luna');
    if (!m || !state.lunaOpen) return;
    state.lunaOpen = false;
    m.style.opacity = '0';
    lock('luna', false);
    setTimeout(function () { if (!state.lunaOpen) m.style.display = 'none'; }, 460);
    if (state.lunaReturnFocus && state.lunaReturnFocus.focus) state.lunaReturnFocus.focus();
  }

  /* ---------- música ---------- */
  function toggleMusic() {
    var a = el.audio;
    if (!a) return;
    var s = (CONFIG.musicSrc || '').trim();
    if (s && a.getAttribute('src') !== s) a.setAttribute('src', s);
    if (!a.getAttribute('src')) return;
    if (a.paused) { a.volume = 0.35; a.play().catch(function () {}); } else { a.pause(); }
    syncMusicUI();
  }

  function syncMusicUI() {
    var a = el.audio, btn = el.music;
    if (!a || !btn) return;
    var src = (CONFIG.musicSrc || '').trim() || a.getAttribute('src') || '';
    if (src && a.getAttribute('src') !== src) a.setAttribute('src', src);
    btn.style.display = src ? 'flex' : 'none';
    if (!src) return;
    var on = !a.paused;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (el.musicLabel) el.musicLabel.textContent = on ? 'pausar' : 'música';
    if (el.bars) {
      Array.prototype.forEach.call(el.bars.children, function (b, i) {
        b.style.animation = on ? 'jmBars ' + (0.7 + i * 0.22) + 's ease-in-out infinite' : 'none';
      });
    }
  }

  /* ---------- scroll / resize ---------- */
  function afterJump() {
    state.jumpT.forEach(clearTimeout);
    state.jumpT = [0, 120, 320, 700, 1200].map(function (t) {
      return setTimeout(function () { syncNavInk(); syncReveal(false); syncParallax(); }, t);
    });
  }

  function onScroll() {
    syncNavInk();
    syncReveal(false);
    syncParallax();
    if (!state.live) return;
    var travel = Math.max(1, (state.L.openH - state.L.H) * 0.72);
    var p = Math.min(1, Math.max(0, window.scrollY / travel));
    if (Math.abs(p - state.p) < 0.0008) return;
    state.p = p;
    if (state.raf) return;
    state.raf = requestAnimationFrame(function () { state.raf = null; place(state.p); });
  }

  function onResize() {
    state.L = measure();
    applyStatic();
    watchDarkBands();
    fitGrid();
    if (state.opened) {
      if (el.opening) el.opening.style.height = state.L.openH + 'px';
      place(state.p);
    } else if (el.env && el.hero) {
      el.env.style.transform = 'translate(-50%,-50%)';
      el.hero.style.transform = 'translate(-50%,-50%) scale(.55)';
    }
  }

  /* ---------- abrir el sobre ---------- */
  function openIt() {
    if (state.opened) return;
    state.opened = true;
    var L = state.L;
    var k = reduceMotion ? 0 : 1;   // sin animación: todo cae al estado final
    var at = function (ms, fn) { setTimeout(fn, ms * k); };

    if (el.envInner) el.envInner.style.animation = 'none';
    if (el.env) {
      el.env.style.transition = 'transform 1s cubic-bezier(.22,1,.36,1),opacity .8s ease';
      el.env.removeAttribute('role');
      el.env.removeAttribute('tabindex');
      el.env.style.cursor = 'default';
    }
    if (el.hint) { el.hint.style.animation = 'none'; el.hint.style.opacity = '0'; el.hint.style.pointerEvents = 'none'; }
    if (el.seal) { el.seal.style.opacity = '0'; el.seal.style.transform = 'scale(.82) rotate(-8deg)'; }
    if (el.flap) el.flap.style.transform = 'rotateX(-168deg)';

    at(480, function () { if (el.flap) el.flap.style.zIndex = '0'; });
    at(520, function () {
      if (!el.hero) return;
      el.hero.style.opacity = '1';
      el.hero.style.transform = 'translate(-50%,-50%) translate(0px,' + (-0.72 * L.envH) + 'px)';
    });
    at(1000, function () { if (el.hero) el.hero.style.zIndex = '20'; });
    at(1250, function () {
      if (el.hero) el.hero.style.transform = 'translate(-50%,-50%) translate(' + L.cardX + 'px,' + L.cardY + 'px)';
      if (el.env) el.env.style.transform = 'translate(-50%,-50%) translate(' + L.envX + 'px,' + L.envY + 'px) rotate(-2deg)';
    });
    at(2200, function () {
      if (el.hero) el.hero.style.transition = 'none';
      if (el.env) el.env.style.transition = 'none';
      if (el.opening) el.opening.style.height = state.L.openH + 'px';
      lock('envelope', false);
      if (el.scrollHint) el.scrollHint.style.opacity = '1';
      state.live = true;
      place(0);
      setupReveal();
      if (el.glow) el.glow.style.opacity = '0';
    });
  }

  /* ---------- assets ausentes ----------
     Mientras las ilustraciones y fotos no estén sincronizadas desde
     el proyecto de diseño (ver assets/README.md), una imagen rota no
     debe verse como error: se oculta y su hueco queda con el color
     de fondo, que ya es parte del diseño. */
  var itineraryCollapsed = false;
  function collapseItinerary() {
    if (itineraryCollapsed) return;
    itineraryCollapsed = true;
    Array.prototype.forEach.call(document.querySelectorAll('.jm-itin-ill'), function (s) {
      s.style.display = 'none';
    });
    Array.prototype.forEach.call(document.querySelectorAll('.jm-itin-row'), function (r) {
      r.style.gridTemplateColumns = 'minmax(84px,132px) 1fr';
    });
  }

  function handleMissing(img) {
    img.classList.add('jm-missing');
    if (!img.closest) return;

    // Galería: la celda sale del lightbox y del conteo.
    var cell = img.closest('[data-gcell]');
    if (cell) {
      cell.dataset.unavailable = '1';
      cell.style.cursor = 'default';
      cell.setAttribute('aria-hidden', 'true');
      cell.tabIndex = -1;
      return;
    }

    // Itinerario: una lista con unas filas ilustradas y otras no se ve
    // rota, así que si falta una ilustración se colapsa la columna en
    // todas las filas y la lista queda pareja. Vuelve sola en cuanto
    // estén los cinco archivos.
    if (img.closest('.jm-itin-ill')) { collapseItinerary(); return; }

    // Historia / regalos / RSVP: la ilustración se quita del flujo para
    // que el texto no quede empujado contra una columna vacía.
    var holder = img.parentElement;
    if (holder && holder.children.length === 1) holder.style.display = 'none';
    else img.style.display = 'none';
  }
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG') handleMissing(t);
  }, true);

  /* ---------- formulario de confirmación ----------
     Sin JS el <form> hace POST normal y Netlify enseña su propia
     página de gracias; con JS lo mandamos por fetch para no sacar a
     nadie del sitio y responder ahí mismo. */
  function setupForm() {
    var form = $('jm-rsvp-form');
    if (!form) return;
    var estado = $('jm-form-estado');
    var gracias = $('jm-rsvp-gracias');
    var detalles = form.querySelector('.jm-solo-si');

    // Si contestan que no vienen, lo que sobra se pliega.
    function syncDetalles() {
      var no = form.querySelector('input[name="asiste"][value="no"]');
      if (detalles) detalles.hidden = !!(no && no.checked);
    }
    Array.prototype.forEach.call(form.querySelectorAll('input[name="asiste"]'), function (r) {
      r.addEventListener('change', syncDetalles);
    });
    syncDetalles();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = '.6'; }
      if (estado) { estado.style.color = ''; estado.textContent = 'Enviando…'; }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.hidden = true;
        if (gracias) {
          gracias.hidden = false;
          gracias.scrollIntoView({ block: 'center' });
        }
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.style.opacity = ''; }
        if (estado) {
          estado.style.color = '#E0A0A0';
          estado.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo otra vez, '
            + 'o mándanos un WhatsApp y nosotros lo apuntamos.';
        }
      });
    });
  }

  /* ---------- arranque ---------- */
  function mount() {
    renderDrift();
    state.L = measure();
    applyStatic();
    applyItinerario();

    window.scrollTo(0, 0);
    lock('envelope', true);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', afterJump);
    window.addEventListener('scrollend', afterJump);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a) afterJump();
    }, true);

    watchDarkBands();
    setupReveal();
    state.plx = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    syncParallax();
    syncMusicUI();
    setupGallery();
    setupModos();          /* decide el modo y, si toca mosaico, monta el color al centrar */
    setupForm();

    if (el.env) {
      el.env.addEventListener('click', openIt);
      el.env.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIt(); }
      });
      if (el.glow) {
        el.env.addEventListener('mouseenter', function () { if (!state.opened) el.glow.style.opacity = '1'; });
        el.env.addEventListener('mouseleave', function () { el.glow.style.opacity = '0'; });
      }
    }
    if (el.hint) el.hint.addEventListener('click', openIt);
    if (el.music) el.music.addEventListener('click', toggleMusic);
    if (el.audio) {
      el.audio.addEventListener('play', syncMusicUI);
      el.audio.addEventListener('pause', syncMusicUI);
    }

    var lbClose = $('jm-lb-close'), lbPrev = $('jm-lb-prev'), lbNext = $('jm-lb-next');
    if (el.lb) el.lb.addEventListener('click', closeLB);
    if (el.lbImg) el.lbImg.addEventListener('click', function (e) { e.stopPropagation(); });
    if (lbClose) lbClose.addEventListener('click', function (e) { e.stopPropagation(); closeLB(); });
    if (lbPrev) lbPrev.addEventListener('click', function (e) { e.stopPropagation(); stepLB(-1); });
    if (lbNext) lbNext.addEventListener('click', function (e) { e.stopPropagation(); stepLB(1); });

    var lunaBtn = $('jm-luna-btn'), luna = $('jm-luna'),
        lunaCard = $('jm-luna-card'), lunaClose = $('jm-luna-close');
    if (lunaBtn) lunaBtn.addEventListener('click', openLuna);
    if (luna) luna.addEventListener('click', closeLuna);
    if (lunaCard) lunaCard.addEventListener('click', function (e) { e.stopPropagation(); });
    if (lunaClose) lunaClose.addEventListener('click', function (e) { e.stopPropagation(); closeLuna(); });

    personalizar();

    tick();
    state.timer = setInterval(tick, 1000);
    setTimeout(function () { syncReveal(false); }, 8000);

    if (CONFIG.openOnLoad || reduceMotion) setTimeout(openIt, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
