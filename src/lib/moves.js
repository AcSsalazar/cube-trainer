// Notación de movimientos para cubos NxN (WCA / SiGN).
// Ejemplos: R, U', F2, Rw, 3Rw, 2R, r, M, x, y'.

export const FACES = ['U', 'D', 'R', 'L', 'F', 'B'];

export const AXIS_OF = { U: 'y', D: 'y', R: 'x', L: 'x', F: 'z', B: 'z' };

const MOVE_RE = /^(\d*)([URFDLBurfdlbMESxyz])(w?)(2|'|2')?$/;

/**
 * Convierte un texto como "3Rw'" en un objeto de movimiento.
 * from/to son las capas (1 = capa exterior) que gira el movimiento.
 */
export function parseMove(token) {
  const m = MOVE_RE.exec(token.trim());
  if (!m) throw new Error(`Movimiento no válido: ${token}`);
  const [, num, letter, wide, suffix = ''] = m;
  const amount = suffix === '' ? 1 : suffix === "'" ? 3 : 2;

  if ('xyz'.includes(letter)) return { kind: 'rotation', axis: letter, amount };
  if ('MES'.includes(letter)) return { kind: 'slice', slice: letter, amount };

  const lower = letter === letter.toLowerCase();
  const face = letter.toUpperCase();
  let from = 1;
  let to = 1;
  if (wide || lower) {
    to = num ? Number(num) : 2;
  } else if (num) {
    from = to = Number(num);
  }
  return { kind: 'face', face, from, to, amount };
}

export function parseAlg(alg) {
  return alg
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(parseMove);
}

export function moveToString(move) {
  const suffix = move.amount === 1 ? '' : move.amount === 3 ? "'" : '2';
  if (move.kind === 'rotation') return move.axis + suffix;
  if (move.kind === 'slice') return move.slice + suffix;
  const { face, from, to } = move;
  let base = face;
  if (to > 1 && from === 1) base = (to > 2 ? to : '') + face + 'w';
  else if (from === to && from > 1) base = from + face;
  return base + suffix;
}

export function invertAlg(alg) {
  return parseAlg(alg)
    .reverse()
    .map((m) => moveToString({ ...m, amount: (4 - m.amount) % 4 || 4 }))
    .join(' ');
}
