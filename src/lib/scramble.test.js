import { describe, expect, it } from 'vitest';
import { generateScramble } from './scramble.js';
import { AXIS_OF, invertAlg, moveToString, parseAlg, parseMove } from './moves.js';

function seeded(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const baseOf = (token) => token.replace(/['2]$/, '');

describe('parseMove', () => {
  it('lee giros simples, anchos y de capa interna', () => {
    expect(parseMove("R'")).toEqual({ kind: 'face', face: 'R', from: 1, to: 1, amount: 3 });
    expect(parseMove('Rw2')).toMatchObject({ from: 1, to: 2, amount: 2 });
    expect(parseMove('3Fw')).toMatchObject({ from: 1, to: 3 });
    expect(parseMove('2R')).toMatchObject({ from: 2, to: 2 });
    expect(parseMove("y'")).toEqual({ kind: 'rotation', axis: 'y', amount: 3 });
  });

  it('rechaza texto inválido', () => {
    expect(() => parseMove('Q')).toThrow();
  });

  it('vuelve a texto sin perder información', () => {
    for (const t of ['R', "U'", 'F2', 'Rw', "3Rw'", '2R2', 'M', 'x']) {
      expect(moveToString(parseMove(t))).toBe(t);
    }
  });

  it('invierte algoritmos', () => {
    expect(invertAlg("R U R' U'")).toBe("U R U' R'");
    expect(invertAlg('(R2 F)')).toBe("F' R2");
  });
});

describe.each([
  ['3x3', 20],
  ['4x4', 40],
])('scramble %s', (puzzle, length) => {
  const samples = Array.from({ length: 200 }, (_, i) => generateScramble(puzzle, seeded(i + 1)));

  it(`tiene ${length} movimientos válidos`, () => {
    for (const s of samples) {
      const tokens = s.split(' ');
      expect(tokens).toHaveLength(length);
      expect(() => parseAlg(s)).not.toThrow();
    }
  });

  it('no repite la misma base dentro de una racha del mismo eje', () => {
    for (const s of samples) {
      let axis = null;
      let seen = new Set();
      for (const token of s.split(' ')) {
        const base = baseOf(token);
        const a = AXIS_OF[base.replace(/\d|w/g, '')];
        if (a !== axis) {
          axis = a;
          seen = new Set();
        }
        expect(seen.has(base)).toBe(false);
        seen.add(base);
      }
    }
  });

  it('es determinista con la misma semilla', () => {
    expect(generateScramble(puzzle, seeded(42))).toBe(generateScramble(puzzle, seeded(42)));
  });
});
