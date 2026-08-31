# Links de las invitaciones

Uno por invitación. Cada quien recibe el suyo: el sitio lo saluda por su
nombre, le arma el itinerario que le toca y su confirmación llega ya
identificada, sin que tenga que escribir su nombre.

El dominio va al principio. Si el sitio queda en `jorgeymontse.com`, el link
de la primera fila es `https://jorgeymontse.com/?i=jorge-cambron`.

Un link sin `?i=` —o con un id mal copiado— **no se rompe**: el formulario
vuelve a pedir el nombre a mano, como antes.

## Cómo leer la columna «civil»

A la ceremonia civil no va todo el mundo, así que se elige invitación por
invitación. **Sí** = esa persona ve la ceremonia civil de las 19:30 en su
itinerario. **No** = ve las fotos con los novios. Quien entre sin link ve lo
que diga `CONFIG.bodaCivil` en `site.js`, que hoy es «no».

Hoy están todas en «no» porque todavía no se decide. Para cambiar a alguien
se le pone `civil: true` en `netlify/functions/invitados-datos.mts`.

## Pruebas

Dos invitaciones de mentiras para que los novios vean las dos versiones del
itinerario. **Hay que borrarlas antes de publicar en serio.**

| Link | Quiénes | Civil |
|---|---|---|
| `?i=jane-doe` | Jane Doe, John Doe | **Sí** |
| `?i=joe-doe` | Joe Doe, Jane Roe | No |

## Las de verdad

**105 invitaciones · 176 pases**

| # | Link | Se le saluda | Pases | Civil | Quiénes |
|---|---|---|---|---|---|
| 1 | `?i=jorge-cambron` | Jorge y Elsa | 2 | No | Jorge Cambrón, Elsa Barrales |
| 2 | `?i=paulette-cambron` | Paulette | 1 | No | Paulette Cambrón |
| 3 | `?i=norma-barrales` | Norma | 1 | No | Norma Barrales |
| 4 | `?i=beatriz-barrales` | Beatriz | 1 | No | Beatriz Barrales |
| 5 | `?i=mariela-lemus` | Mariela | 1 | No | Mariela Lemus |
| 6 | `?i=claudia-barrales` | Claudia, Alejandro y Leonardo | 3 | No | Claudia Barrales, Alejandro García, Leonardo |
| 7 | `?i=mariela-barrales` | Mariela | 1 | No | Mariela Barrales |
| 8 | `?i=andrea-barrales` | Andrea | 1 | No | Andrea Barrales |
| 9 | `?i=laura-jandete` | Laura | 1 | No | Laura Jandete |
| 10 | `?i=juan-alvarez` | Juan | 2 | No | Juan Manuel Álvarez, Invitado |
| 11 | `?i=juan-alvarez-2` | Juan | 1 | No | Juan Manuel Álvarez |
| 12 | `?i=martha-barrales` | Martha y Evaristo | 2 | No | Martha Barrales, Evaristo Suárez |
| 13 | `?i=eduardo-suarez` | Eduardo | 1 | No | Eduardo Suárez |
| 14 | `?i=victor-suarez` | Victor | 1 | No | Victor Suárez |
| 15 | `?i=carlos-suarez` | Carlos y Mayela | 2 | No | Carlos Suárez, Mayela |
| 16 | `?i=maria-melena` | María | 1 | No | María Elena Melena |
| 17 | `?i=hector-cambron` | Héctor y Blanca | 2 | No | Héctor Cambrón, Blanca García |
| 18 | `?i=laura-cambron` | Laura y Diego | 2 | No | Laura Cambrón, Diego Zepeda Ornelas |
| 19 | `?i=miguel-cambron` | Miguel | 2 | No | Miguel Cambrón, Invitada |
| 20 | `?i=pedro-cambron` | Pedro y Olga | 2 | No | Pedro Cambrón, Olga Villalobos |
| 21 | `?i=paloma-cambron` | Paloma y Sebastián | 2 | No | Paloma Cambrón, Sebastián Vargas Rumbo |
| 22 | `?i=homero-cambron` | Homero | 1 | No | Homero Cambrón |
| 23 | `?i=jahir-cambron` | Jahir y Daniela | 2 | No | Jahir Cambrón, Daniela Villanueva |
| 24 | `?i=carlos-cambron` | Carlos y Sonia | 2 | No | Carlos Cambrón, Sonia Picazo |
| 25 | `?i=axel-cambron` | Axel | 1 | No | Axel Cambrón |
| 26 | `?i=catherine-cambron` | Catherine | 1 | No | Catherine Cambrón |
| 27 | `?i=nancy-cambron` | Nancy y Adalberto | 2 | No | Nancy Cambrón, Adalberto Dominguez |
| 28 | `?i=fernando-cambron` | Fernando y Ana | 2 | No | Fernando Cambrón, Ana Rodriguez |
| 29 | `?i=gabriela-cambron` | Gabriela y Arturo | 2 | No | Gabriela Cambrón, Arturo García |
| 30 | `?i=elsa-cambron` | Elsa | 1 | No | Elsa Cambrón |
| 31 | `?i=tania-castro` | Tania | 1 | No | Tania Castro |
| 32 | `?i=enia-castro` | Enia, Daniel y Cristopher | 3 | No | Enia Castro, Daniel, Cristopher |
| 33 | `?i=marcia` | Marcia | 2 | No | Marcia, Invitado |
| 34 | `?i=sebastian-silva` | Sebastián y Esther | 2 | No | Sebastián Silva, Esther Fernández |
| 35 | `?i=victor-briseno` | Victor | 2 | No | Victor Briseño, invitado |
| 36 | `?i=max-saling` | Max | 1 | No | Max Saling |
| 37 | `?i=jorge-bengochea` | Jorge | 1 | No | Jorge Bengochea |
| 38 | `?i=rodrigo-machorro` | Rodrigo | 1 | No | Rodrigo Machorro |
| 39 | `?i=alexander-tonilo` | Alexander | 2 | No | Alexander Tonilo, invitado |
| 40 | `?i=montse-castro` | Montse y Manuel | 2 | No | Montse Castro, Manuel Salgado |
| 41 | `?i=marco-oseguera` | Marco y Laura | 2 | No | Marco Oseguera, Laura Leal |
| 42 | `?i=marco-oseguera-elyzabeth` | Marco y Elyzabeth | 2 | No | Marco Oseguera, Elyzabeth Portillo |
| 43 | `?i=mariana-oseguera` | Mariana y Andrew | 2 | No | Mariana Oseguera, Andrew Chacón |
| 44 | `?i=lolita-guzman` | Lolita, Cholita y Guerita | 3 | No | Lolita Guzmán, Cholita Guzman, Guerita Guzmán |
| 45 | `?i=matrin-oseguera` | Matrín y Maricela | 2 | No | Matrín Oseguera, Maricela Arizaga |
| 46 | `?i=daniela-oseguera` | Daniela | 2 | No | Daniela Oseguera, invitado |
| 47 | `?i=yesai-oseguera` | Yesai | 2 | No | Yesai Oseguera, invitado |
| 48 | `?i=andrea-oseguera` | Andrea y Raúl | 2 | No | Andrea Oseguera, Raúl Guerrero |
| 49 | `?i=miguel-oseguera` | Miguel y Laura | 2 | No | Miguel Ángel Oseguera, Laura Chávez |
| 50 | `?i=carolina-oseguera` | Carolina, Andrés y Sofía | 3 | No | Carolina Oseguera, Andrés Duran, Sofía Duran |
| 51 | `?i=miguel-oseguera-alin` | Miguel y Alin | 2 | No | Miguel Oseguera, Alin Zurita |
| 52 | `?i=manuel-leal` | Manuel y Teresa | 2 | No | Manuel Leal, Teresa Jacinto |
| 53 | `?i=manuel-leal-areli` | Manuel y Areli | 2 | No | Manuel Leal, Areli |
| 54 | `?i=teresa-leal` | Teresa y Cristina | 2 | No | Teresa Leal, Cristina |
| 55 | `?i=raul-leal` | Raúl y Elodia | 2 | No | Raúl Leal, Elodia Guisa |
| 56 | `?i=ana-leal` | Ana y Manuel | 2 | No | Ana Leal, Manuel García |
| 57 | `?i=luis-garcia` | Luis y Lizbeth | 2 | No | Luis García, Lizbeth Ramírez |
| 58 | `?i=emmanuel-garcia` | Emmanuel y Eunice | 2 | No | Emmanuel García, Eunice Rivera |
| 59 | `?i=mitzi-garcia` | Mitzi y Daniel | 2 | No | Mitzi García, Daniel Cohen |
| 60 | `?i=robertina-leal` | Robertina | 1 | No | Robertina Leal |
| 61 | `?i=alvaro-leal` | Álvaro y Angie | 2 | No | Álvaro Leal, Angie |
| 62 | `?i=martha-leal` | Martha | 1 | No | Martha Leal |
| 63 | `?i=dante-leal` | Dante | 2 | No | Dante Leal, invitado |
| 64 | `?i=tamara-leal` | Tamara | 2 | No | Tamara Leal, invitado |
| 65 | `?i=elva-leal` | Elva | 1 | No | Elva Leal |
| 66 | `?i=yesira-arizmendi` | Yesira | 1 | No | Yesira Arizmendi |
| 67 | `?i=yashim-arizmendi` | Yashim y Carla | 2 | No | Yashim Arizmendi, Carla |
| 68 | `?i=jesian-arizmendi` | Jesian | 2 | No | Jesian Arizmendi, Invitado |
| 69 | `?i=juanita-leal` | Juanita | 1 | No | Juanita Leal |
| 70 | `?i=maria-guzman` | María y Ricardo | 2 | No | María de los Ángeles Guzmán, Ricardo Espino |
| 71 | `?i=abraham-espino` | Abraham | 1 | No | Abraham Espino |
| 72 | `?i=maria-espino` | María | 1 | No | María de los Ángeles Espino |
| 73 | `?i=maria-mora` | María | 1 | No | María de los Ángeles Mora |
| 74 | `?i=vanessa-castillo` | Vanessa y Gabriel | 2 | No | Vanessa Castillo, Gabriel Hernández |
| 75 | `?i=elena-gutierrez` | Elena y Erick | 2 | No | Elena Gutiérrez, Erick Lujan |
| 76 | `?i=victor-silva` | Victor | 2 | No | Victor Silva, Invitado |
| 77 | `?i=lupita-oca` | Lupita y Omar | 2 | No | Lupita Montes de Oca, Omar Contreras |
| 78 | `?i=melissa-paulin` | Melissa | 2 | No | Melissa Paulín, Invitado |
| 79 | `?i=montse-romero` | Montse y Salvador | 2 | No | Montse Romero, Salvador Arreola |
| 80 | `?i=alondra-hernandez` | Alondra | 2 | No | Alondra Hernández, invitado |
| 81 | `?i=itzel-velazquez` | Itzel | 1 | No | Itzel Velazquez |
| 82 | `?i=fernando-gutierrez` | Fernando | 2 | No | Fernando Gutiérrez, invitado |
| 83 | `?i=rosario-leal` | Rosario y Miguel | 2 | No | Rosario Leal, Miguel |
| 84 | `?i=claudia-lara` | Claudia | 2 | No | Claudia Fernández de Lara, invitado |
| 85 | `?i=karen-medina` | Karen | 1 | No | Karen Medina |
| 86 | `?i=ivonne-ambriz` | Ivonne | 1 | No | Ivonne Ambriz |
| 87 | `?i=paloma-barajas` | Paloma | 2 | No | Paloma Barajas, Invitado |
| 88 | `?i=valeria-nunez` | Valeria | 1 | No | Valeria Núñez |
| 89 | `?i=miguel-jimenez` | Miguel | 2 | No | Miguel Jiménez, invitado |
| 90 | `?i=jonathan-brena` | Jonathan | 1 | No | Jonathan Brena |
| 91 | `?i=jesus-castro` | Jesús | 1 | No | Jesús Castro |
| 92 | `?i=escarlette-torres` | Escarlette | 1 | No | Escarlette Torres |
| 93 | `?i=cielo-gonzalez` | Cielo | 1 | No | Cielo Gónzalez |
| 94 | `?i=isaias-leal` | Isaias y Gabriela | 2 | No | Isaias Leal, Gabriela |
| 95 | `?i=sofia-alvizouri` | Sofía | 1 | No | Sofía Alvizouri |
| 96 | `?i=emiliano-nunez` | Emiliano | 1 | No | Emiliano Núñez |
| 97 | `?i=maria-bojorges` | María | 1 | No | María Bojorges |
| 98 | `?i=julieta-villagomez` | Julieta | 1 | No | Julieta Villagomez |
| 99 | `?i=maria-salas` | María y Jorge | 2 | No | María Elena Salas, Jorge García |
| 100 | `?i=roxana-solorzano` | Roxana y Abraham | 2 | No | Roxana Solorzano, Abraham García Rojas |
| 101 | `?i=abraham-garcia` | Abraham y Paulina | 2 | No | Abraham García, Paulina |
| 102 | `?i=eduardo-diaz` | Eduardo y Veronica | 2 | No | Eduardo Díaz, Veronica Alberto |
| 103 | `?i=manuel-tapia` | Manuel y Carmen | 2 | No | Manuel Tapia, Carmen Rodríguez |
| 104 | `?i=fernanda-mariscal` | Fernanda, Rebeca y Ignacio | 3 | No | Fernanda Mariscal, Rebeca Pérez, Ignacio Mariscal |
| 105 | `?i=alexa-carrillo` | Alexa | 2 | No | Alexa Carrillo, invitado |

## Notas

- «Invitado» / «Invitada» es un acompañante del que todavía no se sabe el nombre:
  cuenta como pase y se puede llenar después. Quedan **18** así.
- Correcciones aplicadas: Carmen, esposa de Manuel Tapia, es **Carmen Rodríguez**;
  Sebastián, el acompañante de Paloma, es **Sebastián Vargas Rumbo**; Diego, el
  acompañante de Laura, es **Diego Zepeda Ornelas**.
- La cuenta del Excel (hoja 1) decía 171 entre invitados y extras; aquí salen
  176 porque cada «Invitado» sin nombre se cuenta como pase.
