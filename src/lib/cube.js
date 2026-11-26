import { parseAlg } from './moves.js';

// Simulación de un cubo NxN por stickers. Cada sticker tiene la posición de
// su pieza (coordenadas en pasos de 2, de -(N-1) a N-1) y el vector normal
// de la cara donde está. Girar una capa es rotar 90° los stickers de esa capa.

export const FACE_INFO = {
  U: { normal: [0, 1, 0], right: [1, 0, 0], up: [0, 0, -1] },
  D: { normal: [0, -1, 0], right: [1, 0, 0], up: [0, 0, 1] },
  F: { normal: [0, 0, 1], right: [1, 0, 0], up: [0, 1, 0] },
  B: { normal: [0, 0, -1], right: [-1, 0, 0], up: [0, 1, 0] },
  R: { normal: [1, 0, 0], right: [0, 0, -1], up: [0, 1, 0] },
  L: { normal: [-1, 0, 0], right: [0, 0, 1], up: [0, 1, 0] },
};

export const FACE_ORDER = ['U', 'R', 'F', 'D', 'L', 'B'];

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Rota v 90° en sentido horario mirando desde la punta de n. */
function rotateCW(v, n) {
  const c = cross(n, v);
  const d = dot(n, v);
  return [n[0] * d - c[0], n[1] * d - c[1], n[2] * d - c[2]];
}

export function solvedCube(size) {
  const stickers = [];
  const m = size - 1;
  for (const face of FACE_ORDER) {
    const { normal, right, up } = FACE_INFO[face];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const r = 2 * col - m;
        const u = m - 2 * row;
        const pos = [0, 1, 2].map((i) => normal[i] * m + right[i] * r + up[i] * u);
        stickers.push({ pos, normal: [...normal], color: face });
      }
    }
  }
  return { size, stickers };
}

/** Gira las capas from..to (1 = exterior) vistas desde la cara indicada. */
function turnLayers(cube, face, from, to, amount) {
  const n = FACE_INFO[face].normal;
  const m = cube.size - 1;
  const hi = m - 2 * (from - 1);
  const lo = m - 2 * (to - 1);
  for (const s of cube.stickers) {
    const depth = dot(s.pos, n);
    if (depth < lo || depth > hi) continue;
    for (let k = 0; k < amount; k++) {
      s.pos = rotateCW(s.pos, n);
      s.normal = rotateCW(s.normal, n);
    }
  }
}

const ROTATION_FACE = { x: 'R', y: 'U', z: 'F' };
const SLICE_FACE = { M: 'L', E: 'D', S: 'F' };

export function applyMove(cube, move) {
  const N = cube.size;
  if (move.kind === 'rotation') {
    turnLayers(cube, ROTATION_FACE[move.axis], 1, N, move.amount);
  } else if (move.kind === 'slice') {
    if (N % 2 === 0) throw new Error(`${move.slice} no existe en cubos pares`);
    const mid = (N + 1) / 2;
    turnLayers(cube, SLICE_FACE[move.slice], mid, mid, move.amount);
  } else {
    if (move.to > N) throw new Error(`Capa ${move.to} fuera del cubo ${N}x${N}`);
    turnLayers(cube, move.face, move.from, move.to, move.amount);
  }
  return cube;
}

export function applyAlg(cube, alg) {
  for (const move of parseAlg(alg)) applyMove(cube, move);
  return cube;
}

/** Devuelve las caras como matrices de colores: { U: [[...], ...], ... } */
export function faces(cube) {
  const N = cube.size;
  const m = N - 1;
  const out = {};
  for (const face of FACE_ORDER) {
    out[face] = Array.from({ length: N }, () => Array(N).fill(null));
  }
  for (const s of cube.stickers) {
    const face = FACE_ORDER.find((f) => dot(s.normal, FACE_INFO[f].normal) === 1);
    const { right, up } = FACE_INFO[face];
    const col = (dot(s.pos, right) + m) / 2;
    const row = (m - dot(s.pos, up)) / 2;
    out[face][row][col] = s.color;
  }
  return out;
}

export function isSolved(cube) {
  return Object.values(faces(cube)).every((grid) => {
    const first = grid[0][0];
    return grid.every((row) => row.every((c) => c === first));
  });
}

/** Pinta de gris ('X') los stickers cuyo filtro devuelve false. */
export function maskCube(cube, keep) {
  for (const s of cube.stickers) if (!keep(s)) s.color = 'X';
  return cube;
}

const isCenter = (s) => s.pos.filter((c) => c === 0).length === 2;
const isEdge = (s) => s.pos.filter((c) => c === 0).length === 1;

// Etapas del método Fridrich sobre un 3x3 resuelto con blanco (U) arriba.
// Para mostrarlas como se resuelven (blanco abajo) se aplica luego z2.
export const STAGES = {
  cross: (s) => isCenter(s) || (s.pos[1] === 2 && isEdge(s)),
  f2l: (s) => isCenter(s) || s.pos[1] >= 0,
  oll: (s) => s.pos[1] >= 0 || isCenter(s) || s.color === 'D',
  solved: () => true,
};
