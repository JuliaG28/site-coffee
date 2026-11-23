/* Monta o site a partir de cliente.js: cores, pacotes desenhados, cena animada,
   catálogo, ficha de degustação, origem, vantagens e contatos.
   Não precisa mexer aqui para um cliente novo — só em cliente.js. */
(function () {
  const C = window.CLIENTE;
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- cores ---------- */
  const k = C.cores, root = document.documentElement.style;
  root.setProperty('--green', k.principal);
  root.setProperty('--green-900', k.escura);
  root.setProperty('--yellow', k.destaque);
  root.setProperty('--gold', k.destaque);
  root.setProperty('--cream', k.fundo);
  root.setProperty('--paper', k.papel);
  root.setProperty('--wall2', k.parede[1]);
  root.setProperty('--bench1', k.bancada[0]);
  document.title = C.nome + ' · ' + C.slogan;
  $('meta[name=description]').setAttribute('content', C.descricao);

  /* ---------- pacote desenhado (SVG) quando o cliente não manda foto ---------- */
  const corDaLinha = (id) => (C.linhas.find((l) => l.id === id) || C.linhas[0]).cor;
  // pacote em pé, 530 x 1200
  function pouch(cor, linha, peso) {
    const nome = C.nome.toUpperCase();
    const fs = Math.min(170, Math.floor(980 / (nome.length * 0.6)));
    return `
      <defs>
        <linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
        <clipPath id="bd"><path d="M30 70 H500 V1130 Q500 1180 450 1180 H80 Q30 1180 30 1130 Z"/></clipPath>
      </defs>
      <path d="M30 70 H500 V1130 Q500 1180 450 1180 H80 Q30 1180 30 1130 Z" fill="${cor}"/>
      <g clip-path="url(#bd)">
        <path d="M30 880 L500 600 V1180 H30 Z" fill="#f6efe3"/>
        <text x="0" y="0" transform="translate(205 1150) rotate(-90)" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="${fs}" fill="#fff" letter-spacing="-3">${esc(nome)}</text>
        <circle cx="390" cy="210" r="52" fill="none" stroke="${k.destaque}" stroke-width="8"/>
        <path d="M390 168 C360 200 420 220 390 252" fill="none" stroke="${k.destaque}" stroke-width="8" stroke-linecap="round"/>
        <text x="470" y="330" text-anchor="end" font-family="Inter, sans-serif" font-weight="600" font-size="30" fill="#fff" opacity=".8">CAFÉ</text>
        <text x="470" y="380" text-anchor="end" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="${Math.min(46, Math.floor(230 / (linha.length * 0.62)))}" fill="#fff">${esc(linha.toUpperCase())}</text>
        <text x="470" y="1130" text-anchor="end" font-family="Inter, sans-serif" font-weight="800" font-size="40" fill="${cor}">${esc(peso)}</text>
        <rect x="30" y="70" width="470" height="1110" fill="url(#sh)"/>
      </g>
      <rect x="22" y="18" width="486" height="62" rx="10" fill="${cor}"/>
      <rect x="22" y="18" width="486" height="62" rx="10" fill="#000" opacity=".22"/>
      <g stroke="#000" stroke-opacity=".18" stroke-width="3">${Array.from({ length: 23 }, (_, i) => `<line x1="${34 + i * 21}" y1="28" x2="${34 + i * 21}" y2="70"/>`).join('')}</g>`;
  }
  const svgURL = (vb, body) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`);
  // grãos (posições fixas, sem aleatório, para o desenho ser sempre igual)
  function grains(cx, top, bottom, spread) {
    let s = 7, out = '';
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 70; i++) {
      const t = rnd(), y = top + t * (bottom - top), w = spread * (0.25 + t * 0.75);
      const x = cx + (rnd() - 0.5) * w, r = rnd() * 180, sz = 26 + rnd() * 10;
      out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(0)})"><ellipse rx="${sz}" ry="${(sz * 0.72).toFixed(1)}" fill="#4a2c1a"/><ellipse rx="${sz}" ry="${(sz * 0.72).toFixed(1)}" fill="url(#gl)"/><path d="M${-sz * 0.8} 0 Q0 ${sz * 0.35} ${sz * 0.8} 0" stroke="#24140b" stroke-width="5" fill="none"/></g>`;
    }
    return `<defs><radialGradient id="gl" cx=".35" cy=".3"><stop offset="0" stop-color="#9a6a45" stop-opacity=".9"/><stop offset="1" stop-color="#4a2c1a" stop-opacity="0"/></radialGradient></defs>` + out;
  }
  const L0 = C.linhas[0], L1 = C.linhas[1] || C.linhas[0];
  const pacoteEmPe = C.pacote.emPe || svgURL('0 0 530 1200', pouch(L0.cor, L0.nome, '500g'));
  const pacoteAberto = C.pacote.aberto || svgURL('0 0 760 2002',
    `<g transform="translate(689 1400) rotate(180) scale(1.166)">${pouch(L0.cor, L0.nome, '500g')}</g>` + grains(380, 1400, 1990, 520));
  const pacoteDeitado = C.pacote.deitado || svgURL('0 0 1275 1275',
    `<g transform="translate(129 696) rotate(-90) scale(.4667)">${pouch(L1.cor, L1.nome, '500g')}</g>`);
  const fotoProduto = (p) => p.img || svgURL('0 0 600 600',
    `<rect width="600" height="600" fill="#fff"/><ellipse cx="300" cy="560" rx="150" ry="16" fill="#000" opacity=".08"/><g transform="translate(183 30) scale(.44)">${pouch(corDaLinha(p.linha), (C.linhas.find((l) => l.id === p.linha) || L0).nome, p.peso)}</g>`);

  /* ---------- cabeçalho, ticker, rodapé ---------- */
  const logoHTML = C.logo ? `<img src="${esc(C.logo)}" alt="${esc(C.nome)}">` : `<span class="logo-txt">${esc(C.nome)}</span>`;
  $('header .logo').innerHTML = logoHTML;
  $('header .logo').setAttribute('aria-label', C.nome + ', início');
  // sem número (demonstração): os botões levam para a página de vendas da MOVA
  const wa = (msg) => C.contato.whatsapp ? `https://wa.me/${C.contato.whatsapp}?text=${encodeURIComponent(msg)}` : '../vendas/index.html#plano';
  const comprar = C.contato.loja || wa(`Olá! Vim pelo site e quero fazer um pedido de café ${C.nome}.`);
  $('header .buy').href = comprar;
  $('#nav-origem').textContent = 'Origem';
  const tk = C.ticker.map((t) => `<span>${esc(t)}</span>`).join('');
  $('.ticker').setAttribute('aria-label', C.ticker.join(', '));
  $('.ticker div').innerHTML = tk + tk;

  /* ---------- catálogo ---------- */
  $('.filters').innerHTML = `<button type="button" aria-pressed="true" data-f="all">Todos</button>` +
    C.linhas.map((l) => `<button type="button" aria-pressed="false" data-f="${esc(l.id)}">${esc(l.nome)}</button>`).join('');
  const off = (p) => {
    if (!p.de) return 0;
    const n = (v) => parseFloat(v.replace(/\./g, '').replace(',', '.'));
    return Math.round((1 - n(p.preco) / n(p.de)) * 100);
  };
  const grid = $('#grid');
  grid.innerHTML = C.produtos.map((p) => `
    <article class="card" data-line="${esc(p.linha)}">
      <div class="ph">${off(p) > 0 ? `<span class="off">-${off(p)}%</span>` : ''}<img src="${fotoProduto(p)}" alt="Café ${esc(p.nome)}, ${esc(p.peso)}" loading="lazy"></div>
      <div class="bd">
        <h3>${esc(p.nome)} <small style="font:500 14px var(--body);color:var(--muted)">${esc(p.peso)}</small></h3>
        <div class="notes">${p.notas.map((n) => `<span>${esc(n)}</span>`).join('')}</div>
        <div class="price"><b>R$${esc(p.preco)}</b>${p.de ? `<s>R$${esc(p.de)}</s>` : ''}<small>${esc(p.parcelas)}</small></div>
        <a class="btn" href="${p.link || C.contato.loja || wa(`Olá! Quero o café ${p.nome} (${p.peso}) da ${C.nome}.`)}" target="_blank" rel="noopener">${p.link || C.contato.loja ? 'Comprar' : 'Pedir no WhatsApp'}</a>
      </div>
    </article>`).join('');
  document.querySelectorAll('.filters button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    grid.querySelectorAll('.card').forEach((c) => (c.hidden = b.dataset.f !== 'all' && c.dataset.line !== b.dataset.f));
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  /* ---------- origem + ficha ---------- */
  const O = C.origem;
  $('#origem .eyebrow').textContent = O.etiqueta;
  $('#origem h2').textContent = O.titulo;
  $('#origem .lead').textContent = O.texto;
  $('#origem .facts').innerHTML = O.fatos.map(([a, b]) => `<div class="fact"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
  $('#origem .verse').textContent = O.frase || '';
  $('.tabs').innerHTML = C.linhas.map((l, i) => `<button role="tab" id="t-${esc(l.id)}" aria-selected="${i === 0}" data-k="${esc(l.id)}">${esc(l.nome)}</button>`).join('');
  const rows = $('#rows');
  const torra = ['Clara', 'Média', 'Escura'];
  function showSheet(id) {
    const l = C.linhas.find((x) => x.id === id);
    rows.innerHTML = Object.entries(l.ficha).map(([key, v]) => key === 'Torra'
      ? `<div><dt>Torra</dt><dd>${torra[v - 1] || ''}<span class="roast" aria-hidden="true">${[1, 2, 3].map((i) => `<i class="${i <= v ? 'on' : ''}"></i>`).join('')}</span></dd></div>`
      : `<div><dt>${esc(key)}</dt><dd>${esc(v)}</dd></div>`).join('') + `<div><dt>Origem</dt><dd>${esc(O.local)}</dd></div>`;
    rows.setAttribute('aria-labelledby', 't-' + id);
    document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.k === id));
  }
  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => showSheet(b.dataset.k)));
  showSheet(C.linhas[0].id);

  /* ---------- vantagens ---------- */
  const ICON = {
    frete: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    cartao: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    seguro: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    troca: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>',
  };
  $('.perks').innerHTML = C.vantagens.map(([ic, t, d]) => `<div class="perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[ic] || ICON.seguro}</svg><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('');

  /* ---------- contato + rodapé ---------- */
  const ct = C.contato;
  $('#contato .eyebrow').textContent = C.slogan;
  $('#contato p').textContent = ct.chamada;
  $('#contato .handle').textContent = ct.whatsappTexto;
  $('#contato .btn').href = wa(`Olá! Vim pelo site da ${C.nome}.`);
  const ig = $('#contato .btn.ghost');
  if (ct.instagram) { ig.href = 'https://instagram.com/' + ct.instagram; ig.textContent = '@' + ct.instagram + ' no Instagram'; } else ig.remove();
  $('.foot .marca').innerHTML = (C.logo ? `<img src="${esc(C.logo)}" alt="${esc(C.nome)}">` : `<span class="logo-txt">${esc(C.nome)}</span>`) +
    `<p style="margin-top:16px; max-width:36ch; line-height:1.55">${esc(C.descricao)}</p>`;
  $('.foot .atend').innerHTML = `<h4>Atendimento</h4><a href="${wa('Olá!')}" target="_blank" rel="noopener">WhatsApp ${esc(ct.whatsappTexto)}</a>` +
    (ct.instagram ? `<a href="https://instagram.com/${esc(ct.instagram)}" target="_blank" rel="noopener">Instagram @${esc(ct.instagram)}</a>` : '') +
    (ct.loja ? `<a href="${esc(ct.loja)}" target="_blank" rel="noopener">Loja online</a>` : '');
  $('.copy span').textContent = `© ${new Date().getFullYear()} ${C.nome}.` + (C.demonstracao ? ' Marca fictícia, site de demonstração da MOVA Estúdio Digital.' : ' Site por MOVA Estúdio Digital.');
  if (!C.demonstracao) $('.concept')?.remove();

  /* ---------- cena animada (posições do Figma, quadros 1 a 6) ---------- */
  const B = (l, t, w, h, r = 0, o = 1, extra = {}) => Object.assign({ x: l + w / 2, y: t + h / 2, w, h, r, o }, extra);
  const Cc = (cx, cy, w, h, r = 0, o = 1) => ({ x: cx, y: cy, w, h, r, o });
  const BG = (t, o = 1) => B(-480, t, 2400, 2053, 0, o);
  const P = (cx, cy, r, o, clipB, span) => ({ x: cx, y: cy, w: 361, h: 951, r, o, clipB, span });
  const T = (bottom, o = 1) => ({ x: 720, y: bottom, o });
  const F = C.filtroCafeteira || '';
  const part = (name, s3x, filter) => ({ src: `../assets/${name}.webp`, filter, s: [Cc(s3x, 558, 880, 880),,, , Cc(706, 558, 880, 880), Cc(706, 558, 880, 880)] });
  const H = C.hero;
  window.SCENE = {
    width: 1440, height: 1024, states: 8, mobileFocus: 900, split: 862,
    fill: [0, 0, 0, 0, 1, 1, 1, 1],
    layers: [
      { div: `radial-gradient(60% 45% at 75% 70%, rgba(0,0,0,.12), transparent 70%), linear-gradient(${k.parede[0]} 0%, ${k.parede[1]} 85.9%, ${k.bancada[0]} 85.9%, ${k.bancada[1]} 100%)`, s: [BG(-602, 0), BG(-602, 0), BG(-602), BG(-602), BG(-902), BG(-902)] },
      { text: H.final1, size: 260, color: '#fff', s: [T(1371), T(1371), T(571), T(-249)] },
      { text: H.final2, size: 260, color: '#fff', s: [T(1611), T(1611), T(811), T(-9)] },
      { text: H.palavra1, size: 300, color: k.destaque, s: [T(-235), T(555), T(-365)] },
      { text: H.palavra2, size: 300, color: k.principal, s: [T(20), T(810), T(-110)] },
      { src: '../assets/beans-1.webp', s: [B(136.81, -1856, 987.186, 1020.283), , B(136.81, 1114, 987.186, 1020.283), B(136.81, 1134, 987.186, 1020.283)] },
      { src: '../assets/beans-2.webp', s: [B(106, -1331.93, 987.186, 1020.283), , B(106, 978.07, 987.186, 1020.283), B(106, 998.07, 987.186, 1020.283)] },
      { keep: true, src: pacoteAberto, alt: '', s: [P(734, -400, -186, 0, 275), P(734, 556, -186, 0, 275), P(734, 556, -6, 1, 275, [0.97, 1]), P(734, 556, -6, 1, 0, [0.15, 1]), P(860, -200, -10, 1, 0), P(860, -1100, -10, 1, 0)] },
      { keep: true, src: pacoteEmPe, alt: `Pacote ${C.nome} ${L0.nome}`, s: [Cc(720, -450, 300, 679, -20), Cc(720, 420, 300, 679, -6), Cc(720, 420, 300, 679, 174), Object.assign(Cc(720, 420, 300, 679, 174, 0), { span: [0, 0.12] }), Cc(720, -600, 300, 679, 174, 0)] },
      { src: pacoteDeitado, alt: `Pacote ${C.nome} ${L1.nome}`, s: [Cc(867.66, -532.70, 848, 848), Cc(559, 634, 848, 848, -76.19), Cc(518.13, 283.21, 1148.796, 1148.796, -39.16), Cc(518.13, -306.79, 1148.796, 1148.796, -39.16)] },
      { src: '../assets/coffee-filter.webp', alt: 'Filtro de papel', s: [B(270, 1208, 860, 635), , B(86, 531, 1228, 907), B(329, 137, 742, 549), B(635, 137, 372, 275)] },
      part('top-stick', 1876),
      part('bottom-part', -794, F),
      part('glass-dish-1', -524),
      part('kettle-stick', 1946),
      part('kettle-glass', 1946),
      { src: '../assets/mask-group.webp', s: [B(682, 628, 296, 216, 0, 0, { clip: 186 }),,,, B(682, 628, 296, 216, 0, 1, { clip: 186 }), B(682, 628, 296, 216, 0, 1, { clip: 0 })] },
      part('filter-cup-base', 2686),
      part('kettle-frame', 1926),
      part('kettle-handle', 2126),
      part('middle-part', -1024, F),
      { src: '../assets/filter-cup.webp', s: [Cc(468, 2647, 1584, 1584),, , Cc(468, 917, 1584, 1584), Cc(694, 558, 880, 880)] },
      { src: '../assets/filter-top.webp', s: [Cc(468, -424, 1584, 1584),, , Cc(468, 917, 1584, 1584), Cc(694, 558, 880, 880)] },
      { src: '../assets/coffee-beans-table.webp', s: [B(-1169, 849, 469, 159),,, , B(-129, 849, 469, 159)] },
      { src: '../assets/coffee-beans-table-2.webp', s: [B(2245, 877, 364, 116),,, , B(1155, 877, 364, 116)] },
    ],
  };
  // quadros 3 e 4 (pacote vira e derrama): as outras camadas ficam paradas como no quadro 2
  SCENE.layers.forEach((L) => { if (!L.keep) { const a = L.s; L.s = [a[0], a[1], undefined, undefined, ...a.slice(2)]; } });
  $('.scene').setAttribute('aria-label', `${H.palavra1} ${H.palavra2}, ${H.final1} ${H.final2}`);

  // menu mobile
  const burger = $('.burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  menu.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
})();
