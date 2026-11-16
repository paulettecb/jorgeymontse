/**
 * La tarjeta de vista previa de una invitación agregada desde el panel.
 *
 * Las de invitados-datos.mts tienen su archivo en assets/og/ y Netlify lo
 * sirve directo. Cuando no hay archivo, netlify.toml manda la petición aquí
 * y se busca la que el panel guardó en blobs. Si tampoco está, se entrega la
 * tarjeta general del sitio: un link sin imagen se ve roto en WhatsApp.
 */
import { storeTarjetas } from './invitaciones-extra.mts';
import type { Context, Config } from '@netlify/functions';

export default async (req: Request, context: Context) => {
  const archivo = String(context.params?.archivo || '');
  const id = archivo.replace(/\.jpg$/i, '').toLowerCase();

  if (/^[a-z0-9-]{1,60}$/.test(id)) {
    try {
      const img = await storeTarjetas().get(id, { type: 'arrayBuffer' });
      if (img) {
        return new Response(img, {
          headers: {
            'content-type': 'image/jpeg',
            // Si la cambian (borrar y volver a crear), que se note pronto.
            'cache-control': 'public, max-age=300'
          }
        });
      }
    } catch {
      // sin blobs, la general
    }
  }
  return Response.redirect(new URL('/assets/og-preview.jpg', req.url).toString(), 302);
};

export const config: Config = { path: '/api/og/:archivo' };
