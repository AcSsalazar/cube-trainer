// Casos básicos de F2L para el hueco de adelante a la derecha (blanco abajo).
// Los demás casos se llevan a uno de estos con giros de U.
export const F2L_BASIC = [
  { name: 'Derecha', group: 'Inserción', alg: "R U R'", note: 'Par armado arriba, esquina con el blanco hacia la derecha.' },
  { name: 'Frente', group: 'Inserción', alg: "F' U' F", note: 'Par armado arriba, esquina con el blanco hacia el frente.' },
  { name: 'Separado derecha', group: 'Armar e insertar', alg: "U R U' R'", note: 'Esquina y arista separadas arriba: U las junta y R U\' R\' inserta.' },
  { name: 'Separado frente', group: 'Armar e insertar', alg: "U' F' U F", note: 'Igual que el anterior, pero insertando por el frente.' },
];
