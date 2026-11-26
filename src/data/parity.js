// Paridades del 4x4 que aparecen al resolver con el método de reducción.
export const PARITY_4X4 = [
  {
    name: 'Paridad OLL',
    group: '4x4',
    alg: "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'",
    note: 'Una arista doble queda volteada en la cara superior.',
  },
  {
    name: 'Paridad PLL',
    group: '4x4',
    alg: '2R2 U2 2R2 Uw2 2R2 Uw2',
    note: 'Dos aristas opuestas de la última capa quedan intercambiadas.',
  },
];
