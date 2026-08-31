# Assets

Todo lo de esta carpeta viene del proyecto de Claude Design
**"Jorge & Montse Wedding"** (`413f7c81-6fdd-4b4b-ac72-a8344445ba64`),
carpeta `assets/`. El sitio los referencia por el mismo nombre, así que
sincronizar es copiar y pegar: mismo archivo, mismo nombre, misma ruta.

## Estado

El canal MCP de Claude Design truncaba los archivos grandes al importar,
así que las ilustraciones, varias fotos y algunas tipografías llegaron
después, subidas a mano (agosto 2026). **Hoy no falta ningún archivo.**

Si algo llegara a faltar, el sitio no se rompe: `site.js` detecta la
imagen que no carga, la oculta y deja el hueco con el color de fondo (ver
`handleMissing` en `assets/js/site.js`). Las celdas de galería sin foto
quedan fuera del lightbox y del conteo.

### Tipografías (`assets/fonts/`)

| Archivo | Rol | Estado |
|---|---|---|
| `Lumiare.otf` | Titulares y nombres de la pareja | ✅ |
| `Lamoric Rowen TTF.ttf` | Ya no se usa: se parecía demasiado a NoirEtBlanc y los novios pidieron sólo tres tipografías | ✅ |
| `Blastine Personal Use Only.ttf` | Script: ampersand, horas, cuenta regresiva | ✅ |
| `noiretblanc.otf` | **Cara de lectura y de detalle**: párrafos, sedes, horarios y todas las versalitas (eyebrows, botones, nav) | ✅ |
| `MovesCabse-Regular.ttf` | Alternativa de caps; hoy sin uso | ✅ |
| `Farmhouse.otf` | Ya no se usa (los novios pidieron quitarla); queda por si acaso | ✅ |

Son tres las que el sitio carga: **Lumiare** (titulares), **NoirEtBlanc** (todo
el texto, párrafos y versalitas) y **Blastine** (sólo números y símbolos: horas,
cuenta regresiva y el «&»).

### Ilustraciones y ornamentos

Todas ✅. Las que usa el sitio hoy:

| Archivo | Dónde se usa |
|---|---|
| `monogram-mark.png` | Sello de lacre, favicon, nav, marca de agua, bienvenidos, footer, modal luna de miel |
| `foto-invitacion.jpeg` | Fondo de la invitación cuando llena la pantalla |
| `ill-dog-martini-dk.png` | Itinerario · 19:00 cóctel (Raava recostada en la copa) |
| `ill-dog-sunglasses-dk.png` | Itinerario · 21:30 fiesta (Raava se queda de fiesta) |
| `ill-couple-dog-lt.png` | Mesa de regalos |
| `ill-couple-smile-dk.png` | RSVP |
| `orn-heart-dk.png` | Estado post-boda de la cuenta regresiva y "gracias" del RSVP |
| `foto-playa/cerro/desierto.jpeg` | Separadores con frase |
| `foto-noche/vinedo/titulacion/desierto/playa/cerro.jpeg` | Galería |

Los iconos del itinerario (iglesia, cámara, los novios entrando, pastel y
acta civil) son SVG inline en `index.html`, no archivos. Los que llevan
relleno usan `var(--itin-bg)`, el mismo color del fondo del itinerario, para
recortar lo que tienen detrás: si cambias ese fondo, cámbialo en `site.css`
y los SVG siguen.

Los dos renglones donde sale Raava no son iconos sino ilustraciones, en el
mismo trazo detallado: la copa a las 19:00 y los lentes a las 21:30. El
criterio quedó así: **los objetos son iconos de línea, la perra es
ilustración**.

`ill-dog-martini-dk.png` se derivó del dibujo que mandaron los novios,
guardado sin tocar en `savethedatepics/raava.svg`. Ese archivo dice `.svg`
pero por dentro es un PNG de 1.5 MB envuelto en un `<svg>`: no es vector.
Para el sitio se le sacó el PNG, se recortó el margen, se repintó del negro
original al crema `#EEEBE6` (el mismo de la de lentes) y se escaló a 900 px
de ancho — 158 KB en vez de 1.5 MB. Si el dibujo cambia, el procedimiento se
repite; el original se queda donde está como respaldo.

Los garigoles (`orn-divider`, `orn-flourish`, `orn-sprig`) y las
ilustraciones de la sección "Nuestra historia" (`ill-couple-smile-lt`,
`ill-couple-lift-lt`, etc.) salieron del sitio por decisión de los novios,
pero los archivos se quedan por si algo regresa.

Convención del design system: `-lt` = oro profundo (#9C7638) para fondos
claros, `-dk` = crema pálido (#E3C79B) para fondos vino. No intercambiarlos.

### `savethedatepics/`

Los originales de la sesión, tal como los subieron los novios: 38 fotos y
el dibujo de Raava, unos 130 MB. **El sitio no sirve esta carpeta**
—`netlify.toml` la manda a 404— porque son fotos privadas y el `publish`
del proyecto es la raíz del repo. Es un archivo, no una carpeta de assets:
lo que el sitio usa sale de aquí procesado y vive en `assets/`.

### La foto de fondo de la invitación

`foto-invitacion.jpeg` sale de `savethedatepics/M&J-PRE-215.jpeg` (los novios
desenfocados al frente, la cúpula del templo nítida atrás). El original mide
4160×6240 y pesa 5 MB; la del sitio va a 1600 px de ancho y 250 KB, con la
saturación al 72%, el punto negro subido a 30 y el contraste al 94%: el saco
oscuro dejaba de ser un agujero y la foto se acerca al tono cálido de la
paleta sin volverse blanco y negro.

Aparece **sólo cuando la invitación ya llenó la pantalla** — `site.js` le sube
la opacidad de 0 a 1 entre `p=0.78` y `p=1`. Antes de eso la tarjeta sale
blanca del sobre, como siempre. Sin JavaScript nunca aparece.

El encuadre es `object-position: center 65%`, no el centro: centrada, la torre
quedaba justo detrás del nombre y no se veía. Bajando el anclaje, la iglesia
sube al tercio derecho y libra la columna de texto.

Encima va `.jm-hero-velo` (en `site.css`), un velo crema **radial**: casi
cerrado en el centro, donde vive el texto, y abierto en las orillas, donde la
foto se ve. Tiene que ser radial: con un velo parejo el «nos casamos» en verde
olivo no llega a AA sobre la foto — necesitaría un fondo casi blanco, y
entonces la foto ya no se vería. En móvil el velo cierra más porque el texto se
pinta a ~20 px en vez de ~36 px, y el piso de contraste sube de 3:1 a 4.5:1.

Si cambias la foto, **vuelve a medir**: el script que compara cada renglón
contra su fondo real está en el mensaje del commit que la añadió.

### Audio

| Archivo | Dónde se usa | Estado |
|---|---|---|
| `musica.m4a` | Botón de música (abajo a la derecha) | ✅ · pendiente cambiarla por la canción de Elvis que elijan los novios |

El botón sólo aparece si el `<audio>` tiene `src`; hoy apunta a
`assets/musica.m4a`. Si prefieres no poner música, borra el atributo `src`
del `<audio id="jm-audio">` en `index.html` y el botón desaparece solo.
