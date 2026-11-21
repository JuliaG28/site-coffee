/* Motor de cena: anima camadas entre os "quadros" do Figma conforme o scroll.
   Cada camada tem uma lista de estados {x,y,w,h,r,o,clip} (x,y = centro, em px do quadro 1440x1024). */
(function () {
  const D = window.SCENE;
  const W = D.width, H = D.height, N = D.states;
  const stage = document.querySelector('.stage');
  const wrap = document.querySelector('.scene');
  const els = [];

  D.layers.forEach((L) => {
    let el;
    if (L.div) {
      el = document.createElement('div');
      el.className = 'lyr';
      el.style.background = L.div;
    } else if (L.text) {
      el = document.createElement('div');
      el.className = 'txt';
      el.textContent = L.text;
      Object.assign(el.style, { fontSize: L.size + 'px', color: L.color });
    } else {
      el = document.createElement('img');
      el.src = L.src;
      el.alt = L.alt || '';
      el.decoding = 'async';
      el.className = 'lyr';
    }
    if (L.filter) el.style.filter = L.filter;
    stage.appendChild(el);
    // completa estados ausentes repetindo o anterior/seguinte
    const st = [];
    for (let i = 0; i < N; i++) st[i] = L.s[i] || null;
    for (let i = 1; i < N; i++) if (!st[i]) st[i] = st[i - 1];
    for (let i = N - 2; i >= 0; i--) if (!st[i]) st[i] = st[i + 1];
    els.push({ el, st, L });
  });

  const props = (L, s) => {
    const p = { x: s.x, y: s.y, rotation: s.r || 0, opacity: s.o ?? 1 };
    if (!L.text) { p.width = s.w; p.height = s.h; }
    if (s.clip != null) p.clipPath = `inset(${s.clip}px 0px 0px 0px)`;
    return p;
  };

  els.forEach(({ el, st, L }) => {
    gsap.set(el, Object.assign({ xPercent: -50, yPercent: L.text ? -100 : -50 }, props(L, st[0])));
  });

  // Intro automática (quadro 1 -> 2), depois o scroll conduz o resto
  const ease = 'power2.inOut';
  const intro = gsap.timeline({ paused: true });
  els.forEach(({ el, st, L }) => intro.to(el, Object.assign({ duration: 1.6, ease }, props(L, st[1])), 0));
  if (D.fill) intro.to('.fill', { opacity: D.fill[1], duration: 1.6, ease }, 0);

  const tl = gsap.timeline({ paused: true });
  window.__tl = tl;
  for (let i = 1; i < N - 1; i++) {
    els.forEach(({ el, st, L }) => tl.to(el, Object.assign({ duration: 1, ease }, props(L, st[i + 1])), i - 1));
    if (D.fill) tl.to('.fill', { opacity: D.fill[i + 1], duration: 1, ease }, i - 1);
  }

  // escala: cobre a tela no desktop; no celular prioriza o produto inteiro
  function fit() {
    const vw = innerWidth, vh = innerHeight;
    const cover = Math.max(vw / W, vh / H);
    // telas largas e baixas: limita o corte em cima/embaixo e completa as laterais com a cor de fundo
    const s = vw < 768 ? Math.max(vw / W, Math.min(vh / H, vw / (D.mobileFocus || 900))) : Math.min(cover, (vh / H) * 1.3);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
    const hd = document.querySelector('header');
    if (hd) { hd.style.setProperty('--s', Math.min(s, vw / W)); hd.style.setProperty('--x', Math.max(0, (vw - W * s) / 2) + 'px'); }
    if (D.split) wrap.style.setProperty('--split', vh / 2 + (D.split - H / 2) * s + 'px');
  }
  addEventListener('resize', fit);
  fit();

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ?frame=N mostra um quadro parado (usado nos mockups do portfólio)
  const still = new URLSearchParams(location.search).get('frame');
  const header = document.querySelector('header');
  const solid = () => header?.classList.toggle('solid', wrap.getBoundingClientRect().bottom < 90);
  addEventListener('scroll', solid, { passive: true });
  intro.eventCallback('onComplete', () => {
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: () => '+=' + innerHeight * (N - 2) * 0.9,
      pin: true,
      scrub: reduce ? true : 0.8,
      animation: tl,
      snap: { snapTo: 1 / (N - 2), directional: false, inertia: false, delay: 0.15, duration: { min: 0.3, max: 0.9 }, ease },
    });
    document.querySelector('.hint')?.classList.add('show');
  });
  gsap.registerPlugin(ScrollTrigger);
  if (!still) scrollTo(0, 0);
  const imgs = [...stage.querySelectorAll('img')];
  Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? 1 : new Promise((r) => { i.onload = r; i.onerror = () => { i.remove(); r(); }; })))).then(() => {
    document.body.classList.add('ready');
    setTimeout(solid, 50);
    if (still) {
      const f = Math.max(1, Math.min(N, +still));
      intro.eventCallback('onComplete', null);
      intro.progress(1);
      if (f === 1) intro.progress(0); else tl.progress((f - 2) / (N - 2));
      document.body.classList.add('still');
      if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant' }), 300);
      return;
    }
    reduce ? intro.progress(1) : intro.play();
  });
  addEventListener('scroll', () => document.querySelector('.hint')?.classList.toggle('show', scrollY < 40), { passive: true });
})();
