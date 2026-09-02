# -*- coding: utf-8 -*-
"""Arma la hoja de tarjetas del álbum que se imprime para las mesas.

    python3 design/mesas.py            # escribe en impresos/

Sale `impresos/mesas-album.html`, una hoja tamaño carta con cuatro
tarjetas iguales de 4.25 × 5.5 pulgadas (un cuarto de hoja cada una).
Se abre en el navegador y se manda a imprimir **al 100%, sin ajustar al
papel**: si el navegador la encoge, el QR se encoge con ella.

`design/imprimir.mjs` convierte esa misma hoja a `impresos/mesas-album.pdf`,
que es lo que conviene mandarle a la imprenta.

El archivo HTML se basta solo: las tipografías y el monograma van metidos
dentro como base64. Pesa cerca de un cuarto de megabyte, pero se puede
mandar por WhatsApp o por correo sin que se rompa nada.

Decisiones que no son obvias:

  * El QR va en tinta vino sobre crema, no en negro sobre blanco. Da 9:1
    de contraste, muy por encima del 3:1 que piden los lectores, y no
    desentona con el resto de la papelería.
  * La zona tranquila de alrededor del QR son cuatro módulos, como pide
    la norma. Se ve como un margen exagerado; no lo es, sin ella muchos
    teléfonos no enganchan el código.
  * Corrección de errores Q (25%): el papel se dobla, se mancha de vino y
    le cae cera de las velas.
  * La hoja lleva un marco fino en cada tarjeta que sirve de guía de
    corte. Así también se ve bien si la impresora no llega al borde del
    papel, que es lo normal en una impresora de casa.
"""
import base64
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import qr  # noqa: E402

VINO = '#551724'
CREMA = '#F6F4EE'
VERDE = '#55624A'

# El texto de la tarjeta. Corto a propósito: quien la lee está sentado en
# una mesa, con una copa en la mano y música.
ENCIMA = 'álbum compartido'
TITULO = 'Las fotos de hoy'
CUERPO = 'Escanea el código para ver el álbum de la boda y subir las tuyas.'
PIE = 'jorgeymontse.com'


def dato(ruta, mime):
    with open(ruta, 'rb') as f:
        return 'data:%s;base64,%s' % (mime, base64.b64encode(f.read()).decode())


def hoja(raiz, enlace=qr.ALBUM):
    m = qr.codigo(enlace, 'Q')
    lado = len(m) + 8                      # 4 módulos de zona tranquila por lado
    camino = qr.path(m)

    lumiare = dato(os.path.join(raiz, 'assets/fonts/Lumiare.otf'), 'font/otf')
    noir = dato(os.path.join(raiz, 'assets/fonts/noiretblanc.otf'), 'font/otf')
    monograma = dato(os.path.join(raiz, 'assets/monogram-mark.png'), 'image/png')

    tarjeta = """
  <article class="tarjeta">
    <img class="mono" src="%s" alt="">
    <div class="encima">%s</div>
    <h1>%s</h1>
    <svg class="qr" viewBox="0 0 %d %d" shape-rendering="crispEdges" role="img"
         aria-label="Código QR del álbum compartido de la boda">
      <g transform="translate(4 4)"><path fill="%s" d="%s"/></g>
    </svg>
    <p>%s</p>
    <div class="pie">%s</div>
  </article>""" % (monograma, ENCIMA, TITULO, lado, lado, VINO, camino,
                   CUERPO, PIE)

    return """<!doctype html>
<html lang="es">
<meta charset="utf-8">
<title>Jorge &amp; Montse · tarjetas del álbum</title>
<style>
@font-face{font-family:'Lumiare';src:url('%s') format('opentype');font-display:block}
@font-face{font-family:'NoirEtBlanc';src:url('%s') format('opentype');font-display:block}

/* Carta, sin márgenes: las cuatro tarjetas son exactamente la hoja
   partida en cuatro, así que el corte va por las líneas del marco. */
@page{ size:letter; margin:0 }
html,body{ margin:0; padding:0 }
body{ background:#8d8d8d }

.hoja{
  width:8.5in; height:11in; margin:0 auto; background:#fff;
  display:grid; grid-template-columns:repeat(2,4.25in);
  grid-template-rows:repeat(2,5.5in);
}

.tarjeta{
  position:relative; box-sizing:border-box;
  width:4.25in; height:5.5in; padding:0.42in 0.4in 0.34in;
  background:%s; color:%s;
  display:flex; flex-direction:column; align-items:center; text-align:center;
  /* El marco es la guía de corte y, si la impresora deja borde blanco,
     el remate del diseño. Va por dentro, no en el filo. */
  outline:0.5pt solid rgba(85,23,36,.30); outline-offset:-0.2in;
}

.mono{ width:0.34in; height:auto; display:block; margin-bottom:0.13in }

.encima{
  font-family:'NoirEtBlanc',Georgia,serif; text-transform:uppercase;
  font-size:8.5pt; letter-spacing:.3em; color:%s; margin-left:.3em;
}

h1{
  font-family:'Lumiare',Georgia,serif; font-weight:400;
  font-size:25pt; line-height:1.05; letter-spacing:-.01em;
  margin:0.09in 0 0.17in;
}

/* 2.05 pulgadas para 49 módulos de lado son ~1.06 mm por módulo. Los
   teléfonos leen sin problema desde medio metro, que es lo que hay de la
   mesa a la mano de quien la levanta. */
.qr{ width:2.05in; height:2.05in; display:block; background:%s }

p{
  font-family:'NoirEtBlanc',Georgia,serif;
  font-size:10.5pt; line-height:1.55; margin:0.16in 0 0; max-width:22ch;
}

.pie{
  font-family:'NoirEtBlanc',Georgia,serif; text-transform:uppercase;
  font-size:7.5pt; letter-spacing:.24em; margin-top:auto; opacity:.72;
  margin-left:.24em;
}

/* Nota para quien la abre en pantalla; no se imprime. */
.nota{
  max-width:8.5in; margin:16px auto; color:#fff; font:14px/1.5 system-ui,sans-serif;
}
@media print{ .nota{ display:none } body{ background:#fff } }
</style>

<p class="nota">Imprímela en tamaño carta, <b>al 100%%</b> (sin «ajustar al
papel»), y corta por las líneas. Si la impresora no llega hasta el borde,
no pasa nada: el marco de cada tarjeta es la guía de corte.</p>

<div class="hoja">%s%s%s%s
</div>
</html>
""" % (lumiare, noir, CREMA, VINO, VERDE, CREMA, tarjeta, tarjeta, tarjeta,
       tarjeta)


def main(raiz='.'):
    salida = os.path.join(raiz, 'impresos')
    os.makedirs(salida, exist_ok=True)

    with open(os.path.join(salida, 'mesas-album.html'), 'w',
              encoding='utf-8') as f:
        f.write(hoja(raiz))

    # El QR suelto, por si hay que ponerlo en un letrero más grande o
    # mandárselo a alguien que maqueta por su cuenta.
    with open(os.path.join(salida, 'qr-album.svg'), 'w', encoding='utf-8') as f:
        f.write(qr.svg(qr.ALBUM, 'Q', color=VINO, fondo=CREMA))

    m = qr.codigo(qr.ALBUM, 'Q')
    print('impresos/mesas-album.html · 4 tarjetas de 4.25x5.5 pulgadas')
    print('impresos/qr-album.svg    · versión %d, %dx%d módulos, corrección Q'
          % ((len(m) - 17) // 4, len(m), len(m)))
    print(qr.ALBUM)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
