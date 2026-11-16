/**
 * Las invitaciones que Jorge y Montse agregan desde el panel.
 *
 * Las de siempre viven en invitados-datos.mts, que es código: cambiarlas
 * pide un commit y un deploy. Éstas viven en blobs y existen en cuanto el
 * panel las guarda, sin pasar por nadie. Para el resto del sitio son
 * iguales: tienen su link, su tarjeta de vista previa y su confirmación.
 *
 * Su tarjeta (la imagen de WhatsApp) la dibuja el navegador del panel al
 * crearlas, con los mismos fondos y la misma letra que las demás, y se
 * guarda aquí también. La sirve /api/og cuando no hay archivo estático.
 *
 * Todo lo que necesite saber si un id existe pasa por `buscarInvitacion`,
 * no por POR_ID directo: si no, el link de una invitación nueva abre pero
 * su confirmación o su recado se rechazan.
 */
import { getStore } from '@netlify/blobs';
import { INVITACIONES, POR_ID, type Invitacion } from './invitados-datos.mts';

export type Extra = Invitacion & { extra: true; creada: string; por?: string };

const PREFIJO = 'extra/';

export function storeExtras() {
  return getStore({ name: 'invitaciones', consistency: 'strong' });
}

export function storeTarjetas() {
  return getStore({ name: 'tarjetas', consistency: 'strong' });
}

/** Una invitación por id: primero las del código, luego las del panel. */
export async function buscarInvitacion(id: string): Promise<Invitacion | null> {
  const fija = POR_ID.get(id);
  if (fija) return fija;
  try {
    const e = await storeExtras().get(PREFIJO + id, { type: 'json' });
    return (e as Extra) || null;
  } catch {
    return null;
  }
}

export async function listarExtras(): Promise<Extra[]> {
  const store = storeExtras();
  const { blobs } = await store.list({ prefix: PREFIJO });
  const todas = await Promise.all(
    blobs.map(b => store.get(b.key, { type: 'json' }).catch(() => null))
  );
  return (todas.filter(Boolean) as Extra[])
    .sort((a, b) => String(a.creada).localeCompare(String(b.creada)));
}

/** Las del código y las del panel, en ese orden. */
export async function todasLasInvitaciones(): Promise<Invitacion[]> {
  let extras: Extra[] = [];
  try { extras = await listarExtras(); } catch { /* sin blobs, sólo las del código */ }
  return [...INVITACIONES, ...extras];
}

/** «María José Pérez Gómez» → «maria-gomez». Nombre + último apellido,
 *  como las de invitados-datos.mts. */
export function idDe(nombre: string): string {
  const partes = nombre
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/).filter(Boolean);
  if (!partes.length) return '';
  const id = partes.length > 1 ? `${partes[0]}-${partes[partes.length - 1]}` : partes[0];
  return id.slice(0, 50);
}

/** Un id que no choque con ninguna invitación, del código o del panel. */
export async function idLibre(base: string): Promise<string> {
  let id = base, n = 2;
  while (await buscarInvitacion(id)) id = `${base}-${n++}`;
  return id;
}

export function guardarExtra(inv: Extra) {
  return storeExtras().setJSON(PREFIJO + inv.id, inv);
}

export function borrarExtra(id: string) {
  return storeExtras().delete(PREFIJO + id);
}
