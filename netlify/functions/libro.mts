/**
 * El libro de recuerdos: /api/libro
 *
 * Devuelve los recados que la gente le dejó a los novios, para pintarlos en
 * el sitio después de la boda. Es lo ÚNICO público de todo lo que guarda el
 * sitio, así que la regla aquí es al revés que en el panel: en vez de quitar
 * lo delicado, se arma la respuesta desde cero y sólo se copia lo que sí va.
 *
 * Un recado sale publicado sólo si se cumplen las TRES:
 *
 *   1. el libro está prendido            (ajustes  → libroPublico)
 *   2. el invitado dio permiso           (recados  → privado !== true)
 *   3. los novios lo escogieron          (ajustes  → libro[invitación])
 *
 * Los mensajes viejos, los que llegaron dentro de una confirmación cuando el
 * formulario prometía «Sólo lo leen Jorge y Montse», NO están aquí y no se
 * pueden publicar: viven en el store `rsvp` y esta función ni lo abre. Si
 * alguien de ésos quiere salir en el libro, vuelve a entrar a su link y
 * escribe su recado, que ahora sí dice a dónde va.
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
  let ajustes, recados;
  try {
    ajustes = getStore({ name: 'ajustes', consistency: 'strong' });
    recados = getStore({ name: 'recados', consistency: 'strong' });
  } catch {
    // Sin blobs no hay libro. Mejor una sección que no aparece que un error.
    return vacio('no-store');
  }

  /* 1. ¿Está prendido? Si no, ni se leen los recados: así el endpoint no
        sirve para asomarse antes de tiempo. */
  const prendido = await ajustes.get('libroPublico', { type: 'json' }).catch(() => null);
  if (prendido !== true) return vacio();

  const aprobados = ((await ajustes.get('libro', { type: 'json' }).catch(() => null)) ||
    {}) as Record<string, boolean>;
  const ids = Object.keys(aprobados).filter(k => aprobados[k] === true);
  if (!ids.length) return json({ publico: true, mensajes: [] as Recuerdo[] }, 200, 'public, max-age=120');

  /* Se leen por llave, sólo los escogidos. */
  const crudos = await Promise.all(
    ids.slice(0, 500).map(id =>
      recados.get(`porInvitacion/${id}`, { type: 'json' }).catch(() => null)
    )
  );

  const mensajes: Recuerdo[] = [];
  for (const r of crudos as any[]) {
    if (!r) continue;
    if (r.privado === true) continue;
    const texto = String(r.texto || '').trim();
    if (!texto) continue;

    /* Cómo se firma: el saludo de la invitación («Fer y Óscar»), que está
       escrito para leerse bonito y es el que usa todo el sitio. */
    const inv = POR_ID.get(String(r.invitacion || ''));
    const de = String(inv?.saludo || '').trim();
    if (!de) continue;

    mensajes.push({
      id: String(r.invitacion),
      de: de.slice(0, 80),
      texto: texto.slice(0, 1200),
      cuando: String(r.creado || r.actualizado || '')
    });
  }

  // Del más viejo al más nuevo: un libro se lee en el orden en que se firmó.
  mensajes.sort((a, b) => a.cuando.localeCompare(b.cuando));

  return json({ publico: true, mensajes }, 200, 'public, max-age=120');
};

export const config: Config = { path: '/api/libro' };
