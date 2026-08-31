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

  // Cache corto en el navegador: la lista casi no cambia, pero si los
  // novios corrigen un nombre no queremos que tarde horas en verse.
  return json(
    { id: inv.id, saludo: inv.saludo, pases: inv.pases, invitados: inv.invitados, civil: inv.civil === true },
    200,
    'private, max-age=300'
  );
};

export const config: Config = { path: '/api/invitacion' };
