# Jorge & Montse

Sitio de boda. Morelia, Michoacán — 30 de enero de 2027.

Es un sitio estático: HTML, CSS y un archivo de JavaScript. No hay build,
no hay dependencias, no hay framework. Se abre el `index.html` y funciona.

```
python3 -m http.server 8000     # y abrir http://localhost:8000
```

(Conviene servirlo por HTTP en vez de abrir el archivo directo: las
tipografías `@font-face` no cargan bajo `file://` en algunos navegadores.)

## Qué hace

Abre con un sobre lacrado. Al hacer click, la solapa se abre, la invitación
sale y se acomoda al lado; al bajar, la invitación crece hasta llenar la
pantalla y a partir de ahí el sitio es un scroll normal:

bienvenidos · cuenta regresiva · historia · la boda · itinerario ·
vestimenta · hospedaje · galería · mesa de regalos · RSVP

La cuenta regresiva se cambia sola por un mensaje de agradecimiento cuando
pasa la fecha de la boda.

## De dónde viene

Es la implementación de `templates/wedding-site/WeddingSite.dc.html` del
proyecto de Claude Design **"Jorge & Montse Wedding"**. El original está
guardado sin tocar en [`design/templates/wedding-site/`](design/templates/wedding-site/)
como referencia — si el diseño cambia allá, ese archivo es el diff.

El `.dc.html` corre sobre el runtime de Claude Design (React + `support.js` +
`ds-base.js`) y usa una sintaxis propia. La traducción fue:

| En el `.dc.html` | Aquí |
|---|---|
| `ref="{{ heroRef }}"` | `id="jm-hero"` |
| `onClick="{{ openIt }}"` | `addEventListener('click', openIt)` en `site.js` |
| `style-hover="background:#631B29"` | clases `.jm-btn` / `.jm-pill` / … en `site.css` |
| `<helmet>` | el `<head>` del `index.html` |
| `<image-slot src fit="cover">` | `<img class="jm-fill">` con `object-fit:cover` |
| `class Component extends DCLogic` | IIFE en `assets/js/site.js`, método por método |
| `data-props` del panel de edición | el objeto `CONFIG` arriba de `site.js` |

Los `style` inline de cada nodo se conservan tal cual: son el diseño, y
moverlos a clases habría hecho el diff contra el original ilegible.

## Estructura

```
index.html                 markup + estilos inline (igual que el diseño)
site.webmanifest           nombre e iconos para "agregar a inicio"
assets/css/site.css        @font-face, @keyframes, :hover, responsive
assets/js/site.js          toda la lógica: sobre, scroll, cuenta, galería, música
assets/fonts/              las tipografías de marca
assets/icons/              favicons + icono de app
assets/*.png / *.jpeg      ilustraciones, ornamentos y fotos
design/                    el .dc.html original, sin modificar
```

## Iconos

Se generan desde `assets/monogram-mark.png` y son el lacre del sobre:
disco dorado con el monograma en tinta vino. El monograma solo es un
trazo demasiado fino para 16px — se vuelve un manchón — así que el
sello dorado es el que carga el reconocimiento y el monograma va
apareciendo conforme crece el tamaño.

- `favicon.ico` + `favicon-16/32/48.png` — fondo transparente, así se ve
  bien en pestaña clara y en pestaña oscura.
- `apple-touch-icon.png` (180px) — opaco, porque iOS pinta de negro la
  transparencia, y con margen para que el recorte en squircle no muerda
  el lacre. En la pantalla de inicio dice «Jorge & Montse».
- `icon-192/512.png` — Android, `maskable`, con la zona segura del 80%.

Para regenerarlos si cambia el monograma, el script está en el mensaje
del commit que los añadió.

## Configurar

Arriba de `assets/js/site.js` está `CONFIG`, que es el equivalente exacto a
los controles del panel de edición del diseño:

```js
sealColor: 'dorado',           // 'dorado' | 'vino' | 'verde'
backdrop: 'vino',              // 'vino' | 'tinta' | 'verde'
photoTone: 'blanco y negro',   // 'blanco y negro' | 'sepia' | 'color'
floatingDetails: true,         // los destellos dorados
openOnLoad: false,             // saltarse el sobre
musicSrc: '',                  // vacío = usa el src del <audio>
weddingDate: new Date(2027, 0, 30, 17, 0, 0)
```

## Falta llenar

El diseño llegó con textos de relleno a propósito. Están entre corchetes en
`index.html`, así que `grep -n '\[' index.html` los lista todos:

- **Historia** — las tres viñetas (cómo se conocieron, la propuesta, Raava).
- **Hospedaje** — nombre, zona, tarifa y link de los dos hoteles; transporte,
  estacionamiento y aeropuerto.
- **Mesa de regalos** — los tres botones (`liverpool`, `amazon`,
  `lluvia de sobres`) todavía no tienen `href`.
- **RSVP** — el botón «confirmar asistencia» tampoco tiene destino. Falta
  decidir a qué apunta: un formulario, WhatsApp, un mailto.
- **Sedes y horarios** — «Templo de las Rosas», «Hacienda La Huerta», las
  direcciones y las horas vienen del diseño y hay que confirmarlas.

## Assets pendientes

Doce ilustraciones, cuatro fotos, la tipografía de lectura y la música todavía
no están en el repo. **[`assets/README.md`](assets/README.md)** tiene la lista
exacta, dónde se usa cada una y cómo completarlas. El sitio ya funciona sin
ellas: las imágenes que faltan se ocultan solas en vez de salir rotas.

## Accesibilidad y degradación

- Sin JavaScript el sobre se queda lacrado como portada y todo el contenido
  de abajo sigue siendo navegable, con la nav visible.
- Con `prefers-reduced-motion` no hay destellos ni parallax y el sobre se abre
  solo, sin la coreografía.
- El sobre se abre con Enter o Espacio; la galería es de `<button>`; el
  lightbox se cierra con Escape, se navega con las flechas y devuelve el foco
  a la foto de donde salió.
