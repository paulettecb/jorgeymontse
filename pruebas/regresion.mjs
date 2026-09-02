/* Repaso de lo que pidieron los novios, punto por punto.
 *
 *     python3 pruebas/servidor.py &          # en otra terminal
 *     node pruebas/regresion.mjs
 *
 * Cada bloque es una de las cosas de su lista, comprobada sobre la página
 * ya pintada: no que el HTML diga algo, sino que en la pantalla se vea.
 * Eso último importa: una vez se borró sin querer todo el CSS de «los
 * detalles» y la sección siguió existiendo en el DOM, con sus clases
 * puestas y su contenido completo, pero saliendo en blanco y con el dibujo
 * de la iglesia del tamaño de la pantalla. Por eso el primer bloque revisa
 * que cada clase que usa el HTML tenga al menos una regla en el CSS.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'node:fs';

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));   // la raíz del repo
const base = 'http://127.0.0.1:8766';
let malo = 0;
const ok = (b, txt, extra) => { if (!b) malo++;
  console.log((b ? '  ✅ ' : '  ❌ ') + txt + (extra !== undefined ? ' · ' + extra : '')); };

/* ---------- 0. ninguna clase huérfana ---------- */
console.log('\n── el CSS cubre todo lo que el HTML usa ──');
{
  // Éstas no llevan regla a propósito: son ganchos de JS o van con style inline.
  const GANCHOS = new Set(['jm-copiar-clabe', 'jm-opcion-txt']);
  const css = readFileSync(join(RAIZ, 'assets/css/site.css'), 'utf8');
  const html = readFileSync(join(RAIZ, 'index.html'), 'utf8');
  const usadas = new Set();
  for (const m of html.matchAll(/class="([^"]+)"/g))
    for (const c of m[1].split(/\s+/)) if (c.startsWith('jm-')) usadas.add(c);
  const huerfanas = [...usadas].filter(c => !GANCHOS.has(c) && !css.includes('.' + c));
  ok(huerfanas.length === 0, 'todas las clases jm- tienen regla', huerfanas.join(', ') || `${usadas.size} clases`);
}

const b = await chromium.launch();
const errores = [];
const abrir = async (url, w = 1440) => {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => m.type() === 'error' && errores.push(m.text()));
  await p.goto(base + url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.getElementById('jm-env')?.click());
  await p.waitForTimeout(3200);
  for (let i = 0; i < 45; i++) { await p.mouse.wheel(0, 700); await p.waitForTimeout(40); }
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(400);
  return p;
};

const p = await abrir('/claudia-barrales');

/* ---------- 1. el botón de confirmar, fuera del celular ---------- */
console.log('\n── 1. quitar el botón de confirmar (en el cel) ──');
{
  const cel = await b.newPage({ viewport: { width: 390, height: 844 } });
  await cel.goto(base + '/claudia-barrales', { waitUntil: 'networkidle' });
  await cel.evaluate(() => document.getElementById('jm-env')?.click());
  await cel.waitForTimeout(3000);
  ok(await cel.evaluate(() => getComputedStyle(document.getElementById('jm-pill')).display === 'none'),
     'en el cel no sale');
  await cel.close();
  ok(await p.evaluate(() => getComputedStyle(document.getElementById('jm-pill')).display !== 'none'),
     'en la compu se queda');
}

/* ---------- 2. la foto de «donde todo empezó» ---------- */
console.log('\n── 2. «donde todo empezó» es la foto de la pedida ──');
{
  const r = await p.evaluate(() => {
    const d = document.querySelector('[data-tono]'), i = d && d.querySelector('img');
    return { src: i && i.getAttribute('src'), filtro: d && d.style.filter };
  });
  ok(r.src === 'assets/foto-propuesta.jpeg', 'es la foto de la pedida', r.src);
  console.log('     (tono: ' + r.filtro + ' — los novios la pidieron en blanco y negro,'
            + ' hoy va a medio color; ver el mensaje)');
}

/* ---------- 3. los detalles: tarjetas sobre lino ---------- */
console.log('\n── 3. cuadros de detalles → tarjetas sobre lino, título en vino ──');
{
  const r = await p.evaluate(() => {
    const sec = document.getElementById('detalles');
    const t = document.querySelector('.jm-det-tit');
    const card = document.querySelector('.jm-sede');
    const dib = document.querySelector('.jm-sede-dibujo');
    const cs = getComputedStyle(sec);
    return {
      fondo: cs.backgroundColor,
      textura: cs.backgroundImage.includes('svg') && cs.backgroundImage.includes('gradient'),
      tono: sec.dataset.fondo,
      tituloColor: getComputedStyle(t).color,
      tarjetas: document.querySelectorAll('.jm-sede').length,
      tarjetaFondo: getComputedStyle(card).backgroundColor,
      marco: getComputedStyle(card).borderTopWidth,
      dibujoAlto: Math.round(dib.getBoundingClientRect().height),
      sinSobre: !sec.innerHTML.includes('sobre')
    };
  });
  ok(r.fondo === 'rgb(232, 223, 209)' || r.fondo === 'rgb(205, 211, 189)', 'fondo de lino', r.fondo + ' (' + r.tono + ')');
  ok(r.textura, 'con textura, no plano');
  ok(r.tituloColor === 'rgb(99, 27, 41)', 'título en vino', r.tituloColor);
  ok(r.tarjetas === 2, 'dos tarjetas', r.tarjetas);
  ok(r.tarjetaFondo === 'rgb(253, 252, 248)', 'tarjetas de papel', r.tarjetaFondo);
  ok(r.marco === '1px', 'con su marco');
  ok(r.dibujoAlto > 80 && r.dibujoAlto < 200, 'el dibujo a su tamaño', r.dibujoAlto + 'px');
}

/* ---------- 4 y 5. el itinerario ---------- */
console.log('\n── 4 y 5. civil 18:20, recepción 19:00, fotos 19:30 ──');
{
  const filas = await p.evaluate(() =>
    [...document.querySelectorAll('.jm-itin-row')].map(f => ({
      oculta: getComputedStyle(f).display === 'none',
      txt: f.textContent.replace(/\s+/g, ' ').trim()
    })));
  const visible = filas.filter(f => !f.oculta).map(f => f.txt);
  const todas = filas.map(f => f.txt);
  ok(todas.some(t => /^18:20 Ceremonia civil/.test(t)), 'la civil a las 18:20');
  ok(visible.some(t => /^19:00 Recepción/.test(t)), 'recepción a las 19:00');
  ok(visible.some(t => /^19:30 Fotos con los novios/.test(t)), 'fotos con los novios a las 19:30');
  ok(!visible.some(t => /Cóctel/.test(t)), 'ya no dice «cóctel»');
  console.log('     ' + visible.join(' | '));
}

/* ---------- 6. las rayas de vestimenta ---------- */
console.log('\n── 6. líneas de división en el código de vestimenta ──');
{
  const r = await p.evaluate(() => {
    const bl = [...document.querySelectorAll('.jm-viste-bloque')];
    const cs = getComputedStyle(bl[1]);
    return { bloques: bl.length, borde: cs.borderLeftWidth, color: cs.borderLeftColor };
  });
  ok(r.bloques === 3, 'los tres bloques', r.bloques);
  ok(r.borde === '1px', 'con raya en medio (en compu, vertical)', r.borde);
  ok(r.color === 'rgba(246, 244, 238, 0.45)', 'y se ve, no sólo existe', r.color);
  const cel = await b.newPage({ viewport: { width: 390, height: 844 } });
  await cel.goto(base + '/index.html', { waitUntil: 'networkidle' });
  const raya = await cel.evaluate(() => {
    const bl = document.querySelectorAll('.jm-viste-bloque')[1];
    const a = getComputedStyle(bl, '::before');
    return { display: a.display, ancho: a.width, color: a.backgroundColor };
  });
  ok(raya.display === 'block' && raya.color === 'rgba(246, 244, 238, 0.45)',
     'en el cel, horizontal', raya.ancho + ' ' + raya.color);
  await cel.close();
}

/* ---------- 7. los invitados, separados ---------- */
console.log('\n── 7. confirmación: separar los invitados ──');
{
  await p.evaluate(() => document.querySelector('input[name="asiste"][value="sí"]').click());
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const f = [...document.querySelectorAll('.jm-persona')].map(n => n.getBoundingClientRect());
    return { cuantos: f.length, hueco: f.length > 1 ? Math.round(f[1].top - f[0].bottom) : 0 };
  });
  ok(r.cuantos === 3, 'los tres invitados', r.cuantos);
  ok(r.hueco >= 12, 'separados', r.hueco + 'px entre uno y otro');
}

/* ---------- 8. «tu opinión nos importa», sin picarle ---------- */
console.log('\n── 8. «tu opinión nos importa», abierto y sobre lino ──');
{
  const r = await p.evaluate(() => {
    const t = document.querySelector('.jm-mas-tit');
    const caja = document.getElementById('jm-mas');
    const campos = document.querySelector('.jm-mas-campos');
    const alergias = document.querySelector('[name=alergias]');
    const cs = getComputedStyle(caja);
    return {
      texto: t && t.textContent.trim(),
      color: t && getComputedStyle(t).color,
      hayDetails: !!document.querySelector('.jm-mas summary'),
      abierto: campos && getComputedStyle(campos).display !== 'none'
               && alergias.getBoundingClientRect().height > 0,
      fondo: cs.backgroundColor,
      textura: cs.backgroundImage.includes('svg') && cs.backgroundImage.includes('gradient'),
      tintaCampo: getComputedStyle(alergias).color
    };
  });
  ok(r.texto === 'Tu opinión nos importa', 'se llama así', JSON.stringify(r.texto));
  ok(!r.hayDetails, 'ya no hay que picarle');
  ok(r.abierto, 'los campos se ven de entrada');
  ok(r.fondo === 'rgb(232, 223, 209)', 'sobre lino, no sobre el vino', r.fondo);
  ok(r.textura, 'con la misma textura que los detalles');
  ok(r.color === 'rgb(99, 27, 41)', 'título en vino', r.color);
  ok(r.tintaCampo === 'rgb(74, 20, 32)', 'y lo de adentro repintado para fondo claro', r.tintaCampo);
}

/* ---------- 9. el mensaje para los novios ---------- */
console.log('\n── 9. «mensaje especial para los novios» ──');
{
  const r = await p.evaluate(() => {
    const sec = document.getElementById('recado');
    const lab = document.querySelector('#recado .jm-recado > span');
    return {
      visible: sec && !sec.hidden,
      etiqueta: lab && lab.textContent.trim(),
      titulo: document.querySelector('#recado h2').textContent.trim(),
      fueraDelForm: !document.querySelector('#jm-rsvp-form [name=mensaje]'),
      nota: document.querySelector('#recado .jm-recado small').textContent.trim()
    };
  });
  ok(r.visible, 'tiene su propia sección');
  ok(/Mensaje especial para los novios/i.test(r.titulo), 'con ese nombre', JSON.stringify(r.titulo));
  ok(r.fueraDelForm, 'fuera del formulario de confirmar');
  ok(r.nota === 'Sólo lo leen Jorge y Montse.', 'y sin repetirse', JSON.stringify(r.nota));
}

/* ---------- 10. el álbum compartido ---------- */
console.log('\n── 10. el álbum compartido y su QR ──');
{
  const r = await p.evaluate(() => {
    const sec = document.getElementById('album');
    const a = sec.querySelector('a[href*="icloud"]');
    const cs = getComputedStyle(sec);
    return {
      hay: !!sec, alto: Math.round(sec.getBoundingClientRect().height),
      fondo: cs.backgroundColor, tinta: cs.color,
      link: a && a.href, blank: a && a.target === 'blank' || a.target === '_blank',
      titulo: sec.querySelector('h2').textContent.trim(),
      dibujo: !!sec.querySelector('svg path'),
      /* La nav se pinta clara encima de las secciones oscuras: si esta se
         queda sin data-dark, el menú sale en vino sobre verde. */
      oscura: sec.dataset.dark === '1'
    };
  });
  // Tiene que decir EXACTAMENTE lo que dice el QR de las tarjetas. Si se
  // cambia el álbum y sólo se cambia un lado, la mesa manda a un sitio y
  // el sitio a otro. `pruebas/qr.py` revisa el mismo enlace del otro lado.
  const ALBUM = readFileSync(join(RAIZ, 'design/qr.py'), 'utf8')
    .match(/^ALBUM = '([^']+)'/m)[1];
  ok(r.hay && r.alto > 400, 'la sección existe y ocupa su lugar', r.alto + 'px');
  ok(r.link === ALBUM, 'el link es el mismo que lleva el QR de las mesas', r.link);
  ok(r.blank, 'se abre en otra pestaña');
  ok(r.fondo === 'rgb(47, 58, 40)', 'en verde, para que no se pierda', r.fondo);
  ok(r.oscura, 'marcada como oscura, para que la nav se invierta');
  ok(r.dibujo, 'con la cámara del itinerario');
  ok(/fotos/i.test(r.titulo), 'y su título', JSON.stringify(r.titulo));
}

/* ---- 11. el libro de recuerdos, en /libro ---- */
console.log('\n── 11. el libro de recuerdos ──');
{
  const l = await b.newPage({ viewport: { width: 1280, height: 900 } });
  l.on('pageerror', e => errores.push(e.message));
  l.on('console', m => m.type() === 'error' && errores.push(m.text()));
  await l.goto(base + '/libro', { waitUntil: 'networkidle' });

  const cerrado = await l.evaluate(() => ({
    puerta: !document.getElementById('gate').hidden,
    libro: !document.getElementById('app').hidden,
    recados: document.querySelectorAll('.recado').length
  }));
  ok(cerrado.puerta && !cerrado.libro && cerrado.recados === 0,
     'sin contraseña no se ve ni un recado', JSON.stringify(cerrado));

  await l.fill('#clave', 'prueba');
  await l.click('#gate-form button');
  await l.waitForSelector('#app:not([hidden])', { timeout: 8000 });
  await l.waitForTimeout(500);

  const r = await l.evaluate(() => {
    const recs = [...document.querySelectorAll('.recado')];
    const hojas = [...document.querySelector('.hojas').children];
    const num = document.getElementById('cuantos');
    const caja = num.getBoundingClientRect();
    const tit = document.querySelector('.portada h1').getBoundingClientRect();
    return {
      cuantos: recs.length,
      dice: num.textContent,
      firmados: recs.every(a => a.querySelector('.de').textContent.trim()),
      /* El número va en Blastine, que dibuja la tinta muy por encima y por
         debajo de su caja de renglón —cerca de tres veces y media el
         font-size—, así que el hueco no lo puede dar el `line-height`.
         Se pide que arriba del número quede al menos casi un font-size de
         aire: con los márgenes en em sobra, y sin ellos no alcanza. */
      hueco: Math.round(caja.top - tit.bottom),
      cuerpo: Math.round(parseFloat(getComputedStyle(num).fontSize)),
      ultimoEsRecado: hojas[hojas.length - 1].classList.contains('recado'),
      fotosEnteras: [...document.querySelectorAll('.foto img')]
        .every(i => getComputedStyle(i).objectFit !== 'cover')
    };
  });
  ok(r.cuantos > 0, 'los recados se leen de corrido', r.cuantos);
  ok(r.dice === String(r.cuantos), 'la portada dice cuántos son', r.dice);
  ok(r.firmados, 'cada uno con su firma');
  ok(r.hueco >= r.cuerpo * 0.9, 'el número de la portada tiene aire para su tinta',
     r.hueco + 'px sobre un cuerpo de ' + r.cuerpo + 'px');
  ok(r.ultimoEsRecado, 'el libro cierra con un recado, no con una foto');
  ok(r.fotosEnteras, 'las fotos van enteras, sin recortar cabezas');
  await l.close();
}

await p.close();
await b.close();
console.log('\n' + (errores.length ? '❌ errores de consola: ' + [...new Set(errores)].join(' | ')
                                   : '✅ consola limpia'));
console.log(malo ? `\n${malo} mal` : '\nTODO BIEN');
process.exit(malo ? 1 : 0);
