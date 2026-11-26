// OLL en dos pasos (2-look OLL) para 3x3: primero la cruz, luego las esquinas.
export const OLL = [
  { name: 'Línea', group: 'Cruz', alg: "F R U R' U' F'" },
  { name: 'L', group: 'Cruz', alg: "f R U R' U' f'" },
  { name: 'Punto', group: 'Cruz', alg: "F R U R' U' F' f R U R' U' f'" },
  { name: 'Sune', group: 'Esquinas', alg: "R U R' U R U2 R'" },
  { name: 'Antisune', group: 'Esquinas', alg: "R U2 R' U' R U' R'" },
  { name: 'H', group: 'Esquinas', alg: "R U R' U R U' R' U R U2 R'" },
  { name: 'Pi', group: 'Esquinas', alg: "R U2 R2 U' R2 U' R2 U2 R" },
  { name: 'Faros', group: 'Esquinas', alg: "R2 D' R U2 R' D R U2 R" },
  { name: 'Camaleón', group: 'Esquinas', alg: "r U R' U' r' F R F'" },
  { name: 'Corbatín', group: 'Esquinas', alg: "F' r U R' U' r' F R" },
];
