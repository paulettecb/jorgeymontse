/**
 * Resuelve un link personalizado: /api/invitacion?i=jorge-cambron
 *
 * Devuelve UNA invitación y nada más. La lista completa nunca sale de
 * aquí: son nombres de gente real y no tiene por qué poder descargarse
 * entera desde el navegador.
 *
 * Si el id no existe contesta 404 y el sitio vuelve a pedir el nombre a
 * mano, que es como funcionaba antes. Así un link mal copiado —o
 * compartido sin el `?i=`— no deja a nadie sin poder confirmar.
 */
import { POR_ID } from './invitados-datos.mts';
import { getStore } from '@netlify/blobs';
import type { Context, Config } from '@netlify/functions';

const json = (data: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': cache }
  });

export default async (req: Request, _context: Context) => {
  const id = (new URL(req.url).searchParams.get('i') || '').trim().toLowerCase();

  // Sin id no hay nada que resolver; se contesta igual que un id inexistente
  // para no dar pistas de qué ids son válidos por el tipo de respuesta.
  if (!id || id.length > 60 || !/^[a-z0-9-]+$/.test(id)) return json({ error: 'no encontrada' }, 404);

  const inv = POR_ID.get(id);
  if (!inv) return json({ error: 'no encontrada' }, 404);

  /* Quién va a la ceremonia civil: el valor de fábrica está en
     invitados-datos.mts, pero el panel lo puede pisar por invitación y eso
     vive en blobs. Gana lo del panel. */
  let civil = inv.civil === true;
  try {
    const mapa: any = await getStore({ name: 'ajustes', consistency: 'strong' })
      .get('civil', { type: 'json' });
    if (mapa && typeof mapa[inv.id] === 'boolean') civil = mapa[inv.id];
  } catch {
    // sin blobs, se queda con lo del código
  }

  /* Si esta invitación ya contestó, se dice: así el sitio no le vuelve a
     preguntar a quien vuelve a abrir su link. Sale del índice que escribe
     submission-created, o sea que funciona también desde otro teléfono; no
     es memoria del navegador. Va sólo el resumen, no el mensaje ni las
     alergias: el link puede haberse reenviado y eso es de los novios. */
  let respuesta: { asiste: boolean; personas: number; cuando: string } | null = null;
  try {
    const r: any = await getStore({ name: 'rsvp', consistency: 'strong' })
      .get(`porInvitacion/${inv.id}`, { type: 'json' });
    if (r) {
      respuesta = {
        asiste: r.asiste === true,
        personas: Number(r.personas) || 0,
        cuando: String(r.creado || '')
      };
    }
  } catch {
    // Si los blobs no contestan, se sigue sin el dato: peor es no poder
    // abrir la invitación.
  }

  /* Sin caché: antes eran 5 minutos, pero ahora la respuesta trae si ya
     confirmaste, y ver «todavía no contestas» justo después de confirmar
     es peor que pedir el dato cada vez. */
  return json(
    { id: inv.id, saludo: inv.saludo, pases: inv.pases, invitados: inv.invitados,
      civil: civil, respuesta },
    200,
    'private, no-store'
  );
};

export const config: Config = { path: '/api/invitacion' };
