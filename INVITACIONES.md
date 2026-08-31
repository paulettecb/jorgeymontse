# Links de las invitaciones

Uno por invitación. Cada quien recibe el suyo: el sitio lo saluda por su
nombre, le arma el itinerario que le toca y su confirmación llega ya
identificada, sin que tenga que escribir su nombre.

## Cómo se arma el link

El dominio, diagonal, y el id. Nada más:

```
https://jorgeymontse.com/paloma-cambron
```

Manda siempre el del dominio propio, no el de `jorgeymontse.netlify.app`.
Ese sigue existiendo pero ahora redirige, y una redirección de por medio
es suficiente para que WhatsApp no alcance a armar la tarjeta de la vista
previa. La barra de direcciones conserva el link bonito: por dentro es una
reescritura, no un salto.

La forma vieja, `…/?i=paloma-cambron`, sigue funcionando igual.

Un link mal copiado **no se rompe**: el formulario vuelve a pedir el nombre
a mano, como antes.

## Cómo leer la columna «civil»

A la ceremonia civil no va todo el mundo, así que se elige invitación por
invitación. **Sí** = esa persona ve la ceremonia civil de las 19:30 en su
itinerario. **No** = ve las fotos con los novios. Quien entre sin link ve lo
que diga `CONFIG.bodaCivil` en `site.js`, que hoy es «no».

Hoy están todas en «no» porque todavía no se decide. Se palomea en la tabla
de Notion y de ahí lo paso al código.

## Pruebas

Dos invitaciones de mentiras para ver las dos versiones del itinerario.
**Hay que borrarlas antes de publicar en serio.**

| Link | Quiénes | Civil |
|---|---|---|
| `/jane-doe` | Jane Doe, John Doe | **Sí** |
| `/joe-doe` | Joe Doe, Jane Roe | No |

## Las de verdad

**105 invitaciones · 176 pases**

| # | Link | Se le saluda | Pases | Civil | Quiénes |
|---|---|---|---|---|---|
| 1 | `/jorge-cambron` | Jorge y Elsa | 2 | No | Jorge Cambrón, Elsa Barrales |
| 2 | `/paulette-cambron` | Paulette | 1 | No | Paulette Cambrón |
| 3 | `/norma-barrales` | Norma | 1 | No | Norma Barrales |
| 4 | `/beatriz-barrales` | Beatriz | 1 | No | Beatriz Barrales |
| 5 | `/mariela-lemus` | Mariela | 1 | No | Mariela Lemus |
| 6 | `/claudia-barrales` | Claudia, Alejandro y Leonardo | 3 | No | Claudia Barrales, Alejandro García, Leonardo |
| 7 | `/mariela-barrales` | Mariela | 1 | No | Mariela Barrales |
| 8 | `/andrea-barrales` | Andrea | 1 | No | Andrea Barrales |
| 9 | `/laura-jandete` | Laura | 1 | No | Laura Jandete |
| 10 | `/juan-alvarez` | Juan | 2 | No | Juan Manuel Álvarez, Invitado |
| 11 | `/juan-alvarez-2` | Juan | 1 | No | Juan Manuel Álvarez |
| 12 | `/martha-barrales` | Martha y Evaristo | 2 | No | Martha Barrales, Evaristo Suárez |
| 13 | `/eduardo-suarez` | Eduardo | 1 | No | Eduardo Suárez |
| 14 | `/victor-suarez` | Victor | 1 | No | Victor Suárez |
| 15 | `/carlos-suarez` | Carlos y Mayela | 2 | No | Carlos Suárez, Mayela |
| 16 | `/maria-melena` | María | 1 | No | María Elena Melena |
| 17 | `/hector-cambron` | Héctor y Blanca | 2 | No | Héctor Cambrón, Blanca García |
| 18 | `/laura-cambron` | Laura y Diego | 2 | No | Laura Cambrón, Diego Zepeda Ornelas |
| 19 | `/miguel-cambron` | Miguel | 2 | No | Miguel Cambrón, Invitada |
| 20 | `/pedro-cambron` | Pedro y Olga | 2 | No | Pedro Cambrón, Olga Villalobos |
| 21 | `/paloma-cambron` | Paloma y Sebastián | 2 | No | Paloma Cambrón, Sebastián Vargas Rumbo |
| 22 | `/homero-cambron` | Homero | 1 | No | Homero Cambrón |
| 23 | `/jahir-cambron` | Jahir y Daniela | 2 | No | Jahir Cambrón, Daniela Villanueva |
| 24 | `/carlos-cambron` | Carlos y Sonia | 2 | No | Carlos Cambrón, Sonia Picazo |
| 25 | `/axel-cambron` | Axel | 1 | No | Axel Cambrón |
| 26 | `/catherine-cambron` | Catherine | 1 | No | Catherine Cambrón |
| 27 | `/nancy-cambron` | Nancy y Adalberto | 2 | No | Nancy Cambrón, Adalberto Dominguez |
| 28 | `/fernando-cambron` | Fernando y Ana | 2 | No | Fernando Cambrón, Ana Rodriguez |
| 29 | `/gabriela-cambron` | Gabriela y Arturo | 2 | No | Gabriela Cambrón, Arturo García |
| 30 | `/elsa-cambron` | Elsa | 1 | No | Elsa Cambrón |
| 31 | `/tania-castro` | Tania | 1 | No | Tania Castro |
| 32 | `/enya-castro` | Enya, Daniel y Cristopher | 3 | No | Enya Castro, Daniel Reyes, Cristopher |
| 33 | `/marcia` | Marcia | 2 | No | Marcia, Invitado |
| 34 | `/sebastian-silva` | Sebastián y Esther | 2 | No | Sebastián Silva, Esther Fernández |
| 35 | `/victor-briseno` | Victor | 2 | No | Victor Briseño, invitado |
| 36 | `/max-saling` | Max | 1 | No | Max Saling |
| 37 | `/jorge-bengochea` | Jorge | 1 | No | Jorge Bengochea |
| 38 | `/rodrigo-machorro` | Rodrigo | 1 | No | Rodrigo Machorro |
| 39 | `/alexander-tonilo` | Alexander | 2 | No | Alexander Tonilo, invitado |
| 40 | `/montse-castro` | Montse y Manuel | 2 | No | Montse Castro, Manuel Salgado |
| 41 | `/marco-oseguera` | Marco y Laura | 2 | No | Marco Oseguera, Laura Leal |
| 42 | `/marco-oseguera-elyzabeth` | Marco y Elyzabeth | 2 | No | Marco Oseguera, Elyzabeth Portillo |
| 43 | `/mariana-oseguera` | Mariana y Andrew | 2 | No | Mariana Oseguera, Andrew Chacón |
| 44 | `/lolita-guzman` | Lolita, Cholita y Guerita | 3 | No | Lolita Guzmán, Cholita Guzman, Guerita Guzmán |
| 45 | `/matrin-oseguera` | Matrín y Maricela | 2 | No | Matrín Oseguera, Maricela Arizaga |
| 46 | `/daniela-oseguera` | Daniela | 2 | No | Daniela Oseguera, invitado |
| 47 | `/yesai-oseguera` | Yesai | 2 | No | Yesai Oseguera, invitado |
| 48 | `/andrea-oseguera` | Andrea y Raúl | 2 | No | Andrea Oseguera, Raúl Guerrero |
| 49 | `/miguel-oseguera` | Miguel y Laura | 2 | No | Miguel Ángel Oseguera, Laura Chávez |
| 50 | `/carolina-oseguera` | Carolina, Andrés y Sofía | 3 | No | Carolina Oseguera, Andrés Duran, Sofía Duran |
| 51 | `/miguel-oseguera-alin` | Miguel y Alin | 2 | No | Miguel Oseguera, Alin Zurita |
| 52 | `/manuel-leal` | Manuel y Teresa | 2 | No | Manuel Leal, Teresa Jacinto |
| 53 | `/manuel-leal-areli` | Manuel y Areli | 2 | No | Manuel Leal, Areli |
| 54 | `/teresa-leal` | Teresa y Cristina | 2 | No | Teresa Leal, Cristina |
| 55 | `/raul-leal` | Raúl y Elodia | 2 | No | Raúl Leal, Elodia Guisa |
| 56 | `/ana-leal` | Ana y Manuel | 2 | No | Ana Leal, Manuel García |
| 57 | `/luis-garcia` | Luis y Lizbeth | 2 | No | Luis García, Lizbeth Ramírez |
| 58 | `/emmanuel-garcia` | Emmanuel y Eunice | 2 | No | Emmanuel García, Eunice Rivera |
| 59 | `/mitzi-garcia` | Mitzi y Daniel | 2 | No | Mitzi García, Daniel Cohen |
| 60 | `/robertina-leal` | Robertina | 1 | No | Robertina Leal |
| 61 | `/alvaro-leal` | Álvaro y Angie | 2 | No | Álvaro Leal, Angie |
| 62 | `/martha-leal` | Martha | 1 | No | Martha Leal |
| 63 | `/dante-leal` | Dante | 2 | No | Dante Leal, invitado |
| 64 | `/tamara-leal` | Tamara | 2 | No | Tamara Leal, invitado |
| 65 | `/elva-leal` | Elva | 1 | No | Elva Leal |
| 66 | `/yesira-arizmendi` | Yesira | 1 | No | Yesira Arizmendi |
| 67 | `/yashim-arizmendi` | Yashim y Carla | 2 | No | Yashim Arizmendi, Carla |
| 68 | `/jesian-arizmendi` | Jesian | 2 | No | Jesian Arizmendi, Invitado |
| 69 | `/juanita-leal` | Juanita | 1 | No | Juanita Leal |
| 70 | `/maria-guzman` | María y Ricardo | 2 | No | María de los Ángeles Guzmán, Ricardo Espino |
| 71 | `/abraham-espino` | Abraham | 1 | No | Abraham Espino |
| 72 | `/maria-espino` | María | 1 | No | María de los Ángeles Espino |
| 73 | `/maria-mora` | María | 1 | No | María de los Ángeles Mora |
| 74 | `/vanessa-castillo` | Vanessa y Gabriel | 2 | No | Vanessa Castillo, Gabriel Hernández |
| 75 | `/elena-gutierrez` | Elena y Erick | 2 | No | Elena Gutiérrez, Erick Lujan |
| 76 | `/victor-silva` | Victor | 2 | No | Victor Silva, Invitado |
| 77 | `/lupita-oca` | Lupita y Omar | 2 | No | Lupita Montes de Oca, Omar Contreras |
| 78 | `/melissa-paulin` | Melissa | 2 | No | Melissa Paulín, Invitado |
| 79 | `/montse-romero` | Montse y Salvador | 2 | No | Montse Romero, Salvador Arreola |
| 80 | `/alondra-hernandez` | Alondra | 2 | No | Alondra Hernández, invitado |
| 81 | `/itzel-velazquez` | Itzel | 1 | No | Itzel Velazquez |
| 82 | `/fernando-gutierrez` | Fernando | 2 | No | Fernando Gutiérrez, invitado |
| 83 | `/rosario-leal` | Rosario y Miguel | 2 | No | Rosario Leal, Miguel |
| 84 | `/claudia-lara` | Claudia | 2 | No | Claudia Fernández de Lara, invitado |
| 85 | `/karen-medina` | Karen | 1 | No | Karen Medina |
| 86 | `/ivonne-ambriz` | Ivonne | 1 | No | Ivonne Ambriz |
| 87 | `/paloma-barajas` | Paloma | 2 | No | Paloma Barajas, Invitado |
| 88 | `/valeria-nunez` | Valeria | 1 | No | Valeria Núñez |
| 89 | `/miguel-jimenez` | Miguel | 2 | No | Miguel Jiménez, invitado |
| 90 | `/jonathan-brena` | Jonathan | 1 | No | Jonathan Brena |
| 91 | `/jesus-castro` | Jesús | 1 | No | Jesús Castro |
| 92 | `/escarlette-torres` | Escarlette | 1 | No | Escarlette Torres |
| 93 | `/cielo-gonzalez` | Cielo | 1 | No | Cielo Gónzalez |
| 94 | `/isaias-leal` | Isaias y Gabriela | 2 | No | Isaias Leal, Gabriela |
| 95 | `/sofia-alvizouri` | Sofía | 1 | No | Sofía Alvizouri |
| 96 | `/emiliano-nunez` | Emiliano | 1 | No | Emiliano Núñez |
| 97 | `/maria-bojorges` | María | 1 | No | María Bojorges |
| 98 | `/julieta-villagomez` | Julieta | 1 | No | Julieta Villagomez |
| 99 | `/maria-salas` | María y Jorge | 2 | No | María Elena Salas, Jorge García |
| 100 | `/roxana-solorzano` | Roxana y Abraham | 2 | No | Roxana Solorzano, Abraham García Rojas |
| 101 | `/abraham-garcia` | Abraham y Paulina | 2 | No | Abraham García, Paulina |
| 102 | `/eduardo-diaz` | Eduardo y Veronica | 2 | No | Eduardo Díaz, Veronica Alberto |
| 103 | `/manuel-tapia` | Manuel y Carmen | 2 | No | Manuel Tapia, Carmen Rodríguez |
| 104 | `/fernanda-mariscal` | Fernanda, Rebeca y Ignacio | 3 | No | Fernanda Mariscal, Rebeca Pérez, Ignacio Mariscal |
| 105 | `/alexa-carrillo` | Alexa | 2 | No | Alexa Carrillo, invitado |

## Notas

- «Invitado» / «Invitada» es un acompañante del que todavía no se sabe el nombre:
  cuenta como pase y se puede llenar después. Quedan **18** así.
- Correcciones aplicadas: Carmen, esposa de Manuel Tapia, es **Carmen Rodríguez**;
  Sebastián, el acompañante de Paloma, es **Sebastián Vargas Rumbo**; Diego, el
  acompañante de Laura, es **Diego Zepeda Ornelas**; Daniel, el marido de
  Enya, es **Daniel Reyes**.
- La cuenta del Excel (hoja 1) decía 171 entre invitados y extras; aquí salen
  176 porque cada «Invitado» sin nombre se cuenta como pase.
