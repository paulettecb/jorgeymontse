/**
 * La lista de invitaciones. Una por familia o persona: cada una tiene su
 * `id`, que es lo que va en el link personalizado (jorgeymontse.com/?i=id).
 *
 * Vive aquí y no en `assets/` a propósito: son nombres de gente real y
 * este archivo nunca se sirve al navegador. El sitio no descarga la lista;
 * pregunta por un id a `/api/invitacion` y sólo recibe esa invitación.
 * (`netlify.toml` además bloquea /netlify/* por si acaso, porque el
 * `publish` del proyecto es la raíz del repo.)
 *
 * Salió de la hoja «Invitaciones» del Excel de los novios, más las
 * correcciones que mandaron después:
 *   - Carmen, esposa de Manuel Tapia, es Carmen Rodríguez.
 *   - Sebastián, el acompañante de Paloma Cambrón, es Sebastián Vargas Rumbo.
 *   - Diego, el acompañante de Laura Cambrón, es Diego Zepeda Ornelas.
 *   - Daniel, el marido de Enya Castro, es Daniel Reyes.
 *
 * Esos dos últimos eran apellidos que faltaban de acompañantes que ya
 * estaban en la lista, no invitaciones nuevas.
 *
 * «Invitado» / «Invitada» es un acompañante del que todavía no se sabe el
 * nombre: cuenta como pase, pero no se saluda por su nombre.
 *
 * Los ids son nombre + último apellido. Cuando dos invitaciones coinciden
 * (padre e hijo con el mismo nombre) se desempata con el acompañante:
 * marco-oseguera y marco-oseguera-elyzabeth.
 */
export type Invitacion = {
  id: string;
  saludo: string;
  pases: number;
  invitados: string[];
  /** A la ceremonia civil no va todo el mundo. `true` = esta invitación
   *  ve la civil de las 19:30 en el itinerario; `false` o sin poner, ve
   *  las fotos con los novios. Quien entre sin link personalizado ve lo
   *  que diga CONFIG.bodaCivil en site.js. */
  civil?: boolean;
};

export const INVITACIONES: Invitacion[] = [
  { id: "jorge-cambron", saludo: "Jorge y Elsa", pases: 2, invitados: ["Jorge Cambrón", "Elsa Barrales"] },
  { id: "paulette-cambron", saludo: "Paulette", pases: 1, invitados: ["Paulette Cambrón"] },
  { id: "norma-barrales", saludo: "Norma", pases: 1, invitados: ["Norma Barrales"] },
  { id: "beatriz-barrales", saludo: "Beatriz", pases: 1, invitados: ["Beatriz Barrales"] },
  { id: "mariela-lemus", saludo: "Mariela", pases: 1, invitados: ["Mariela Lemus"] },
  { id: "claudia-barrales", saludo: "Claudia, Alejandro y Leonardo", pases: 3, invitados: ["Claudia Barrales", "Alejandro García", "Leonardo"] },
  { id: "mariela-barrales", saludo: "Mariela", pases: 1, invitados: ["Mariela Barrales"] },
  { id: "andrea-barrales", saludo: "Andrea", pases: 1, invitados: ["Andrea Barrales"] },
  { id: "laura-jandete", saludo: "Laura", pases: 1, invitados: ["Laura Jandete"] },
  { id: "juan-alvarez", saludo: "Juan", pases: 2, invitados: ["Juan Manuel Álvarez", "Invitado"] },
  { id: "juan-alvarez-2", saludo: "Juan", pases: 1, invitados: ["Juan Manuel Álvarez"] },
  { id: "martha-barrales", saludo: "Martha y Evaristo", pases: 2, invitados: ["Martha Barrales", "Evaristo Suárez"] },
  { id: "eduardo-suarez", saludo: "Eduardo", pases: 1, invitados: ["Eduardo Suárez"] },
  { id: "victor-suarez", saludo: "Victor", pases: 1, invitados: ["Victor Suárez"] },
  { id: "carlos-suarez", saludo: "Carlos y Mayela", pases: 2, invitados: ["Carlos Suárez", "Mayela"] },
  { id: "maria-melena", saludo: "María", pases: 1, invitados: ["María Elena Melena"] },
  { id: "hector-cambron", saludo: "Héctor y Blanca", pases: 2, invitados: ["Héctor Cambrón", "Blanca García"] },
  { id: "laura-cambron", saludo: "Laura y Diego", pases: 2, invitados: ["Laura Cambrón", "Diego Zepeda Ornelas"] },
  { id: "miguel-cambron", saludo: "Miguel", pases: 2, invitados: ["Miguel Cambrón", "Invitada"] },
  { id: "pedro-cambron", saludo: "Pedro y Olga", pases: 2, invitados: ["Pedro Cambrón", "Olga Villalobos"] },
  { id: "paloma-cambron", saludo: "Paloma y Sebastián", pases: 2, invitados: ["Paloma Cambrón", "Sebastián Vargas Rumbo"] },
  { id: "homero-cambron", saludo: "Homero", pases: 1, invitados: ["Homero Cambrón"] },
  { id: "jahir-cambron", saludo: "Jahir y Daniela", pases: 2, invitados: ["Jahir Cambrón", "Daniela Villanueva"] },
  { id: "carlos-cambron", saludo: "Carlos y Sonia", pases: 2, invitados: ["Carlos Cambrón", "Sonia Picazo"] },
  { id: "axel-cambron", saludo: "Axel", pases: 1, invitados: ["Axel Cambrón"] },
  { id: "catherine-cambron", saludo: "Catherine", pases: 1, invitados: ["Catherine Cambrón"] },
  { id: "nancy-cambron", saludo: "Nancy y Adalberto", pases: 2, invitados: ["Nancy Cambrón", "Adalberto Dominguez"] },
  { id: "fernando-cambron", saludo: "Fernando y Ana", pases: 2, invitados: ["Fernando Cambrón", "Ana Rodriguez"] },
  { id: "gabriela-cambron", saludo: "Gabriela y Arturo", pases: 2, invitados: ["Gabriela Cambrón", "Arturo García"] },
  { id: "elsa-cambron", saludo: "Elsa", pases: 1, invitados: ["Elsa Cambrón"] },
  { id: "tania-castro", saludo: "Tania", pases: 1, invitados: ["Tania Castro"] },
  { id: "enya-castro", saludo: "Enya, Daniel y Cristopher", pases: 3, invitados: ["Enya Castro", "Daniel Reyes", "Cristopher"] },
  { id: "marcia", saludo: "Marcia", pases: 2, invitados: ["Marcia", "Invitado"] },
  { id: "sebastian-silva", saludo: "Sebastián y Esther", pases: 2, invitados: ["Sebastián Silva", "Esther Fernández"] },
  { id: "victor-briseno", saludo: "Victor", pases: 2, invitados: ["Victor Briseño", "invitado"] },
  { id: "max-saling", saludo: "Max", pases: 1, invitados: ["Max Saling"] },
  { id: "jorge-bengochea", saludo: "Jorge", pases: 1, invitados: ["Jorge Bengochea"] },
  { id: "rodrigo-machorro", saludo: "Rodrigo", pases: 1, invitados: ["Rodrigo Machorro"] },
  { id: "alexander-tonilo", saludo: "Alexander", pases: 2, invitados: ["Alexander Tonilo", "invitado"] },
  { id: "montse-castro", saludo: "Montse y Manuel", pases: 2, invitados: ["Montse Castro", "Manuel Salgado"] },
  { id: "marco-oseguera", saludo: "Marco y Laura", pases: 2, invitados: ["Marco Oseguera", "Laura Leal"] },
  { id: "marco-oseguera-elyzabeth", saludo: "Marco y Elyzabeth", pases: 2, invitados: ["Marco Oseguera", "Elyzabeth Portillo"] },
  { id: "mariana-oseguera", saludo: "Mariana y Andrew", pases: 2, invitados: ["Mariana Oseguera", "Andrew Chacón"] },
  { id: "lolita-guzman", saludo: "Lolita, Cholita y Guerita", pases: 3, invitados: ["Lolita Guzmán", "Cholita Guzman", "Guerita Guzmán"] },
  { id: "matrin-oseguera", saludo: "Matrín y Maricela", pases: 2, invitados: ["Matrín Oseguera", "Maricela Arizaga"] },
  { id: "daniela-oseguera", saludo: "Daniela", pases: 2, invitados: ["Daniela Oseguera", "invitado"] },
  { id: "yesai-oseguera", saludo: "Yesai", pases: 2, invitados: ["Yesai Oseguera", "invitado"] },
  { id: "andrea-oseguera", saludo: "Andrea y Raúl", pases: 2, invitados: ["Andrea Oseguera", "Raúl Guerrero"] },
  { id: "miguel-oseguera", saludo: "Miguel y Laura", pases: 2, invitados: ["Miguel Ángel Oseguera", "Laura Chávez"] },
  { id: "carolina-oseguera", saludo: "Carolina, Andrés y Sofía", pases: 3, invitados: ["Carolina Oseguera", "Andrés Duran", "Sofía Duran"] },
  { id: "miguel-oseguera-alin", saludo: "Miguel y Alin", pases: 2, invitados: ["Miguel Oseguera", "Alin Zurita"] },
  { id: "manuel-leal", saludo: "Manuel y Teresa", pases: 2, invitados: ["Manuel Leal", "Teresa Jacinto"] },
  { id: "manuel-leal-areli", saludo: "Manuel y Areli", pases: 2, invitados: ["Manuel Leal", "Areli"] },
  { id: "teresa-leal", saludo: "Teresa y Cristina", pases: 2, invitados: ["Teresa Leal", "Cristina"] },
  { id: "raul-leal", saludo: "Raúl y Elodia", pases: 2, invitados: ["Raúl Leal", "Elodia Guisa"] },
  { id: "ana-leal", saludo: "Ana y Manuel", pases: 2, invitados: ["Ana Leal", "Manuel García"] },
  { id: "luis-garcia", saludo: "Luis y Lizbeth", pases: 2, invitados: ["Luis García", "Lizbeth Ramírez"] },
  { id: "emmanuel-garcia", saludo: "Emmanuel y Eunice", pases: 2, invitados: ["Emmanuel García", "Eunice Rivera"] },
  { id: "mitzi-garcia", saludo: "Mitzi y Daniel", pases: 2, invitados: ["Mitzi García", "Daniel Cohen"] },
  { id: "robertina-leal", saludo: "Robertina", pases: 1, invitados: ["Robertina Leal"] },
  { id: "alvaro-leal", saludo: "Álvaro y Angie", pases: 2, invitados: ["Álvaro Leal", "Angie"] },
  { id: "martha-leal", saludo: "Martha", pases: 1, invitados: ["Martha Leal"] },
  { id: "dante-leal", saludo: "Dante", pases: 2, invitados: ["Dante Leal", "invitado"] },
  { id: "tamara-leal", saludo: "Tamara", pases: 2, invitados: ["Tamara Leal", "invitado"] },
  { id: "elva-leal", saludo: "Elva", pases: 1, invitados: ["Elva Leal"] },
  { id: "yesira-arizmendi", saludo: "Yesira", pases: 1, invitados: ["Yesira Arizmendi"] },
  { id: "yashim-arizmendi", saludo: "Yashim y Carla", pases: 2, invitados: ["Yashim Arizmendi", "Carla"] },
  { id: "jesian-arizmendi", saludo: "Jesian", pases: 2, invitados: ["Jesian Arizmendi", "Invitado"] },
  { id: "juanita-leal", saludo: "Juanita", pases: 1, invitados: ["Juanita Leal"] },
  { id: "maria-guzman", saludo: "María y Ricardo", pases: 2, invitados: ["María de los Ángeles Guzmán", "Ricardo Espino"] },
  { id: "abraham-espino", saludo: "Abraham", pases: 1, invitados: ["Abraham Espino"] },
  { id: "maria-espino", saludo: "María", pases: 1, invitados: ["María de los Ángeles Espino"] },
  { id: "maria-mora", saludo: "María", pases: 1, invitados: ["María de los Ángeles Mora"] },
  { id: "vanessa-castillo", saludo: "Vanessa y Gabriel", pases: 2, invitados: ["Vanessa Castillo", "Gabriel Hernández"] },
  { id: "elena-gutierrez", saludo: "Elena y Erick", pases: 2, invitados: ["Elena Gutiérrez", "Erick Lujan"] },
  { id: "victor-silva", saludo: "Victor", pases: 2, invitados: ["Victor Silva", "Invitado"] },
  { id: "lupita-oca", saludo: "Lupita y Omar", pases: 2, invitados: ["Lupita Montes de Oca", "Omar Contreras"] },
  { id: "melissa-paulin", saludo: "Melissa", pases: 2, invitados: ["Melissa Paulín", "Invitado"] },
  { id: "montse-romero", saludo: "Montse y Salvador", pases: 2, invitados: ["Montse Romero", "Salvador Arreola"] },
  { id: "alondra-hernandez", saludo: "Alondra", pases: 2, invitados: ["Alondra Hernández", "invitado"] },
  { id: "itzel-velazquez", saludo: "Itzel", pases: 1, invitados: ["Itzel Velazquez"] },
  { id: "fernando-gutierrez", saludo: "Fernando", pases: 2, invitados: ["Fernando Gutiérrez", "invitado"] },
  { id: "rosario-leal", saludo: "Rosario y Miguel", pases: 2, invitados: ["Rosario Leal", "Miguel"] },
  { id: "claudia-lara", saludo: "Claudia", pases: 2, invitados: ["Claudia Fernández de Lara", "invitado"] },
  { id: "karen-medina", saludo: "Karen", pases: 1, invitados: ["Karen Medina"] },
  { id: "ivonne-ambriz", saludo: "Ivonne", pases: 1, invitados: ["Ivonne Ambriz"] },
  { id: "paloma-barajas", saludo: "Paloma", pases: 2, invitados: ["Paloma Barajas", "Invitado"] },
  { id: "valeria-nunez", saludo: "Valeria", pases: 1, invitados: ["Valeria Núñez"] },
  { id: "miguel-jimenez", saludo: "Miguel", pases: 2, invitados: ["Miguel Jiménez", "invitado"] },
  { id: "jonathan-brena", saludo: "Jonathan", pases: 1, invitados: ["Jonathan Brena"] },
  { id: "jesus-castro", saludo: "Jesús", pases: 1, invitados: ["Jesús Castro"] },
  { id: "escarlette-torres", saludo: "Escarlette", pases: 1, invitados: ["Escarlette Torres"] },
  { id: "cielo-gonzalez", saludo: "Cielo", pases: 1, invitados: ["Cielo Gónzalez"] },
  { id: "isaias-leal", saludo: "Isaias y Gabriela", pases: 2, invitados: ["Isaias Leal", "Gabriela"] },
  { id: "sofia-alvizouri", saludo: "Sofía", pases: 1, invitados: ["Sofía Alvizouri"] },
  { id: "emiliano-nunez", saludo: "Emiliano", pases: 1, invitados: ["Emiliano Núñez"] },
  { id: "maria-bojorges", saludo: "María", pases: 1, invitados: ["María Bojorges"] },
  { id: "julieta-villagomez", saludo: "Julieta", pases: 1, invitados: ["Julieta Villagomez"] },
  { id: "maria-salas", saludo: "María y Jorge", pases: 2, invitados: ["María Elena Salas", "Jorge García"] },
  { id: "roxana-solorzano", saludo: "Roxana y Abraham", pases: 2, invitados: ["Roxana Solorzano", "Abraham García Rojas"] },
  { id: "abraham-garcia", saludo: "Abraham y Paulina", pases: 2, invitados: ["Abraham García", "Paulina"] },
  { id: "eduardo-diaz", saludo: "Eduardo y Veronica", pases: 2, invitados: ["Eduardo Díaz", "Veronica Alberto"] },
  { id: "manuel-tapia", saludo: "Manuel y Carmen", pases: 2, invitados: ["Manuel Tapia", "Carmen Rodríguez"] },
  { id: "fernanda-mariscal", saludo: "Fernanda, Rebeca y Ignacio", pases: 3, invitados: ["Fernanda Mariscal", "Rebeca Pérez", "Ignacio Mariscal"] },
  { id: "alexa-carrillo", saludo: "Alexa", pases: 2, invitados: ["Alexa Carrillo", "invitado"] },

  /* Dos invitaciones de mentiras, para que los novios prueben cómo se ve
     el itinerario con y sin ceremonia civil. Los nombres son obviamente
     falsos a propósito. Borrar antes de publicar de verdad. */
  { id: "jane-doe", saludo: "Jane", pases: 2, invitados: ["Jane Doe", "John Doe"], civil: true },
  { id: "joe-doe", saludo: "Joe", pases: 2, invitados: ["Joe Doe", "Jane Roe"], civil: false }
];

export const POR_ID = new Map(INVITACIONES.map(i => [i.id, i]));
