import { describe, expect, it } from 'vitest';
import { applyAlg, faces, isSolved, solvedCube } from '../lib/cube.js';
import { PLL } from './pll.js';
import { OLL } from './oll.js';

// Reorienta el cubo con rotaciones y para comparar sin importar si el
// algoritmo terminó con una rotación del cubo completo.
function normalized(alg) {
  for (const rot of ['', 'y', 'y2', "y'"]) {
    const f = faces(applyAlg(solvedCube(3), `${alg} ${rot}`));
    if (f.F[2][1] === 'F' && f.U[1][1] === 'U') return f;
  }
  return faces(applyAlg(solvedCube(3), alg));
}

const sameColor = (cells, color) => cells.every((c) => c === color);

describe('PLL', () => {
  it('tiene los 21 casos', () => {
    expect(PLL).toHaveLength(21);
    expect(new Set(PLL.map((p) => p.name)).size).toBe(21);
  });

  it.each(PLL.map((p) => [p.name, p.alg]))('%s solo permuta la última capa', (_, alg) => {
    const f = normalized(alg);
    expect(sameColor(f.U.flat(), 'U')).toBe(true);
    expect(sameColor(f.D.flat(), 'D')).toBe(true);
    for (const side of ['F', 'R', 'B', 'L']) {
      expect(sameColor([...f[side][1], ...f[side][2]], side)).toBe(true);
    }
    // No debe ser solo un giro de U.
    const auf = ['', 'U', 'U2', "U'"].some((u) => isSolved(applyAlg(solvedCube(3), `${alg} ${u}`)));
    expect(auf).toBe(false);
  });
});

describe('OLL', () => {
  it.each(OLL.map((o) => [o.name, o.alg]))('%s conserva las dos primeras capas', (_, alg) => {
    const f = faces(applyAlg(solvedCube(3), alg));
    expect(sameColor(f.D.flat(), 'D')).toBe(true);
    for (const side of ['F', 'R', 'B', 'L']) {
      expect(sameColor([...f[side][1], ...f[side][2]], side)).toBe(true);
    }
    // Debe desorientar la cara superior (si no, no sería un caso de OLL).
    expect(sameColor(f.U.flat(), 'U')).toBe(false);
  });
});
