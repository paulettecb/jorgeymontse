/**
 * Se dispara sola cada vez que Netlify Forms recibe una confirmación.
 * Copia el RSVP a Netlify Blobs, que es de donde lee el panel.
 *
 * Netlify Forms ya guarda el envío y manda el correo a los novios; esto
 * existe para que el panel no necesite un token de la API de Netlify.
 */
import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

const CAMPOS = [
  'nombre', 'asiste', 'personas', 'acompanantes',
  'alergias', 'telefono', 'cancion', 'mensaje',
  'invitacion',  // el id del link personalizado, vacío si confirmaron sin él
  'privado'      // palomeada = «este mensaje no va al libro de recuerdos»
] as const;

export default async (req: Request, _context: Context) => {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response('cuerpo inválido', { status: 400 });
  }

  const envio = body?.payload ?? {};
  const datos = envio.data ?? {};
  if (envio.form_name && envio.form_name !== 'rsvp') {
    return new Response('ignorado', { status: 200 });
  }

  const registro: Record<string, unknown> = {
    id: envio.id || crypto.randomUUID(),
    creado: envio.created_at || new Date().toISOString()
  };
  for (const c of CAMPOS) registro[c] = typeof datos[c] === 'string' ? datos[c].trim() : '';

  // personas siempre como número, para poder sumar en el panel
  const n = parseInt(String(registro.personas), 10);
  registro.personas = Number.isFinite(n) && n > 0 ? Math.min(n, 20) : 1;
  registro.asiste = String(registro.asiste).toLowerCase().startsWith('s');

  /* El permiso para el libro de recuerdos, guardado como sí/no y no como
     el texto que mandó el navegador. Una casilla sin palomear no viaja en
     el POST, así que aquí llega vacía: eso es «sí puede ir al libro».

     Ojo con los envíos viejos: los que llegaron antes de que existiera
     esta casilla no traen el campo, y en esos `privado` se queda sin
     definir, ni true ni false. Es a propósito. A esa gente el formulario
     le prometía «Sólo lo leen Jorge y Montse», así que quien lee para el
     libro sólo publica los que traen `privado === false` —permiso dado a
     mano— y deja fuera los indefinidos. No cambiar esto por un
     `|| false`: convertiría una promesa vieja en un permiso. */
  registro.privado = String(registro.privado || '').trim() !== '';

  const store = getStore({ name: 'rsvp', consistency: 'strong' });
  await store.setJSON(`envio/${registro.id}`, registro);

  /* Además del envío, un índice por invitación. Sirve para que el sitio
     pueda decirle a alguien «ya confirmaste» cuando vuelve a abrir su link,
     sin tener que listar y recorrer todos los envíos en cada visita. Si
     contestan otra vez, esta llave se pisa y queda la última respuesta,
     que es la que vale. */
  const idInv = String(registro.invitacion || '');
  if (/^[a-z0-9-]{1,60}$/.test(idInv)) {
    await store.setJSON(`porInvitacion/${idInv}`, registro);
  }

  return new Response('ok', { status: 200 });
};
