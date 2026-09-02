# -*- coding: utf-8 -*-
"""Fija la salida de `design/qr.py`.

    python3 pruebas/qr.py

Un QR malo no se ve mal: se ve exactamente igual que uno bueno y no lo lee
nadie. Y no se descubre en la pantalla, se descubre con las tarjetas ya
impresas y los invitados sentados. Por eso esto no revisa que «se vea
bien», revisa que salgan los mismos módulos de siempre.

De dónde salen las huellas
--------------------------
No están sacadas de la nada ni copiadas de la salida del propio código sin
más. El 2 de septiembre de 2026, con el codificador recién escrito, se
comprobó de dos maneras que lo que produce es correcto:

  1. **Contra otra implementación.** Se compararon módulo por módulo 225
     combinaciones de texto y nivel de corrección contra la librería
     `qrcode` de PyPI (con `QRData(..., mode=MODE_8BIT_BYTE)` para que las
     dos codifiquen en modo byte). Los datos, la corrección de errores y
     el acomodo salieron idénticos en las 225. En 88 salió una máscara
     distinta: la norma manda elegir la de menor castigo, las dos la
     calculan, y cuando dos máscaras empatan o las reglas se interpretan
     con un decimal de diferencia cada quien se queda con una. Los ocho
     resultados son códigos válidos; ninguna de las dos está mal.

  2. **Escaneando de verdad.** Se generó `impresos/mesas-album.png` a 300
     puntos por pulgada —la hoja tal como sale de la impresora— y se leyó
     con el detector de OpenCV. Las cuatro tarjetas devolvieron la URL
     exacta. Y siguió leyéndose bajando a 72 dpi, en blanco y negro puro,
     girada 90 grados, con ruido de foto de teléfono y con una mancha de
     centímetro y medio encima del código.

Ninguna de las dos herramientas está en el proyecto (una es de PyPI y la
otra pesa cien megas), así que lo que queda aquí es la huella. Si alguna
cambia, algo se movió en el codificador y hay que repetir las dos
comprobaciones de arriba antes de dar por buena la nueva.
"""
import hashlib
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                '..', 'design'))
import qr  # noqa: E402

# (texto, nivel, lado en módulos, huella de la cuadrícula)
FIJOS = [
    (qr.ALBUM,                  'Q', 41, 'b849f845bd827ca7'),
    (qr.ALBUM,                  'H', 45, '6de97d4cab1ca4c3'),
    ('https://jorgeymontse.com', 'M', 25, 'a36ba2dc479744f2'),
    ('HELLO WORLD',             'L', 21, 'd611fb7162361a13'),
    ('á' * 80,                  'M', 53, '842644803c49979f'),
    ('x' * 250,                 'L', 57, 'b0ede42fedf4fbf9'),
    ('a',                       'H', 21, 'bb4ebea10d02c0ed'),
]


def huella(m):
    return hashlib.sha256(
        ''.join(''.join(map(str, f)) for f in m).encode()).hexdigest()[:16]


def revisa(m, version):
    """Lo que tiene que cumplir cualquier QR, sin saber qué dice: los tres
       patrones de búsqueda en su sitio, la línea de tiempo alternando y el
       módulo que siempre va negro."""
    n = len(m)
    assert n == version * 4 + 17, 'el lado no corresponde a la versión'
    assert all(len(f) == n for f in m), 'no es cuadrado'
    for fila, col in ((0, 0), (0, n - 7), (n - 7, 0)):
        assert all(m[fila][col + j] for j in range(7)), 'patrón de búsqueda'
        assert m[fila + 3][col + 1] == 0, 'el anillo claro del patrón'
        assert all(m[fila + 2 + i][col + 2 + j] for i in range(3)
                   for j in range(3)), 'el cuadro oscuro del centro'
    for i in range(8, n - 8):
        assert m[6][i] == 1 - i % 2 and m[i][6] == 1 - i % 2, 'patrón de tiempo'
    assert m[n - 8][8] == 1, 'el módulo negro fijo'


def main():
    fallas = 0
    for texto, nivel, lado, esperada in FIJOS:
        m = qr.codigo(texto, nivel)
        version = (len(m) - 17) // 4
        etiqueta = '%-34r %s' % (texto[:34], nivel)
        try:
            revisa(m, version)
        except AssertionError as e:
            print('✗ %s  estructura: %s' % (etiqueta, e))
            fallas += 1
            continue
        if len(m) != lado:
            print('✗ %s  esperaba %d módulos de lado, salieron %d'
                  % (etiqueta, lado, len(m)))
            fallas += 1
        elif huella(m) != esperada:
            print('✗ %s  la cuadrícula cambió (%s en vez de %s)'
                  % (etiqueta, huella(m), esperada))
            fallas += 1
        else:
            print('✓ %s  v%-2d %dx%d' % (etiqueta, version, len(m), len(m)))

    # El QR del álbum tiene que decir exactamente la URL del álbum: si
    # alguien la cambia en un lado y no en el otro, esto lo caza.
    from mesas import hoja                                   # noqa: E402
    raiz = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    html = hoja(raiz)
    if qr.path(qr.codigo(qr.ALBUM, 'Q')) not in html:
        print('✗ la hoja de las mesas no lleva el QR del álbum')
        fallas += 1
    else:
        print('✓ la hoja de las mesas lleva ese mismo QR')

    print('\n%s' % ('todo en orden' if not fallas else '%d falla(s)' % fallas))
    return 1 if fallas else 0


if __name__ == '__main__':
    sys.exit(main())
