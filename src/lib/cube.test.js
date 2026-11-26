import { describe, expect, it } from 'vitest';
import { applyAlg, faces, isSolved, solvedCube } from './cube.js';
import { invertAlg } from './moves.js';
import { generateScramble } from './scramble.js';

const row = (grid, i) => grid[i].join('');
const col = (grid, j) => grid.map((r) => r[j]).join('');

describe('cubo 3x3', () => {
  it('U lleva la fila superior de R a F', () => {
    const f = faces(applyAlg(solvedCube(3), 'U'));
    expect(row(f.F, 0)).toBe('RRR');
    expect(row(f.L, 0)).toBe('FFF');
    expect(row(f.F, 1)).toBe('FFF');
  });

  it('R lleva la columna derecha de F a U', () => {
    const f = faces(applyAlg(solvedCube(3), 'R'));
    expect(col(f.U, 2)).toBe('FFF');
    expect(col(f.U, 0)).toBe('UUU');
  });

  it('cuatro giros iguales vuelven al estado inicial', () => {
    for (const m of ['U', 'D', 'R', 'L', 'F', 'B', 'M', 'E', 'S', 'x', 'y', 'z']) {
      expect(isSolved(applyAlg(solvedCube(3), `${m} ${m} ${m} ${m}`))).toBe(true);
    }
  });

  it('el sexy move repetido 6 veces se cancela', () => {
    expect(isSolved(applyAlg(solvedCube(3), "R U R' U' ".repeat(6)))).toBe(true);
  });

  it('las rotaciones no desarman el cubo', () => {
    expect(isSolved(applyAlg(solvedCube(3), "x y2 z'"))).toBe(true);
  });

  it('M equivale a L\' R con rotación x\'', () => {
    const a = faces(applyAlg(solvedCube(3), 'M'));
    const b = faces(applyAlg(solvedCube(3), "L' R x'"));
    expect(a).toEqual(b);
  });
});

describe('cubo 4x4', () => {
  it('Rw mueve dos columnas', () => {
    const f = faces(applyAlg(solvedCube(4), 'Rw'));
    expect(col(f.U, 3)).toBe('FFFF');
    expect(col(f.U, 2)).toBe('FFFF');
    expect(col(f.U, 1)).toBe('UUUU');
  });

  it('2R mueve solo la capa interna', () => {
    const f = faces(applyAlg(solvedCube(4), '2R'));
    expect(col(f.U, 3)).toBe('UUUU');
    expect(col(f.U, 2)).toBe('FFFF');
  });

  it('M no existe en cubos pares', () => {
    expect(() => applyAlg(solvedCube(4), 'M')).toThrow();
  });
});

describe.each([
  ['3x3', 3],
  ['4x4', 4],
])('scramble %s', (puzzle, size) => {
  it('se deshace aplicando su inverso', () => {
    for (let i = 0; i < 20; i++) {
      const scramble = generateScramble(puzzle);
      const cube = applyAlg(solvedCube(size), scramble);
      expect(isSolved(cube)).toBe(false);
      expect(isSolved(applyAlg(cube, invertAlg(scramble)))).toBe(true);
    }
  });

  it('cada cara conserva N*N stickers de cada color en total', () => {
    const f = faces(applyAlg(solvedCube(size), generateScramble(puzzle)));
    const counts = {};
    for (const grid of Object.values(f)) for (const r of grid) for (const c of r) counts[c] = (counts[c] ?? 0) + 1;
    expect(Object.values(counts)).toEqual(Array(6).fill(size * size));
  });
});
