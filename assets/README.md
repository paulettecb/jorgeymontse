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
| `ill-dog-sunglasses-dk.png` | Itinerario · 21:30 fiesta (Raava se queda de fiesta) |
| `ill-couple-dog-lt.png` | Mesa de regalos |
| `ill-couple-smile-dk.png` | RSVP |
| `orn-heart-dk.png` | Estado post-boda de la cuenta regresiva y "gracias" del RSVP |
| `foto-playa/cerro/desierto.jpeg` | Separadores con frase |
| `foto-noche/vinedo/titulacion/desierto/playa/cerro.jpeg` | Galería |

Los iconos del itinerario (iglesia, Raava recostada en la copa de martini,
cámara, los novios entrando, pastel y acta civil) son SVG inline en
`index.html`, no archivos. Los que llevan relleno usan `var(--itin-bg)`,
el mismo color del fondo del itinerario, para recortar lo que tienen detrás:
si cambias ese fondo, cámbialo en `site.css` y los SVG siguen.

Los garigoles (`orn-divider`, `orn-flourish`, `orn-sprig`) y las
ilustraciones de la sección "Nuestra historia" (`ill-couple-smile-lt`,
`ill-couple-lift-lt`, etc.) salieron del sitio por decisión de los novios,
pero los archivos se quedan por si algo regresa.

Convención del design system: `-lt` = oro profundo (#9C7638) para fondos
claros, `-dk` = crema pálido (#E3C79B) para fondos vino. No intercambiarlos.

### Audio

| Archivo | Dónde se usa | Estado |
|---|---|---|
| `musica.m4a` | Botón de música (abajo a la derecha) | ✅ · pendiente cambiarla por la canción de Elvis que elijan los novios |

El botón sólo aparece si el `<audio>` tiene `src`; hoy apunta a
`assets/musica.m4a`. Si prefieres no poner música, borra el atributo `src`
del `<audio id="jm-audio">` en `index.html` y el botón desaparece solo.
