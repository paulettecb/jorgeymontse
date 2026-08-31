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
  'invitacion'   // el id del link personalizado, vacío si confirmaron sin él
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

  const store = getStore({ name: 'rsvp', consistency: 'strong' });
  await store.setJSON(`envio/${registro.id}`, registro);

  return new Response('ok', { status: 200 });
};
