/**
 * El libro de recuerdos: /api/libro
 *
 * Devuelve los mensajes que la gente dejó al confirmar, para pintarlos en
 * el sitio después de la boda. Es lo ÚNICO público de todo lo que guarda
 * el RSVP, así que la regla aquí es al revés que en el panel: en vez de
 * quitar lo delicado, se arma la respuesta desde cero y sólo se copia lo
 * que sí va. Ni teléfonos, ni alergias, ni quién viene, ni si asiste.
 *
 * Un mensaje sale publicado sólo si se cumplen las TRES:
 *
 *   1. el libro está prendido            (ajustes → libroPublico)
 *   2. el invitado dio permiso           (rsvp    → privado === false)
 *   3. los novios lo escogieron          (ajustes → libro[id] === true)
 *
 * La 2 se compara contra `false` a propósito, no con un `!privado`. Los
 * envíos que llegaron antes de que existiera la casilla no traen el campo,
 * y a esa gente el formulario le prometía «Sólo lo leen Jorge y Montse»:
 * quedan indefinidos y así se quedan fuera. Un `!privado` los publicaría a
 * todos y rompería esa promesa.
 */
import { POR_ID } from './invitados-datos.mts';
import { getStore } from '@netlify/blobs';
import type { Context, Config } from '@netlify/functions';

/** Lo que sí sale de aquí. Cualquier cosa que no esté en este tipo, no se publica. */
type Recuerdo = { id: string; de: string; texto: string; cuando: string };

const json = (data: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': cache }
  });

const vacio = (cache = 'public, max-age=120') =>
  json({ publico: false, mensajes: [] as Recuerdo[] }, 200, cache);

export default async (_req: Request, _context: Context) => {
  let ajustes, rsvps;
  try {
    ajustes = getStore({ name: 'ajustes', consistency: 'strong' });
    rsvps = getStore({ name: 'rsvp', consistency: 'strong' });
  } catch {
    // Sin blobs no hay libro. Mejor una sección que no aparece que un error.
    return vacio('no-store');
  }

  /* 1. ¿Está prendido? Si no, ni se leen los mensajes: así el endpoint no
        sirve para asomarse antes de tiempo. */
  const prendido = await ajustes.get('libroPublico', { type: 'json' }).catch(() => null);
  if (prendido !== true) return vacio();

  const aprobados = ((await ajustes.get('libro', { type: 'json' }).catch(() => null)) ||
    {}) as Record<string, boolean>;
  const ids = Object.keys(aprobados).filter(k => aprobados[k] === true);
  if (!ids.length) return json({ publico: true, mensajes: [] as Recuerdo[] }, 200, 'public, max-age=120');

  /* Se leen por llave, sólo los escogidos: listar todos los envíos para
     luego tirar la mayoría sería traer teléfonos y alergias a una función
     pública sin necesidad. */
  const crudos = await Promise.all(
    ids.slice(0, 500).map(id =>
      rsvps.get(`envio/${id}`, { type: 'json' }).catch(() => null)
    )
  );

  const mensajes: Recuerdo[] = [];
  for (const r of crudos as any[]) {
    if (!r) continue;
    if (r.privado !== false) continue;              // ver el comentario de arriba
    const texto = String(r.mensaje || '').trim();
    if (!texto) continue;

    /* Cómo se firma. El saludo de la invitación («Fer y Óscar») está
       escrito para leerse bonito y es el que usa todo el sitio; el nombre
       tecleado es el respaldo para quien confirmó sin su link. */
    const inv = r.invitacion ? POR_ID.get(String(r.invitacion)) : undefined;
    const de = String(inv?.saludo || r.nombre || '').trim();
    if (!de) continue;

    mensajes.push({
      id: String(r.id),
      de: de.slice(0, 80),
      texto: texto.slice(0, 1200),
      cuando: String(r.creado || '')
    });
  }

  // Del más viejo al más nuevo: un libro se lee en el orden en que se firmó.
  mensajes.sort((a, b) => a.cuando.localeCompare(b.cuando));

  return json({ publico: true, mensajes }, 200, 'public, max-age=120');
};

export const config: Config = { path: '/api/libro' };
