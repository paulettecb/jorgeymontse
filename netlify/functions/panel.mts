/**
 * API del panel de invitados. Todo va por POST y todo pide contraseña:
 * la página /panel es pública pero no trae ni un dato — los nombres,
 * teléfonos y alergias sólo salen de aquí, y sólo con la contraseña.
 *
 * Contraseña en la variable de entorno PANEL_PASSWORD del proyecto.
 */
import { getStore } from '@netlify/blobs';
import { INVITACIONES } from './invitados-datos.mts';
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

/** Quién mandó cada invitación y cuándo. Una sola llave con todo: son 107
 *  entradas, no vale la pena un blob por invitación. */
type Envio = { por: string; cuando: string };

/* El mensaje que se manda por WhatsApp. Se guarda para que Jorge y Montse
   lo escriban con sus palabras desde el panel; esto es sólo el arranque.
   {nombre} y {link} se sustituyen al momento de mandar. */
const PLANTILLA_POR_DEFECTO =
  '¡Nos casamos! 🤍\n\n' +
  '{nombre}, esta es tu invitación:\n{link}\n\n' +
  'Ahí viene todo: la iglesia, el salón, el itinerario y dónde confirmarnos. ' +
  'El link es tuyo y ya trae apartados tus lugares.';

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
  const envios = getStore({ name: 'envios', consistency: 'strong' });
  /* Quién va a la ceremonia civil. El valor de fábrica vive en
     invitados-datos.mts; esto lo pisa por invitación para que se pueda
     cambiar desde el panel sin tocar código ni volver a publicar. */
  const ajustes = getStore({ name: 'ajustes', consistency: 'strong' });

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
      const mandadas = (await envios.get('registro', { type: 'json' })) || {};
      const plantilla = (await envios.get('plantilla', { type: 'text' })) || PLANTILLA_POR_DEFECTO;
      const civil = (await ajustes.get('civil', { type: 'json' })) || {};
      // La lista completa va también: el panel necesita ver a los que NO han
      // contestado para poder sentarlos, y para poder reenviar su link.
      return json({
        rsvps: limpia, mesas: plano, invitaciones: INVITACIONES,
        envios: mandadas, plantilla, civil
      });
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

    /* Marcar (o desmarcar) una invitación como mandada. Se guarda quién la
       mandó para que Jorge y Montse no se dupliquen: el panel es uno solo y
       no hay usuarios, así que el nombre viene de quien lo eligió en la
       pantalla. Es para coordinarse, no un control de acceso. */
    case 'marcarEnvio': {
      const id = String(cuerpo.id || '').slice(0, 60);
      if (!/^[a-z0-9-]{1,60}$/.test(id)) return json({ error: 'id inválido' }, 400);

      const registro = ((await envios.get('registro', { type: 'json' })) || {}) as Record<string, Envio>;
      if (cuerpo.deshacer) {
        delete registro[id];
      } else {
        registro[id] = {
          por: String(cuerpo.por || 'alguien').slice(0, 40),
          cuando: new Date().toISOString()
        };
      }
      await envios.setJSON('registro', registro);
      return json({ ok: true, envios: registro });
    }

    /* Marcar si una invitación va a la ceremonia civil. Se guarda aparte de
       invitados-datos.mts, que es código: así Jorge y Montse lo cambian desde
       el panel y se ve en el itinerario de esa persona en cuanto recargue. */
    case 'marcarCivil': {
      const id = String(cuerpo.id || '');
      if (!/^[a-z0-9-]{1,60}$/.test(id)) return json({ error: 'id inválido' }, 400);
      const mapa = ((await ajustes.get('civil', { type: 'json' })) || {}) as Record<string, boolean>;
      if (cuerpo.civil === null) delete mapa[id];        // volver al valor del código
      else mapa[id] = cuerpo.civil === true;
      await ajustes.setJSON('civil', mapa);
      return json({ ok: true, civil: mapa });
    }

    case 'guardarPlantilla': {
      const t = String(cuerpo.plantilla ?? '');
      if (!t.trim()) return json({ error: 'la plantilla no puede ir vacía' }, 400);
      await envios.set('plantilla', t.slice(0, 2000));
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
