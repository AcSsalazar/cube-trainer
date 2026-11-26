import { AXIS_OF } from './moves.js';

const SUFFIXES = ['', "'", '2'];

const pick = (list, rng) => list[Math.floor(rng() * list.length)];

/**
 * Genera una secuencia aleatoria evitando movimientos redundantes:
 * no repite una base que ya se usó en la racha actual del mismo eje
 * (evita R R', R L R, etc.).
 */
export function randomMoveSequence(bases, length, rng = Math.random) {
  const moves = [];
  let axis = null;
  let usedInAxis = new Set();

  while (moves.length < length) {
    const base = pick(bases, rng);
    const baseAxis = AXIS_OF[base.replace(/\d|w/g, '')];
    if (baseAxis === axis && usedInAxis.has(base)) continue;
    if (baseAxis !== axis) {
      axis = baseAxis;
      usedInAxis = new Set();
    }
    usedInAxis.add(base);
    moves.push(base + pick(SUFFIXES, rng));
  }
  return moves.join(' ');
}

export const SCRAMBLERS = {
  '3x3': {
    label: '3x3',
    size: 3,
    generate: (rng) => randomMoveSequence(['U', 'D', 'R', 'L', 'F', 'B'], 20, rng),
  },
};

export function generateScramble(puzzle = '3x3', rng = Math.random) {
  const scrambler = SCRAMBLERS[puzzle];
  if (!scrambler) throw new Error(`Puzzle no soportado: ${puzzle}`);
  return scrambler.generate(rng);
}
