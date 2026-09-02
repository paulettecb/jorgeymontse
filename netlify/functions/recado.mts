/**
 * El recado que cada invitación le deja a los novios: POST /api/recado
 *
 * Vive aparte de la confirmación a propósito. Antes el mensaje era un campo
 * más del formulario, y eso traía dos problemas:
 *
 *   1. Sólo se podía escribir al confirmar. Quien ya había confirmado no
 *      volvía a ver el campo nunca.
 *   2. Volver a mandarlo creaba OTRA confirmación. Escribir un mensaje
 *      significaba dejar dos respuestas de la misma persona, y el panel
 *      tenía que adivinar cuál valía.
 *
 * Aquí hay un recado por invitación y se pisa: se puede escribir sin haber
 * confirmado, se puede volver a entrar y editarlo, y no ensucia la lista de
 * confirmaciones. Guardar dos veces deja un recado, no dos.
 *
 * Quién puede escribir: cualquiera que tenga el link de esa invitación, que
 * es el mismo nivel de confianza que ya tenía confirmar. El link es el
 * secreto; aquí no hay uno más fuerte que inventar.
 *
 * Estos recados NO se publican en ningún lado. Son para Jorge y Montse, que
 * los leen todos juntos al final, de sorpresa. El panel es el único sitio
 * donde salen, y va detrás de contraseña. Por eso el campo del sitio puede
 * prometer «Sólo lo leen Jorge y Montse» sin letra chiquita, y por eso aquí
 * no hay ni casilla de privacidad ni aprobación que administrar.
 */
import { POR_ID } from './invitados-datos.mts';
import { getStore } from '@netlify/blobs';
import type { Context, Config } from '@netlify/functions';

const LARGO_MAX = 1200;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' }
  });

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') return json({ error: 'método no permitido' }, 405);

  let cuerpo: any;
  try {
    cuerpo = await req.json();
  } catch {
    return json({ error: 'cuerpo inválido' }, 400);
  }

  const id = String(cuerpo?.invitacion || '').trim().toLowerCase();
  if (!/^[a-z0-9-]{1,60}$/.test(id) || !POR_ID.has(id)) {
    return json({ error: 'no encontrada' }, 404);
  }

  const texto = String(cuerpo?.texto ?? '').trim().slice(0, LARGO_MAX);

  let store;
  try {
    store = getStore({ name: 'recados', consistency: 'strong' });
  } catch {
    return json({ error: 'no se pudo guardar' }, 503);
  }

  const llave = `porInvitacion/${id}`;
  const antes: any = await store.get(llave, { type: 'json' }).catch(() => null);

  /* Borrar el texto borra el recado. Es la forma de arrepentirse sin tener
     que pedírselo a nadie, y deja la llave limpia en vez de un recado vacío
     que el libro tendría que filtrar. */
  if (!texto) {
    if (antes) await store.delete(llave);
    return json({ ok: true, recado: null });
  }

  const ahora = new Date().toISOString();
  const recado = {
    invitacion: id,
    texto,
    creado: antes?.creado || ahora,
    actualizado: ahora
  };
  await store.setJSON(llave, recado);

  return json({ ok: true, recado });
};

export const config: Config = { path: '/api/recado' };
