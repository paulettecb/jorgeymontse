# Assets

Todo lo de esta carpeta viene del proyecto de Claude Design
**"Jorge & Montse Wedding"** (`413f7c81-6fdd-4b4b-ac72-a8344445ba64`),
carpeta `assets/`. El sitio los referencia por el mismo nombre, así que
sincronizar es copiar y pegar: mismo archivo, mismo nombre, misma ruta.

## Estado

Al importar el proyecto, el canal MCP de Claude Design entrega cada archivo
en base64 con un tope de **192 KiB por archivo**. Las ilustraciones y varias
fotos pesan más que eso y llegaron truncadas, así que no se pudieron commitear.
Están marcadas abajo como **falta**.

Mientras falten, el sitio **no se rompe**: `site.js` detecta la imagen que no
carga, la oculta y deja el hueco con el color de fondo, que ya es parte del
diseño (ver `handleMissing` en `assets/js/site.js`). Las celdas de galería sin
foto quedan fuera del lightbox y del conteo.

### Tipografías (`assets/fonts/`)

| Archivo | Rol (tokens/typography.css) | Estado |
|---|---|---|
| `Lumiare.otf` | Titulares y nombres de la pareja | ✅ |
| `Farmhouse.otf` | Script fino: ciudad, botones, eyebrows | ✅ |
| `Blastine Personal Use Only.ttf` | Script: ampersand, horas, cuenta regresiva | ✅ |
| `noiretblanc.otf` | **Cara de lectura**: párrafos, sedes, horarios | ❌ falta |

Sin NoirEtBlanc el cuerpo de texto cae al `serif` del sistema. Es el archivo
más importante de los que faltan.

### Ilustraciones y ornamentos

| Archivo | Dónde se usa | Estado |
|---|---|---|
| `monogram-mark.png` | Sello de lacre, favicon, nav, marca de agua, footer | ✅ |
| `ill-champagne-dk.png` | Itinerario · 19:00 cóctel | ✅ |
| `ill-couple-smile-lt.png` | Historia · «Nos conocimos» | ❌ falta |
| `ill-couple-lift-lt.png` | Historia · «Me dijo que sí» | ❌ falta |
| `ill-couple-dog-lt.png` | Historia · «Y ahora somos tres» + mesa de regalos | ❌ falta |
| `ill-couple-smile-dk.png` | RSVP | ❌ falta |
| `ill-rings-dk.png` | Itinerario · 17:00 ceremonia | ❌ falta |
| `ill-kiss-dk.png` | Itinerario · 20:30 cena | ❌ falta |
| `ill-dog-sunglasses-dk.png` | Itinerario · 22:00 fiesta | ❌ falta |
| `ill-dog-dk.png` | Itinerario · 02:00 tornaboda | ❌ falta |
| `orn-divider-lt.png` | Divisor en bienvenidos y footer | ❌ falta |
| `orn-heart-lt.png` | Estado post-boda de la cuenta regresiva | ❌ falta |

Convención del design system: `-lt` = oro profundo (#9C7638) para fondos hueso,
`-dk` = oro pálido (#E3C79B) para fondos vino. No intercambiarlos.

### Fotos

| Archivo | Dónde se usa | Estado |
|---|---|---|
| `foto-playa.jpeg` | Separador «donde todo empezó» + galería 5 | ✅ |
| `foto-desierto.jpeg` | Separador «contando los días» + galería 4 | ✅ |
| `foto-cerro.jpeg` | Separador «tú y yo, siempre» + galería 6 | ❌ falta |
| `foto-noche.jpeg` | Galería 1 | ❌ falta |
| `foto-vinedo.jpeg` | Galería 2 | ❌ falta |
| `foto-titulacion.jpeg` | Galería 3 | ❌ falta |

### Audio

| Archivo | Dónde se usa | Estado |
|---|---|---|
| `musica.mp3` | Botón de música (abajo a la derecha) | ❌ falta |

El botón sólo aparece si el `<audio>` tiene `src`; hoy apunta a
`assets/musica.mp3`. Si prefieres no poner música, borra el atributo `src`
del `<audio id="jm-audio">` en `index.html` y el botón desaparece solo.

## Cómo completar

Descarga los archivos marcados **falta** desde el proyecto de diseño en
claude.ai (carpeta `assets/`, y `assets/fonts/` para la tipografía), déjalos
aquí con el mismo nombre y listo — no hay que tocar código. Recarga y las
imágenes aparecen en su lugar.
