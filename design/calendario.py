#!/usr/bin/env python3
"""Arma los dos archivos de calendario del sitio.

    python3 design/calendario.py assets

Escribe `assets/boda.ics` y `assets/boda-civil.ics`. Son dos porque a la
ceremonia civil sólo va parte de los invitados: el sitio enlaza uno u otro
según lo que traiga la invitación (ver `setupCalendario` en site.js).

Existe porque los horarios ya se movieron dos veces y editar a mano dos
archivos con el plegado de RFC 5545 es justo donde se cuelan los errores.
Aquí los horarios se escriben una vez, en hora de Morelia, y el archivo
sale solo.

Tres cosas del formato que se hacen mal muy fácil:

  * Los renglones terminan en CRLF, no en LF.
  * El límite de 75 es de OCTETOS, no de caracteres: «Michoacán» ocupa 10
    bytes en UTF-8, no 9. Por eso el plegado cuenta bytes.
  * Las horas van en UTC. Morelia no cambia de horario desde 2022, así que
    es UTC-6 todo el año y basta con sumar seis.
"""
import sys
from pathlib import Path

TEMPLO = ('Templo del Carmen, Calle Eduardo Ruiz 350, '
          'Centro Histórico, Morelia, Michoacán')
JARDIN = ('Jardín Los Magueyes, Av. Plan de Ayala 1300, '
          'Jesús del Monte, Morelia, Michoacán')

PIE = 'Boda de Jorge y Montse\nhttps://jorgeymontse.com'
AVISO_IGLESIA = ('Nos casamos. Te pedimos llegar con tiempo: la iglesia no '
                 'tiene estacionamiento y es zona centro.\n\n' + PIE)

# (hora de inicio, hora de fin, título, sede, descripción). Todo en hora de
# Morelia; las que pasan de medianoche llevan el día siguiente.
BASE = [
    ((30, 16, 0), (30, 17, 30), 'Ceremonia religiosa',   TEMPLO, AVISO_IGLESIA),
    ((30, 19, 0), (30, 19, 30), 'Cóctel de bienvenida',  JARDIN, PIE),
    ((30, 19, 30), (30, 20, 0), 'Fotos con los novios',  JARDIN, PIE),
    ((30, 20, 0), (30, 20, 30), 'Entrada de los novios', JARDIN, PIE),
    ((30, 20, 30), (30, 21, 30), 'Cena',                 JARDIN, PIE),
    ((30, 21, 30), (31, 2, 0),  'Fiesta',                JARDIN, PIE),
]

# La civil va antes del cóctel, entre la iglesia y la llegada al jardín.
CIVIL = ((30, 18, 20), (30, 19, 0), 'Ceremonia civil', JARDIN, PIE)


def utc(dia, hora, minuto):
    """Hora de Morelia (UTC-6) a la marca UTC que pide el formato. Todo
       pasa el 30 o el 31 de enero de 2027, así que el mes no se mueve."""
    hora += 6
    if hora >= 24:
        hora -= 24
        dia += 1
    assert dia in (30, 31), f'día fuera de la boda: {dia}'
    return f'202701{dia:02d}T{hora:02d}{minuto:02d}00Z'


def esc(texto):
    """Escapado de valores de RFC 5545. El orden importa: primero las
       contrabarras, si no se escaparían las que acaban de ponerse."""
    return (texto.replace('\\', '\\\\')
                 .replace('\n', '\\n')
                 .replace(',', '\\,')
                 .replace(';', '\\;'))


def dobla(linea):
    """Plegado de RFC 5545: 75 octetos por renglón, los siguientes con un
       espacio delante. Se cuenta en bytes y se corta en el límite de
       carácter para no partir un acento a la mitad."""
    b = linea.encode('utf-8')
    if len(b) <= 75:
        return [linea]
    partes, resto, tope = [], b, 75
    while len(resto) > tope:
        corte = tope
        while corte > 0 and (resto[corte] & 0xC0) == 0x80:   # no partir UTF-8
            corte -= 1
        partes.append(resto[:corte].decode('utf-8'))
        resto = resto[corte:]
        tope = 74            # los siguientes pierden un octeto por el espacio
    partes.append(resto.decode('utf-8'))
    return [partes[0]] + [' ' + p for p in partes[1:]]


def slug(titulo):
    return titulo.lower().replace(' ', '-')


def evento(ev, sufijo, alarma=False):
    ini, fin, titulo, sede, desc = ev
    l = ['BEGIN:VEVENT',
         f'UID:{slug(titulo)}{sufijo}@jorgeymontse.com',
         'DTSTAMP:20260901T000000Z',
         f'DTSTART:{utc(*ini)}',
         f'DTEND:{utc(*fin)}',
         f'SUMMARY:{esc(titulo)} · Jorge y Montse',
         f'LOCATION:{esc(sede)}',
         f'DESCRIPTION:{esc(desc)}',
         'URL:https://jorgeymontse.com']
    if alarma:
        l += ['BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY',
              'DESCRIPTION:Mañana se casan Jorge y Montse', 'END:VALARM']
    l.append('END:VEVENT')
    return l


def calendario(eventos, sufijo):
    l = ['BEGIN:VCALENDAR', 'VERSION:2.0',
         'PRODID:-//jorgeymontse.com//boda//ES',
         'CALSCALE:GREGORIAN', 'METHOD:PUBLISH']
    for i, ev in enumerate(eventos):
        l += evento(ev, sufijo, alarma=(i == 0))
    l.append('END:VCALENDAR')
    salida = []
    for linea in l:
        salida += dobla(linea)
    return '\r\n'.join(salida) + '\r\n'


def main(destino):
    d = Path(destino)
    con_civil = [BASE[0], CIVIL] + BASE[1:]
    for nombre, eventos, sufijo in [('boda.ics', BASE, ''),
                                    ('boda-civil.ics', con_civil, '-civil')]:
        (d / nombre).write_bytes(calendario(eventos, sufijo).encode('utf-8'))
        print(f'{nombre}: {len(eventos)} eventos')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'assets')
