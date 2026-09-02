/**
 * Convierte la hoja de tarjetas a PDF, que es lo que se manda a imprimir.
 *
 *     node design/imprimir.mjs
 *
 * Escribe `impresos/mesas-album.pdf` a partir de
 * `impresos/mesas-album.html` (que lo genera `design/mesas.py`), y de paso
 * `impresos/mesas-album.png` a 300 puntos por pulgada para poder revisarla
 * y para que `pruebas/qr-escaneo.py` la escanee de verdad.
 *
 * Usa el Chromium de Playwright porque ya está en el proyecto para las
 * pruebas y porque imprime el mismo motor que va a usar quien abra el HTML
 * en su compu: lo que sale del PDF es lo que se ve en pantalla.
 *
 * El PDF sale con `printBackground` y sin escalar. Ojo: `preferCSSPageSize`
 * hace que mande la regla `@page{size:letter;margin:0}` del HTML, no el
 * tamaño que pida esta función. Si se quita, Chromium le mete márgenes y
 * las tarjetas dejan de medir exactamente un cuarto de hoja.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entrada = path.join(raiz, 'impresos', 'mesas-album.html');

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ deviceScaleFactor: 300 / 96 });
await pagina.goto(pathToFileURL(entrada).href, { waitUntil: 'load' });
await pagina.evaluate(() => document.fonts.ready);

await pagina.pdf({
  path: path.join(raiz, 'impresos', 'mesas-album.pdf'),
  preferCSSPageSize: true,
  printBackground: true,
  scale: 1
});

// A 300 dpi la hoja carta son 2550x3300: el tamaño al que la escanearía
// una impresora. Sirve para ver el resultado y para probar el QR.
await pagina.locator('.hoja').screenshot({
  path: path.join(raiz, 'impresos', 'mesas-album.png')
});

await navegador.close();
console.log('impresos/mesas-album.pdf y .png listos');
