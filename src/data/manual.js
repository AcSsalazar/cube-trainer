import { PLL } from './pll.js';
import { OLL } from './oll.js';

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
          'Existen 41 casos, pero casi todos se entienden de forma intuitiva a partir de unos pocos movimientos básicos.',
        ],
        tips: [
          'Mientras insertas un par, busca el siguiente.',
          'Evita rotar el cubo: acomoda el par con giros de U.',
          'Usa los huecos vacíos para armar pares difíciles.',
        ],
        algsFrom: 'f2l',
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
};
