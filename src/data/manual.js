import { PLL, PLL_2LOOK } from './pll.js';
import { OLL } from './oll.js';
import { F2L_BASIC } from './f2l.js';
import { PARITY_4X4 } from './parity.js';

// Contenido del manual del método Fridrich (CFOP).
// stage: etapa que se ilustra con el cubo (ver STAGES en lib/cube.js).
// trainer: set del entrenador para practicar esa etapa.

export const METHODS = {
  full: {
    label: 'Fridrich completo',
    intro: [
      'El método Fridrich, también llamado CFOP, lo popularizó Jessica Fridrich y es el más usado en speedcubing. Resuelve el cubo por capas en cuatro etapas: Cruz, F2L, OLL y PLL.',
      'La versión completa usa 78 algoritmos (57 de OLL y 21 de PLL) además de los casos de F2L. Una resolución promedio ronda los 55 a 60 movimientos.',
    ],
    steps: [
      {
        title: '1. Cruz',
        stage: 'cross',
        goal: 'Cruz blanca abajo, con cada arista alineada con su centro.',
        text: [
          'Se resuelve de forma intuitiva, sin algoritmos. La idea es llevar las cuatro aristas blancas a la cara de abajo en el orden correcto.',
        ],
        tips: [
          'Planifica la cruz completa durante los 15 s de inspección.',
          'Meta: 8 movimientos o menos.',
          'Hazla directamente abajo para no tener que girar el cubo y ver mejor los pares del F2L.',
        ],
      },
      {
        title: '2. F2L (primeras dos capas)',
        stage: 'f2l',
        goal: 'Las dos capas de abajo completas.',
        text: [
          'Se empareja cada esquina blanca con su arista del segundo nivel y se insertan juntas en su hueco. Son cuatro pares.',
          'Existen 41 casos, pero casi todos se entienden de forma intuitiva a partir de estos movimientos básicos.',
        ],
        tips: [
          'Mientras insertas un par, busca el siguiente.',
          'Evita rotar el cubo: acomoda el par con giros de U.',
          'Usa los huecos vacíos para armar pares difíciles.',
        ],
        algs: F2L_BASIC,
        trainer: 'f2l',
      },
      {
        title: '3. OLL (orientar la última capa)',
        stage: 'oll',
        goal: 'La cara de arriba toda amarilla, en un solo algoritmo.',
        text: [
          'Hay 57 casos. Se reconocen por la forma que hacen los stickers amarillos arriba y en los lados de la última capa.',
          'Lo habitual es empezar con los 10 algoritmos de OLL en dos pasos (ver Fridrich reducido) y sumar los casos completos de a poco.',
        ],
        tips: ['Aprende primero los casos que más te aparecen, como Sune y Antisune.'],
        algs: OLL,
        trainer: 'oll',
      },
      {
        title: '4. PLL (permutar la última capa)',
        stage: 'solved',
        goal: 'Cubo resuelto: cada pieza de la última capa en su lugar.',
        text: [
          'Hay 21 casos. Se reconocen mirando dos lados de la última capa: los "faros" (dos esquinas del mismo color en un lado) y los bloques de colores.',
          'Al terminar suele hacer falta un último giro de U para alinear la capa (AUF).',
        ],
        tips: ['Los 21 PLL son lo primero que conviene aprender completo: es el paso que más tiempo ahorra.'],
        algs: PLL,
        trainer: 'pll',
      },
    ],
  },
  reduced: {
    label: 'Fridrich reducido',
    intro: [
      'Es la forma de aprender Fridrich con pocos algoritmos: OLL y PLL se hacen en dos pasos cada uno ("2-look"). Son 16 algoritmos más 4 inserciones básicas de F2L.',
      'Usa unos 70 a 80 movimientos. Con práctica permite bajar de 30 s, y con un buen F2L, de 20 s.',
    ],
    steps: [
      {
        title: '1. Cruz',
        stage: 'cross',
        goal: 'Cruz blanca abajo, alineada con los centros.',
        text: ['Igual que en el método completo: intuitiva y sin algoritmos.'],
        tips: ['Al principio está bien hacerla arriba y después girar el cubo; luego practica hacerla abajo.'],
      },
      {
        title: '2. F2L intuitivo',
        stage: 'f2l',
        goal: 'Las dos capas de abajo completas, par por par.',
        text: [
          'Para cada par: saca la esquina y la arista a la capa de arriba, júntalas con giros de U y mételas en su hueco con uno de estos cuatro casos.',
        ],
        tips: ["Si una pieza está atrapada en otro hueco, sácala con R U R' (o su espejo) y sigue."],
        algs: F2L_BASIC,
        trainer: 'f2l',
      },
      {
        title: '3. OLL paso 1: cruz amarilla',
        stage: 'f2l',
        goal: 'Cruz amarilla arriba (sin importar las esquinas).',
        text: [
          'Mira las aristas amarillas de arriba. Línea: ponla horizontal. L: ponla con las aristas amarillas adelante y a la derecha. Punto: haz el algoritmo de dos partes.',
        ],
        algs: OLL.filter((o) => o.group === 'Cruz'),
        trainer: 'oll',
      },
      {
        title: '4. OLL paso 2: esquinas',
        stage: 'oll',
        goal: 'Toda la cara de arriba amarilla.',
        text: ['Con la cruz hecha quedan 7 casos según hacia dónde miran las esquinas amarillas.'],
        tips: ['Sune y Antisune son los más comunes: apréndelos primero.'],
        algs: OLL.filter((o) => o.group === 'Esquinas'),
        trainer: 'oll',
      },
      {
        title: '5. PLL paso 1: esquinas',
        stage: 'oll',
        goal: 'Las cuatro esquinas de arriba en su lugar.',
        text: [
          'Busca "faros": dos esquinas del mismo color en un lado. Si hay faros en un solo lado, ponlos a la izquierda y haz T. Si no hay faros, haz Y. Si los cuatro lados tienen faros, pasa al siguiente paso.',
        ],
        algs: PLL_2LOOK.filter((p) => p.group === 'Esquinas'),
        trainer: 'pll2',
      },
      {
        title: '6. PLL paso 2: aristas',
        stage: 'solved',
        goal: 'Cubo resuelto.',
        text: [
          'Ya solo faltan las aristas. Si un lado quedó completo, ponlo atrás y haz Ua o Ub. Si no hay ningún lado completo, es H o Z.',
        ],
        tips: ['Termina con el giro de U que alinee la capa.'],
        algs: PLL_2LOOK.filter((p) => p.group === 'Aristas'),
        trainer: 'pll2',
      },
      {
        title: 'En el 4x4',
        goal: 'Reducción: convertir el 4x4 en un 3x3 grande.',
        text: [
          'Primero arma los seis centros (bloques de 2x2), luego empareja las aristas dobles y resuelve como un 3x3 con Fridrich, usando solo giros exteriores.',
          'Pueden aparecer dos casos imposibles en un 3x3: una arista volteada en OLL o dos aristas intercambiadas en PLL. Se resuelven con estos algoritmos de paridad.',
        ],
        algs: PARITY_4X4,
        trainer: 'parity',
      },
      {
        title: 'Cómo seguir',
        goal: 'Del reducido al completo.',
        text: [
          'Cuando el reducido te salga fluido, aprende los 21 PLL completos (es lo que más tiempo ahorra), luego mejora el F2L y por último suma los 57 OLL.',
        ],
      },
    ],
  },
};
