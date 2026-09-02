# -*- coding: utf-8 -*-
"""Codificador de códigos QR, sólo con la librería estándar.

    python3 design/qr.py            # imprime el QR del álbum en la terminal
    python3 design/qr.py "texto"    # cualquier otro texto

Se usa desde `design/mesas.py`, que arma los letreros que van impresos en
las mesas. Vive aparte porque un QR mal hecho no se nota hasta que ya se
imprimieron veinte y nadie puede escanearlos.

Por qué escribirlo en vez de instalar `qrcode`: el resto de los generadores
del proyecto (`sello.py`, `calendario.py`) corren con python3 pelón, y esto
se va a volver a correr dentro de meses, cuando nadie se acuerde de qué
había instalado. La especificación (ISO/IEC 18004) es corta y no cambia.

Cubre modo byte (UTF-8) y versiones 1 a 10, que llegan a ~270 caracteres:
de sobra para una URL. Si alguna vez hace falta más, `assert` avisa en vez
de escupir un código roto.

La salida está fijada en `pruebas/qr.py`, que compara contra huellas que en
su día se verificaron de dos formas independientes: contra la librería
`qrcode` de PyPI, y escaneando con OpenCV una imagen del letrero impreso
a 300 puntos por pulgada.
"""
import sys

ALBUM = 'https://photos.icloud.com/shared/album/0fbDkkiy-8En-kvPuJlgLDOCw'

# ---------------------------------------------------------------- tablas
#
# Por versión y nivel de corrección: (codewords de corrección por bloque,
# bloques del grupo 1, datos por bloque, bloques del grupo 2, datos por
# bloque). El grupo 2 lleva un codeword más que el 1 cuando existe.
#
# Comprobación de que la tabla está bien: datos + corrección tiene que dar
# el total de codewords de esa versión (TOTAL, abajo). `_revisa_tablas()`
# lo verifica al importar.
BLOQUES = {
    1:  {'L': (7, 1, 19, 0, 0),   'M': (10, 1, 16, 0, 0),  'Q': (13, 1, 13, 0, 0),  'H': (17, 1, 9, 0, 0)},
    2:  {'L': (10, 1, 34, 0, 0),  'M': (16, 1, 28, 0, 0),  'Q': (22, 1, 22, 0, 0),  'H': (28, 1, 16, 0, 0)},
    3:  {'L': (15, 1, 55, 0, 0),  'M': (26, 1, 44, 0, 0),  'Q': (18, 2, 17, 0, 0),  'H': (22, 2, 13, 0, 0)},
    4:  {'L': (20, 1, 80, 0, 0),  'M': (18, 2, 32, 0, 0),  'Q': (26, 2, 24, 0, 0),  'H': (16, 4, 9, 0, 0)},
    5:  {'L': (26, 1, 108, 0, 0), 'M': (24, 2, 43, 0, 0),  'Q': (18, 2, 15, 2, 16), 'H': (22, 2, 11, 2, 12)},
    6:  {'L': (18, 2, 68, 0, 0),  'M': (16, 4, 27, 0, 0),  'Q': (24, 4, 19, 0, 0),  'H': (28, 4, 15, 0, 0)},
    7:  {'L': (20, 2, 78, 0, 0),  'M': (18, 4, 31, 0, 0),  'Q': (18, 2, 14, 4, 15), 'H': (26, 4, 13, 1, 14)},
    8:  {'L': (24, 2, 97, 0, 0),  'M': (22, 2, 38, 2, 39), 'Q': (22, 4, 18, 2, 19), 'H': (26, 4, 14, 2, 15)},
    9:  {'L': (30, 2, 116, 0, 0), 'M': (22, 3, 36, 2, 37), 'Q': (20, 4, 16, 4, 17), 'H': (24, 4, 12, 4, 13)},
    10: {'L': (18, 2, 68, 2, 69), 'M': (26, 4, 43, 1, 44), 'Q': (24, 6, 19, 2, 20), 'H': (28, 6, 15, 2, 16)},
}

TOTAL = {1: 26, 2: 44, 3: 70, 4: 100, 5: 134,
         6: 172, 7: 196, 8: 242, 9: 292, 10: 346}

# Centros de los patrones de alineación. El de la esquina superior
# izquierda no se dibuja porque ahí va el patrón de búsqueda.
ALINEACION = {1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
              6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46],
              10: [6, 28, 50]}

# Los dos bits que identifican el nivel dentro de la información de formato.
# No van en orden alfabético ni de fuerza; es el orden de la norma.
NIVEL_BITS = {'L': 0b01, 'M': 0b00, 'Q': 0b11, 'H': 0b10}


def _revisa_tablas():
    for v, niveles in BLOQUES.items():
        for nivel, (ec, b1, d1, b2, d2) in niveles.items():
            datos = b1 * d1 + b2 * d2
            correccion = (b1 + b2) * ec
            assert datos + correccion == TOTAL[v], (v, nivel)
            assert b2 == 0 or d2 == d1 + 1, (v, nivel)


_revisa_tablas()


def _cuenta_bits(version):
    """Cuántos bits ocupa la cuenta de bytes. La norma la alarga en la
       versión 10: hasta la 9 son 8 bits, de ahí en adelante 16."""
    return 8 if version < 10 else 16


def capacidad(version, nivel):
    """Cuántos bytes caben, ya descontado el encabezado (4 bits de modo
       más la cuenta)."""
    _, b1, d1, b2, d2 = BLOQUES[version][nivel]
    return ((b1 * d1 + b2 * d2) * 8 - 4 - _cuenta_bits(version)) // 8


# ------------------------------------------------ aritmética de GF(256)
#
# Reed-Solomon trabaja sobre el campo de 256 elementos con el polinomio
# 0x11D. EXP/LOG son las tablas de multiplicar: a*b = exp[log a + log b].
EXP = [0] * 512
LOG = [0] * 256
_x = 1
for _i in range(255):
    EXP[_i] = _x
    LOG[_x] = _i
    _x <<= 1
    if _x & 0x100:
        _x ^= 0x11D
for _i in range(255, 512):
    EXP[_i] = EXP[_i - 255]


def _mul(a, b):
    if a == 0 or b == 0:
        return 0
    return EXP[LOG[a] + LOG[b]]


def _generador(grado):
    """(x - a^0)(x - a^1)... En este campo restar es lo mismo que sumar,
       y sumar es XOR, así que no hay signos de qué preocuparse."""
    g = [1]                       # coeficiente de mayor grado primero
    for i in range(grado):
        g = g + [0]               # multiplicar por x
        for j in range(len(g) - 1, 0, -1):
            g[j] ^= _mul(g[j - 1], EXP[i])
    return g


def correccion(datos, cuantos):
    """Los `cuantos` codewords de corrección de un bloque: el residuo de
       dividir los datos (desplazados) entre el polinomio generador."""
    g = _generador(cuantos)
    resto = list(datos) + [0] * cuantos
    for i in range(len(datos)):
        coef = resto[i]
        if coef:
            for j, gj in enumerate(g):
                resto[i + j] ^= _mul(gj, coef)
    return resto[len(datos):]


# ------------------------------------------------------------ los bits
def _bits(datos, version, nivel):
    """Modo byte, cuenta, datos, terminador, relleno. El relleno alterna
       11101100 / 00010001 porque así lo pide la norma: dos bytes que no
       se parecen entre sí evitan zonas grandes de un solo color."""
    _, b1, d1, b2, d2 = BLOQUES[version][nivel]
    total_datos = b1 * d1 + b2 * d2

    bits = []

    def mete(valor, largo):
        for k in range(largo - 1, -1, -1):
            bits.append((valor >> k) & 1)

    mete(0b0100, 4)                          # modo byte
    mete(len(datos), _cuenta_bits(version))  # cuántos bytes vienen
    for b in datos:
        mete(b, 8)

    sobran = total_datos * 8 - len(bits)
    mete(0, min(4, sobran))                 # terminador
    while len(bits) % 8:
        bits.append(0)

    codewords = [int(''.join(map(str, bits[i:i + 8])), 2)
                 for i in range(0, len(bits), 8)]
    relleno, k = [0xEC, 0x11], 0
    while len(codewords) < total_datos:
        codewords.append(relleno[k % 2])
        k += 1
    return codewords


def _intercala(codewords, version, nivel):
    """Los bloques no van uno tras otro: se intercalan codeword por
       codeword, para que una mancha de tinta se reparta entre todos los
       bloques en vez de destrozar uno solo."""
    ec, b1, d1, b2, d2 = BLOQUES[version][nivel]
    bloques, i = [], 0
    for cuantos, largo in ((b1, d1), (b2, d2)):
        for _ in range(cuantos):
            bloques.append(codewords[i:i + largo])
            i += largo
    ecs = [correccion(b, ec) for b in bloques]

    salida = []
    for j in range(max(len(b) for b in bloques)):
        for b in bloques:
            if j < len(b):
                salida.append(b[j])
    for j in range(ec):
        for e in ecs:
            salida.append(e[j])
    return salida


# --------------------------------------------------------------- BCH
def _bch(datos, generador, grado):
    resto = datos << grado
    while resto.bit_length() - 1 >= grado:
        resto ^= generador << (resto.bit_length() - generador.bit_length())
    return (datos << grado) | resto


def formato(nivel, mascara):
    """15 bits: 5 de datos, 10 de BCH y una máscara fija que impide que el
       resultado sea todo ceros (que se confundiría con módulos vacíos)."""
    return _bch((NIVEL_BITS[nivel] << 3) | mascara, 0b101_0011_0111, 10) ^ 0b101_0100_0001_0010


def version_info(version):
    """18 bits, sólo de la versión 7 en adelante. Antes el tamaño se
       deduce contando módulos."""
    return _bch(version, 0b1_1111_0010_0101, 12)


# --------------------------------------------------------- la cuadrícula
MASCARAS = [
    lambda r, c: (r + c) % 2 == 0,
    lambda r, c: r % 2 == 0,
    lambda r, c: c % 3 == 0,
    lambda r, c: (r + c) % 3 == 0,
    lambda r, c: (r // 2 + c // 3) % 2 == 0,
    lambda r, c: (r * c) % 2 + (r * c) % 3 == 0,
    lambda r, c: ((r * c) % 2 + (r * c) % 3) % 2 == 0,
    lambda r, c: ((r + c) % 2 + (r * c) % 3) % 2 == 0,
]


def _esqueleto(version):
    """Todo lo que no son datos: patrones de búsqueda, separadores,
       tiempo, alineación, el módulo negro y los huecos reservados para
       formato y versión. Devuelve (módulos, reservado)."""
    n = version * 4 + 17
    m = [[0] * n for _ in range(n)]
    res = [[False] * n for _ in range(n)]

    def pinta(fila, col, dibujo):
        for i, renglon in enumerate(dibujo):
            for j, v in enumerate(renglon):
                if 0 <= fila + i < n and 0 <= col + j < n:
                    m[fila + i][col + j] = v
                    res[fila + i][col + j] = True

    ojo = [[1] * 7,
           [1, 0, 0, 0, 0, 0, 1],
           [1, 0, 1, 1, 1, 0, 1],
           [1, 0, 1, 1, 1, 0, 1],
           [1, 0, 1, 1, 1, 0, 1],
           [1, 0, 0, 0, 0, 0, 1],
           [1] * 7]
    # Los patrones de búsqueda con su separador blanco de un módulo.
    for fila, col in ((0, 0), (0, n - 7), (n - 7, 0)):
        pinta(fila, col, ojo)
        for i in range(-1, 8):
            for j in range(-1, 8):
                if (i in (-1, 7) or j in (-1, 7)):
                    y, x = fila + i, col + j
                    if 0 <= y < n and 0 <= x < n:
                        m[y][x] = 0
                        res[y][x] = True

    # Patrones de tiempo: la línea punteada que marca la escala.
    for i in range(8, n - 8):
        m[6][i] = m[i][6] = 1 - i % 2
        res[6][i] = res[i][6] = True

    # Alineación, menos los tres que caerían sobre un patrón de búsqueda.
    centros = ALINEACION[version]
    ojito = [[1] * 5,
             [1, 0, 0, 0, 1],
             [1, 0, 1, 0, 1],
             [1, 0, 0, 0, 1],
             [1] * 5]
    for a in centros:
        for b in centros:
            if (a, b) in ((6, 6), (6, centros[-1]), (centros[-1], 6)):
                continue
            pinta(a - 2, b - 2, ojito)

    # El módulo que siempre está negro, y los huecos del formato.
    m[n - 8][8] = 1
    res[n - 8][8] = True
    for i in range(9):
        if not res[8][i]:
            res[8][i] = True
        if not res[i][8]:
            res[i][8] = True
    for i in range(8):
        res[8][n - 1 - i] = True
        res[n - 1 - i][8] = True

    if version >= 7:
        for i in range(6):
            for j in range(3):
                res[n - 11 + j][i] = True
                res[i][n - 11 + j] = True

    return m, res


def _acomoda(m, res, datos):
    """Zigzag de dos columnas desde abajo a la derecha, saltándose la
       columna 6 (la del patrón de tiempo vertical)."""
    n = len(m)
    bits = [(b >> k) & 1 for b in datos for k in range(7, -1, -1)]
    i, subiendo, col = 0, True, n - 1
    while col > 0:
        if col == 6:
            col -= 1
        filas = range(n - 1, -1, -1) if subiendo else range(n)
        for fila in filas:
            for c in (col, col - 1):
                if not res[fila][c]:
                    m[fila][c] = bits[i] if i < len(bits) else 0
                    i += 1
        subiendo = not subiendo
        col -= 2
    return m


def _castigo(m):
    """Las cuatro reglas de castigo de la norma. Gana la máscara con menos
       puntos: menos rachas largas, menos cuadros de un solo color, menos
       falsos patrones de búsqueda y una mezcla cercana al 50%."""
    n = len(m)
    total = 0

    for linea in list(m) + [list(col) for col in zip(*m)]:
        racha, anterior = 1, linea[0]
        for v in linea[1:]:
            if v == anterior:
                racha += 1
            else:
                if racha >= 5:
                    total += 3 + racha - 5
                racha, anterior = 1, v
        if racha >= 5:
            total += 3 + racha - 5

    for r in range(n - 1):
        for c in range(n - 1):
            if m[r][c] == m[r][c + 1] == m[r + 1][c] == m[r + 1][c + 1]:
                total += 3

    patrones = ([1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1])
    for linea in list(m) + [list(col) for col in zip(*m)]:
        for i in range(n - 10):
            if linea[i:i + 11] in patrones:
                total += 40

    oscuros = sum(sum(f) for f in m)
    total += 10 * (abs(oscuros * 100 // (n * n) - 50) // 5)
    return total


def _sella(m, version, nivel, mascara):
    """Escribe la información de formato (dos veces) y la de versión."""
    n = len(m)
    f = formato(nivel, mascara)
    for i in range(15):
        bit = (f >> i) & 1
        # Primera copia, pegada al patrón de búsqueda de arriba a la
        # izquierda: baja por la columna 8 y dobla hacia la izquierda por
        # la fila 8, saltándose los módulos del patrón de tiempo.
        if i < 6:
            m[i][8] = bit
        elif i == 6:
            m[7][8] = bit
        elif i == 7:
            m[8][8] = bit
        elif i == 8:
            m[8][7] = bit
        else:
            m[8][14 - i] = bit
        # Segunda copia, para poder leer el formato aunque una esquina
        # esté tapada: los primeros ocho bits a la derecha, el resto abajo.
        if i < 8:
            m[8][n - 1 - i] = bit
        else:
            m[n - 15 + i][8] = bit

    if version >= 7:
        v = version_info(version)
        for i in range(18):
            bit = (v >> i) & 1
            m[i // 3][n - 11 + i % 3] = bit
            m[n - 11 + i % 3][i // 3] = bit
    return m


def codigo(texto, nivel='Q', version=None, mascara=None):
    """La cuadrícula del QR: lista de listas de 0 y 1, sin margen.

       `nivel` es cuánta corrección de errores lleva: L 7%, M 15%, Q 25%,
       H 30%. Para imprimir conviene Q; el papel se dobla y se mancha."""
    datos = texto.encode('utf-8')
    if version is None:
        for v in sorted(BLOQUES):
            if capacidad(v, nivel) >= len(datos):
                version = v
                break
        assert version, ('no cabe en las versiones que sabe hacer este '
                         'archivo (1 a 10): %d bytes' % len(datos))
    assert len(datos) <= capacidad(version, nivel), 'no cabe en esa versión'

    cuerpo = _intercala(_bits(datos, version, nivel), version, nivel)

    mejor, puntos = None, None
    for mk in (range(8) if mascara is None else [mascara]):
        m, res = _esqueleto(version)
        _acomoda(m, res, cuerpo)
        for r in range(len(m)):
            for c in range(len(m)):
                if not res[r][c] and MASCARAS[mk](r, c):
                    m[r][c] ^= 1
        _sella(m, version, nivel, mk)
        p = _castigo(m)
        if puntos is None or p < puntos:
            mejor, puntos = m, p
    return mejor


# ------------------------------------------------------------- dibujarlo
def path(m):
    """La cuadrícula como un solo `d` de SVG, un módulo = una unidad. Un
       path en vez de miles de <rect> porque los visores de PDF y las
       imprentas dejan costuras blancas entre rectángulos pegados."""
    d = []
    for r, fila in enumerate(m):
        c = 0
        while c < len(fila):
            if fila[c]:
                largo = 1
                while c + largo < len(fila) and fila[c + largo]:
                    largo += 1
                d.append('M%d %dh%dv1h-%dz' % (c, r, largo, largo))
                c += largo
            else:
                c += 1
    return ''.join(d)


def svg(texto, nivel='Q', margen=4, color='#551724', fondo='#F6F4EE'):
    """El QR como archivo SVG completo. `margen` es la zona tranquila, en
       módulos: la norma pide 4 y los escáneres los necesitan de verdad."""
    m = codigo(texto, nivel)
    n = len(m) + margen * 2
    fondo_rect = ('<rect width="%d" height="%d" fill="%s"/>' % (n, n, fondo)
                  if fondo else '')
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
            'shape-rendering="crispEdges">%s<g transform="translate(%d %d)">'
            '<path fill="%s" d="%s"/></g></svg>'
            % (n, n, fondo_rect, margen, margen, color, path(m)))


def terminal(m, margen=2):
    """Para verlo aquí mismo. Dos espacios por módulo porque los
       caracteres son el doble de altos que de anchos."""
    n = len(m)
    vacio = '\x1b[47m  \x1b[0m'
    lleno = '\x1b[40m  \x1b[0m'
    borde = vacio * (n + margen * 2)
    salida = [borde] * margen
    for fila in m:
        salida.append(vacio * margen +
                      ''.join(lleno if v else vacio for v in fila) +
                      vacio * margen)
    return '\n'.join(salida + [borde] * margen)


if __name__ == '__main__':
    texto = sys.argv[1] if len(sys.argv) > 1 else ALBUM
    m = codigo(texto)
    print(terminal(m))
    print('%s\nversión %d · %dx%d módulos · corrección Q'
          % (texto, (len(m) - 17) // 4, len(m), len(m)))
