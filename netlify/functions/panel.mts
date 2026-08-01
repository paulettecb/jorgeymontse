/**
 * API del panel de invitados. Todo va por POST y todo pide contraseña:
 * la página /panel es pública pero no trae ni un dato — los nombres,
 * teléfonos y alergias sólo salen de aquí, y sólo con la contraseña.
 *
 * Contraseña en la variable de entorno PANEL_PASSWORD del proyecto.
 */
import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';
import type { Context, Config } from '@netlify/functions';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });

/** Comparación de tiempo constante, para no filtrar la contraseña por lo que tarda. */
function claveValida(recibida: unknown): boolean {
  const esperada = Netlify.env.get('PANEL_PASSWORD') || '';
  if (!esperada || typeof recibida !== 'string') return false;
  const a = Buffer.from(recibida);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) {
    timingSafeEqual(b, b);   // gasta el mismo tiempo aunque no coincida el largo
    return false;
  }
  return timingSafeEqual(a, b);
}

const MESAS_POR_DEFECTO = {
  mesas: [] as { id: string; nombre: string; capacidad: number }[],
  asignaciones: {} as Record<string, string>
};

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') return json({ error: 'método no permitido' }, 405);

  let cuerpo: any;
  try {
    cuerpo = await req.json();
  } catch {
    return json({ error: 'cuerpo inválido' }, 400);
  }

  if (!Netlify.env.get('PANEL_PASSWORD')) {
    return json({ error: 'Falta configurar PANEL_PASSWORD en el proyecto de Netlify.' }, 503);
  }
  if (!claveValida(cuerpo?.clave)) {
    await new Promise(r => setTimeout(r, 600));      // frena la fuerza bruta
    return json({ error: 'Contraseña incorrecta.' }, 401);
  }

  const rsvps = getStore({ name: 'rsvp', consistency: 'strong' });
  const mesas = getStore({ name: 'mesas', consistency: 'strong' });

  switch (cuerpo.accion) {
    case 'listar': {
      const { blobs } = await rsvps.list({ prefix: 'envio/' });
      const lista = await Promise.all(
        blobs.map(b => rsvps.get(b.key, { type: 'json' }).catch(() => null))
      );
      const limpia = lista.filter(Boolean).sort(
        (a: any, b: any) => String(b.creado).localeCompare(String(a.creado))
      );
      const plano = (await mesas.get('config', { type: 'json' })) || MESAS_POR_DEFECTO;
      return json({ rsvps: limpia, mesas: plano });
    }

    case 'guardarMesas': {
      const p = cuerpo.mesas;
      if (!p || !Array.isArray(p.mesas) || typeof p.asignaciones !== 'object') {
        return json({ error: 'formato de mesas inválido' }, 400);
      }
      const limpio = {
        mesas: p.mesas.slice(0, 100).map((m: any, i: number) => ({
          id: String(m.id ?? `m${i}`).slice(0, 40),
          nombre: String(m.nombre ?? `Mesa ${i + 1}`).slice(0, 60),
          capacidad: Math.max(1, Math.min(30, parseInt(m.capacidad, 10) || 10))
        })),
        asignaciones: Object.fromEntries(
          Object.entries(p.asignaciones).slice(0, 2000).map(([k, v]) => [String(k), String(v)])
        )
      };
      await mesas.setJSON('config', limpio);
      return json({ ok: true });
    }

    case 'borrar': {
      const id = String(cuerpo.id || '');
      if (!id) return json({ error: 'falta id' }, 400);
      await rsvps.delete(`envio/${id}`);
      return json({ ok: true });
    }

    default:
      return json({ error: 'acción desconocida' }, 400);
  }
};

export const config: Config = { path: '/api/panel' };
