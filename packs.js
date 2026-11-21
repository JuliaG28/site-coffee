/* Recorta os pacotes do Café Patriota do banner da loja oficial e monta as camadas
   "pacote" e "sachê" da animação. Se algo falhar, a animação usa as imagens originais. */
window.patriotaPacks = async function () {
  const BANNER = 'https://acdn-us.mitiendanube.com/stores/006/873/334/themes/brasilia/2-slide-1762202636873-2036162811-22826ac350f1959ec69b850c352007bb1762202678-1920-1920.webp?2601105950';
  const bm = await createImageBitmap(await (await fetch(BANNER, { mode: 'cors' })).blob());
  const W = bm.width, H = bm.height;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d', { willReadFrequently: true });
  x.drawImage(bm, 0, 0);
  const im = x.getImageData(0, 0, W, H), d = im.data;

  // 1) remove o fundo branco por preenchimento a partir das bordas
  const isBg = (i) => { const r = d[i], g = d[i + 1], b = d[i + 2]; const mn = Math.min(r, g, b), mx = Math.max(r, g, b); return mn > 150 && mx - mn < 26; };   // branco + sombra cinza do chão
  const seen = new Uint8Array(W * H), q = new Int32Array(W * H); let h = 0, t = 0;
  const push = (p) => { if (!seen[p] && isBg(p * 4)) { seen[p] = 1; q[t++] = p; } };
  for (let i = 0; i < W; i++) { push(i); push((H - 1) * W + i); }
  for (let j = 0; j < H; j++) { push(j * W); push(j * W + W - 1); }
  while (h < t) { const p = q[h++], px = p % W; if (px > 0) push(p - 1); if (px < W - 1) push(p + 1); if (p >= W) push(p - W); if (p < W * (H - 1)) push(p + W); }
  for (let p = 0; p < W * H; p++) if (seen[p]) d[p * 4 + 3] = 0;
  // suaviza a borda clara que sobra em volta do pacote
  for (let p = W; p < W * (H - 1); p++) {
    if (seen[p]) continue;
    if (seen[p - 1] || seen[p + 1] || seen[p - W] || seen[p + W]) { const i = p * 4; if (Math.min(d[i], d[i + 1], d[i + 2]) > 170) d[i + 3] = 0; else d[i + 3] = 170; }
  }
  x.putImageData(im, 0, 0);

  // 2) recorta um pacote (retângulo + corte reto onde encosta no vizinho)
  function cut(x0, y0, x1, y1, keep) {
    const c = document.createElement('canvas'); c.width = x1 - x0; c.height = y1 - y0;
    const cx = c.getContext('2d'); cx.drawImage(cv, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
    const id = cx.getImageData(0, 0, c.width, c.height);
    for (let yy = 0; yy < c.height; yy++) for (let xx = 0; xx < c.width; xx++) if (!keep(xx + x0, yy + y0)) id.data[(yy * c.width + xx) * 4 + 3] = 0;
    cx.putImageData(id, 0, 0);
    return c;
  }
  const S = W / 1580;   // coordenadas medidas no banner de 1580px
  const tradicional = cut(352 * S, 108 * S, 578 * S, 597 * S, (px, py) => px >= (371 - 7 * (py / S - 119) / 482) * S);
  const extraforte = cut(988 * S, 104 * S, 1196 * S, 600 * S, (px) => px <= 1193 * S);

  // 3) monta as camadas no mesmo tamanho das imagens do Figma
  function layer(w, hgt, img, cx0, cy0, height, rot) {
    const c = document.createElement('canvas'); c.width = w; c.height = hgt;
    const g = c.getContext('2d'); const k = height / img.height;
    g.translate(cx0, cy0); g.rotate(rot); g.drawImage(img, -img.width * k / 2, -img.height * k / 2, img.width * k, img.height * k);
    return new Promise((r) => c.toBlob((b) => r(URL.createObjectURL(b)), 'image/png'));
  }
  return {
    bottom: await layer(1794, 1325, tradicional, 901, 810, 830, Math.PI),       // a cena gira -172°, então entra de cabeça pra baixo
    top: await layer(1275, 1275, extraforte, 409, 576, 560, Math.PI / 2),         // sachê horizontal -> pacote deitado
  };
};
