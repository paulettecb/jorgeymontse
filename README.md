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

bienvenidos · cuenta regresiva · la boda · itinerario · vestimenta ·
solo adultos · hospedaje · galería · mesa de regalos · RSVP ·
mensaje para los novios

«La boda» son dos tarjetas de papel sobre un lino, una por sede, como las
invitaciones impresas que pasaron los novios. El lino es CSS —dos tramas de
rayas cruzadas y una mancha de `feTurbulence`— y no una foto: pesa unos
cientos de bytes en vez de cientos de kilobytes en una sección que va arriba
del todo. Viene en beige y en verde; se cambia con `CONFIG.detallesFondo` o
con el atributo `data-fondo` de la sección. Los novios escogieron beige.

El mismo lino aparece una segunda vez, en «tu opinión nos importa», dentro
de la sección de confirmar: ese bloque era vino sobre vino y se perdía. Ahí
el lino no lleva tarjeta encima, es la superficie misma, y todo lo de
adentro se repinta —los campos del formulario están escritos para el vino y
ese fondo es claro.

La cuenta regresiva se cambia sola por un mensaje de agradecimiento cuando
pasa la fecha de la boda.

Cuando la invitación termina de crecer y ocupa toda la pantalla, el fondo
blanco se cambia por una foto del save the date (los novios desenfocados con
la iglesia atrás), debajo de un velo crema. Nada del contenido se mueve: el
monograma, los nombres y la fecha quedan igual. Ver
[`assets/README.md`](assets/README.md).

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
assets/boda*.ics           el itinerario para el calendario, generado
design/                    el .dc.html original, los generadores de assets
pruebas/                   servidor local y repaso de lo que pidieron los novios
```

## Probarlo sin desplegar

```
python3 pruebas/servidor.py     # http://127.0.0.1:8766, contraseña «prueba»
node    pruebas/regresion.mjs   # repasa punto por punto lo que pidieron
```

El servidor imita lo que en producción hacen Netlify y sus funciones: las
reescrituras de `netlify.toml`, los links bonitos, las tres APIs con datos
de mentiras, la vista previa con el nombre del invitado, y —esto es lo que
más ha servido— el filtro de Netlify Forms, que sólo se queda con los
campos escritos en `index.html`. Un campo que estrene su `name` desde
JavaScript se cae aquí igual que se caería allá.

El repaso comprueba sobre la página **pintada**, no sobre el HTML. Empieza
revisando que cada clase que usa el HTML tenga al menos una regla en el
CSS, porque una vez se borró sin querer todo el CSS de «los detalles» y la
sección siguió estando en el DOM, completa y con sus clases, pero saliendo
en blanco y con el dibujo de la iglesia del tamaño de la pantalla.

Dos cosas de `assets/` no se editan a mano, se generan:

| Qué | Con qué |
|---|---|
| Los lacres SVG | `python3 design/sello.py assets` |
| `boda.ics` y `boda-civil.ics` | `python3 design/calendario.py assets` |

El del calendario existe porque los horarios ya se movieron dos veces y
editar a mano dos archivos con el plegado de RFC 5545 —75 **octetos** por
renglón, CRLF, horas en UTC— es justo donde se cuelan los errores. Los
horarios se escriben una vez, en hora de Morelia, y los dos archivos salen
solos.

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

## Invitaciones personalizadas

Cada invitación tiene su link: `…/jorge-cambron`. Con él, la sección de
confirmar ya sabe quién es —lo saluda por su nombre, le dice cuántos pases
trae y le prellena a sus acompañantes— y la confirmación llega identificada
sin que nadie escriba su nombre.

**Sin link, no hay sección de confirmar.** Los pases los controlan los
novios, y en un link genérico cualquiera podría escribir el nombre y los
lugares que quisiera. Así que sin `?i=` —o con un id que no existe— la
sección entera se oculta, junto con el botón «confirmar» de la nav, que si
no apuntaría a la nada. El formulario se queda en el HTML aunque no se vea:
Netlify Forms lo detecta leyendo el archivo, no la página pintada.

Ese botón de la nav vive sólo en compu. En el teléfono flotaba encima del
contenido durante todo el scroll y los novios pidieron quitarlo: abajo de
900 px la nav se queda nada más con el monograma, que regresa arriba.

- La lista vive en [`netlify/functions/invitados-datos.mts`](netlify/functions/invitados-datos.mts),
  del lado del servidor. **No se publica**: son nombres de gente real, y el
  sitio nunca descarga la lista completa — le pregunta a `/api/invitacion`
  por un id y sólo recibe esa invitación.
- Los links para repartir están en [`INVITACIONES.md`](INVITACIONES.md).
- El link bonito (`/jorge-cambron`) es una reescritura de Netlify a
  `/index.html` con status 200, así que la barra de direcciones lo conserva.
  Como entonces no hay `?i=` que leer, `personalizar()` en `site.js` saca el
  id de la ruta cuando no viene en la query. La forma vieja sigue sirviendo.
  Funciona con cualquier dominio, el de Netlify incluido.
- Para cambiar la lista se edita el `.mts` y se regenera el `.md`.
- **La ceremonia civil se elige invitación por invitación.** A la civil no va
  todo el mundo, así que cada invitación trae un campo `civil`: si es `true`,
  esa persona ve la ceremonia civil de las 18:20 en su itinerario, entre la
  iglesia y la llegada al jardín; si no, esa fila no aparece. Quien entre sin
  link personalizado ve lo que diga `CONFIG.bodaCivil`, y el panel puede pisar
  el valor por invitación. Las fotos con los novios de las 19:30 las ve todo
  el mundo: antes eran la alternativa de la civil, hasta que los novios la
  movieron más temprano.
- Hay dos invitaciones de prueba, `jane-doe` (civil sí) y `joe-doe` (civil no),
  para enseñarles a los novios las dos versiones. **Borrarlas antes de
  publicar de verdad.**

## El panel

`/panel`, con la contraseña de `PANEL_PASSWORD`. Cuatro cosas:

- **Invitaciones** — las 105, hayan contestado o no, con su estado
  (confirmada / sin contestar / no asiste) y un botón para copiar el link
  de cada una. Sirve para ver quién falta y para reenviarle su link a quien
  lo pierda.
- **Confirmaciones** — lo que llega del formulario, con buscador.
- **Mesas** — el acomodo. Se pueden sentar **todas** las invitaciones, no
  sólo las que ya confirmaron: los que faltan aparecen con su fondo rayado
  y sus pases reservados, para poder armar las mesas desde ahora. Los que
  dijeron que no, no aparecen.
- **Libro de recuerdos** — todo lo que le escribieron a los novios, para
  leerlo. No hay nada que escoger: es una vista de lectura. Arriba los
  recados de la sección nueva; abajo, en recuadro punteado, los mensajes que
  en su momento llegaron dentro de una confirmación.

En la tabla de confirmaciones también se ve quién contestó dos veces: la
respuesta vieja se queda a la vista, tachada y marcada «reemplazada», y
fuera de la cuenta de personas.

## El recado

El mensaje que cada invitación le deja a los novios. Tiene su propia
sección y su propia función, `POST /api/recado`, y **no pasa por Netlify
Forms**. Eso es a propósito: cuando era un campo más del formulario de
confirmar,

1. sólo se podía escribir al confirmar —quien ya había confirmado no volvía
   a ver el campo nunca—, y
2. volver a mandarlo creaba **otra confirmación**. Escribir un mensaje
   dejaba dos respuestas de la misma persona y el panel tenía que adivinar
   cuál valía.

Ahora hay un recado por invitación, en el store `recados` bajo
`porInvitacion/<id>`, y se pisa. Se puede escribir sin haber confirmado,
volver a entrar y editarlo, y guardar dos veces deja un recado, no dos.
`/api/invitacion` lo devuelve para que el sitio lo pinte en la caja.

Quién puede escribir: cualquiera que tenga el link de esa invitación, que
es el mismo nivel de confianza que ya tenía confirmar. El link es el
secreto; no hay uno más fuerte que inventar.

**Estos recados no se publican en ningún lado.** Son para Jorge y Montse,
que los van a leer todos juntos al final, de sorpresa. El panel es el único
sitio donde salen, y va detrás de contraseña. Por eso el campo del sitio
puede prometer «Sólo lo leen Jorge y Montse» sin letra chiquita: es verdad,
y no hace falta ni casilla de privacidad ni curaduría que administrar.

Hubo una versión con libro público, casilla de «mejor que sea sólo para
ustedes» y aprobación uno por uno en el panel. Se quitó entera cuando los
novios dijeron que no iban a escoger nada. Si algún día quieren publicarlos,
está en el historial de git — pero entonces hay que volver a pedir permiso,
porque el texto de arriba promete lo contrario.

## Configurar

Arriba de `assets/js/site.js` está `CONFIG`, que es el equivalente exacto a
los controles del panel de edición del diseño:

```js
sealColor: 'verde',            // 'dorado' | 'vino' | 'verde'
backdrop: 'vino',              // 'vino' | 'tinta' | 'verde'
photoTone: 'blanco y negro',   // 'blanco y negro' | 'sepia' | 'color'
floatingDetails: false,        // los destellos (los novios los quitaron)
openOnLoad: false,             // saltarse el sobre
musicSrc: '',                  // vacío = usa el src del <audio>
bodaCivil: false,              // valor de fábrica; el panel lo pisa por
                               // invitación. true = sale la civil de las 18:20
detallesFondo: 'beige',        // el lino de «los detalles»: 'beige' | 'verde'
weddingDate: new Date(2027, 0, 30, 16, 0, 0)
```

## Apagado a la espera de datos

Una cosa está **oculta, no borrada**, para poder mandar las invitaciones
sin esperarla. Se enciende quitando el `hidden`; búscala por el
comentario `PENDIENTE`.

| Qué | Dónde | Qué falta |
|---|---|---|
| Sección de hospedaje (y su link en la nav) | `index.html` | Nombre, zona, tarifa y link de los dos hoteles |

El botón de Liverpool sí está encendido: su link funciona. No hay mesa de
Amazon y no va a haberla, así que ese botón se borró: no está oculto
esperando un link.

## Falta llenar

Los datos que faltan están entre corchetes en `index.html`, así que
`grep -n '\[' index.html` los lista todos:

- **Frase de bienvenida** — está la frase base de los novios; quieren una
  versión más cursi antes de publicar.
- **Hospedaje** — nombre, zona, tarifa y link de los dos hoteles; y el
  bloque del aeropuerto.
- **Boda civil** — ya no es un pendiente de código: se prende por invitación
  desde el panel y `CONFIG.bodaCivil` es sólo el valor de fábrica.

Las sedes y horarios ya son los reales: Templo del Carmen a las 16:00 y
Jardín Los Magueyes a las 19:00. El itinerario completo va 16:00 iglesia ·
18:20 civil (sólo para quien va) · 19:00 recepción · 19:30 fotos · 20:00 entrada
· 20:30 cena · 21:30 fiesta.

## Assets

Las ilustraciones, fotos, tipografías y la música ya están en el repo
(subidas desde el proyecto de diseño). **[`assets/README.md`](assets/README.md)**
tiene la lista de qué se usa dónde. Si algún archivo llegara a faltar, el
sitio no se rompe: las imágenes que no cargan se ocultan solas.

Los iconos del itinerario (iglesia, cámara, entrada, pastel y acta civil)
son SVG dibujados a mano directamente en `index.html`, en el mismo trazo
crema de las ilustraciones `-dk`. Los dos renglones de Raava —la copa de
martini a las 19:00 y los lentes a las 21:30— sí son ilustraciones: los
objetos van como icono de línea y la perra como dibujo.

## Accesibilidad y degradación

- Sin JavaScript el sobre se queda lacrado como portada y todo el contenido
  de abajo sigue siendo navegable, con la nav visible.
- Con `prefers-reduced-motion` no hay destellos ni parallax y el sobre se abre
  solo, sin la coreografía.
- El sobre se abre con Enter o Espacio; la galería es de `<button>`; el
  lightbox se cierra con Escape, se navega con las flechas y devuelve el foco
  a la foto de donde salió.
