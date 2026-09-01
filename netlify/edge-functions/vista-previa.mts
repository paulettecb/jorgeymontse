/**
 * La tarjeta que sale al compartir un link, personalizada por invitación.
 *
 * Las etiquetas og: las leen robots que no ejecutan JavaScript: piden el
 * HTML y se van. Por eso la personalización no puede vivir en site.js —
 * tiene que estar escrita en el HTML antes de que salga del servidor, y
 * eso es lo que hace esta función: intercepta /paloma-cambron, deja que
 * Netlify arme la página como siempre, y en el camino de vuelta cambia
 * las etiquetas por las de esa invitación.
 *
 * A quien abre la página no le cambia nada: el HTML que ve es el mismo
 * más unas etiquetas del <head>, que nunca se pintan.
 */
import { POR_ID } from '../functions/invitados-datos.mts';
import type { Config, Context } from '@netlify/edge-functions';

/** Para meter texto dentro de un atributo HTML sin romperlo. */
function esc(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;')
          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Cambia el content de una etiqueta, sin tocar el resto del HTML. */
function pon(html: string, clave: string, valor: string): string {
  const re = new RegExp(
    `(<meta\\s+(?:property|name)="${clave.replace(/[:]/g, '\\:')}"\\s+content=")[^"]*(")`, 'i');
  return html.replace(re, `$1${valor}$2`);
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const id = url.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!/^[a-z0-9-]{1,60}$/.test(id)) return;

  const inv = POR_ID.get(id);
  if (!inv) return;                      // no es una invitación: camino normal

  const res = await context.next();
  const tipo = res.headers.get('content-type') || '';
  if (!tipo.includes('text/html')) return res;

  const saludo = esc(inv.saludo);
  const uno = (inv.pases ?? 1) <= 1;
  const titulo = `${saludo}, ¿nos acompañ${uno ? 'as' : 'an'}?`;
  const desc = 'Jorge y Montse se casan el 30 de enero de 2027 en Morelia. '
             + 'Aquí está todo lo que necesitas saber, y tu confirmación.';
  const img = `${url.origin}/assets/og/${id}.jpg`;

  let html = await res.text();
  html = pon(html, 'og:title', titulo);
  html = pon(html, 'twitter:title', titulo);
  html = pon(html, 'og:description', desc);
  html = pon(html, 'twitter:description', desc);
  html = pon(html, 'og:image', img);
  html = pon(html, 'og:image:secure_url', img);
  html = pon(html, 'twitter:image', img);
  html = pon(html, 'og:image:alt', `${saludo}: la invitación a la boda de Jorge y Montse`);
  html = pon(html, 'og:url', `${url.origin}/${id}`);

  const headers = new Headers(res.headers);
  headers.delete('content-length');       // el HTML cambió de tamaño
  /* Privado: la tarjeta lleva el nombre de quien recibió el link, así que
     no debe quedarse en ninguna caché compartida. */
  headers.set('cache-control', 'private, max-age=0, must-revalidate');
  return new Response(html, { status: res.status, headers });
};

export const config: Config = {
  path: '/:invitacion',
  excludedPath: ['/assets/*', '/api/*', '/netlify/*', '/panel*', '/*.*']
};
