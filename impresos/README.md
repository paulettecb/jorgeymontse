# Impresos

Lo que no vive en el sitio sino en papel. Hoy es una cosa: las tarjetas
del álbum compartido que van en las mesas.

## Las tarjetas del álbum

| Archivo | Para qué |
|---|---|
| `mesas-album.pdf` | **Esto es lo que se manda a imprimir.** Una hoja tamaño carta con cuatro tarjetas iguales de 4.25 × 5.5 pulgadas. |
| `mesas-album.html` | Lo mismo, para abrirlo en el navegador y verlo o imprimirlo desde ahí. Se basta solo: trae las tipografías y el monograma metidos dentro. |
| `qr-album.svg` | El código QR suelto, en vector, por si hay que ponerlo en un letrero más grande o mandárselo a quien maquete otra cosa. |

**Al imprimir: tamaño carta, al 100%, sin «ajustar al papel».** Si el
navegador o la imprenta lo encogen, el código se encoge con él. Se corta
por el marco fino de cada tarjeta, que está ahí justamente para eso (y
para que se vea bien aunque la impresora deje borde blanco).

Cuántas hacen falta: una por mesa. Cada hoja da cuatro.

### Volver a generarlas

```
python3 design/mesas.py       # arma el HTML y el SVG
node design/imprimir.mjs      # convierte el HTML a PDF
python3 pruebas/qr.py         # comprueba que el código no cambió
```

El texto de la tarjeta está arriba de `design/mesas.py`, en cuatro
constantes (`ENCIMA`, `TITULO`, `CUERPO`, `PIE`). La dirección del álbum
está en `ALBUM`, arriba de `design/qr.py`, y es la misma que usa la
sección «Las fotos de todos» del sitio. **Si cambia el álbum hay que
cambiarla en los dos lados**; `pruebas/qr.py` y el punto 10 de
`pruebas/regresion.mjs` avisan si se separan.

### Qué tan bien se lee el código

Se generó la hoja a 300 puntos por pulgada y se leyó con el detector de
OpenCV. Las cuatro tarjetas devolvieron la dirección exacta. Y siguió
leyéndose:

- bajando la imagen a 72 puntos por pulgada,
- impresa en blanco y negro puro,
- girada 90 grados,
- con ruido de foto de teléfono,
- y con una mancha de centímetro y medio encima del código.

Dejó de leerse a 50 puntos por pulgada y con un desenfoque fuerte, las dos
muy por debajo de lo que da la cámara de cualquier teléfono a medio metro.
