import { describe, expect, it } from 'vitest';
import { applyAlg, faces, isSolved, solvedCube } from '../lib/cube.js';
import { PLL, PLL_2LOOK } from './pll.js';
import { OLL } from './oll.js';
import { F2L_BASIC } from './f2l.js';
import { METHODS } from './manual.js';
import { invertAlg } from '../lib/moves.js';
import { PARITY_4X4 } from './parity.js';

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

describe('paridades 4x4', () => {
  const centers = (grid) => [grid[1][1], grid[1][2], grid[2][1], grid[2][2]];

  it.each(PARITY_4X4.map((p) => [p.name, p.alg]))('%s conserva centros y primeras capas', (_, alg) => {
    const f = faces(applyAlg(solvedCube(4), alg));
    expect(sameColor(f.D.flat(), 'D')).toBe(true);
    for (const face of ['U', 'F', 'R', 'B', 'L']) {
      expect(sameColor(centers(f[face]), face)).toBe(true);
    }
    for (const side of ['F', 'R', 'B', 'L']) {
      expect(sameColor(f[side].slice(1).flat(), side)).toBe(true);
    }
    expect(isSolved(applyAlg(solvedCube(4), alg))).toBe(false);
  });

  it('la paridad PLL deja la cara superior orientada', () => {
    const f = faces(applyAlg(solvedCube(4), PARITY_4X4[1].alg));
    expect(sameColor(f.U.flat(), 'U')).toBe(true);
  });
});

describe('F2L básico', () => {
  it.each(F2L_BASIC.map((c) => [c.name, c.alg]))('%s solo saca el par de adelante a la derecha', (_, alg) => {
    const f = faces(applyAlg(solvedCube(3), `z2 ${invertAlg(alg)}`));
    // Con blanco abajo, la fila 0 de D es el frente y la columna 2 la derecha.
    const cross = [f.D[0][1], f.D[1][0], f.D[1][2], f.D[2][1]];
    const otherCorners = [f.D[0][0], f.D[2][0], f.D[2][2]];
    expect(sameColor([...cross, ...otherCorners], 'U')).toBe(true);
    expect(f.D[0][2]).not.toBe('U');
  });
});

describe('PLL en dos pasos', () => {
  it('usa algoritmos del set completo', () => {
    expect(PLL_2LOOK.map((p) => p.name)).toEqual(['T', 'Y', 'Ua', 'Ub', 'H', 'Z']);
    for (const p of PLL_2LOOK) expect(PLL.find((q) => q.name === p.name).alg).toBe(p.alg);
  });

  it('la T tiene faros solo a la izquierda y la Y no tiene', () => {
    const lights = (alg) => {
      const f = faces(applyAlg(solvedCube(3), `z2 ${invertAlg(alg)}`));
      return ['F', 'R', 'B', 'L'].filter((s) => f[s][0][0] === f[s][0][2]);
    };
    expect(lights(PLL_2LOOK[0].alg)).toEqual(['L']);
    expect(lights(PLL_2LOOK[1].alg)).toEqual([]);
  });
});

describe('manual', () => {
  it('los dos métodos tienen pasos con texto y meta', () => {
    for (const method of Object.values(METHODS)) {
      expect(method.steps.length).toBeGreaterThan(3);
      for (const step of method.steps) {
        expect(step.goal).toBeTruthy();
        expect(step.text.length).toBeGreaterThan(0);
      }
    }
  });

  it('el reducido usa 16 algoritmos de OLL y PLL', () => {
    const steps = METHODS.reduced.steps.filter((s) => /OLL|PLL/.test(s.title));
    expect(steps.reduce((n, s) => n + s.algs.length, 0)).toBe(16);
  });

  it('la L de OLL queda con aristas amarillas adelante y a la derecha', () => {
    const l = OLL.find((o) => o.name === 'L');
    const f = faces(applyAlg(solvedCube(3), `z2 ${invertAlg(l.alg)}`));
    const yellow = { B: f.U[0][1], L: f.U[1][0], R: f.U[1][2], F: f.U[2][1] };
    expect(Object.keys(yellow).filter((k) => yellow[k] === 'D').sort()).toEqual(['F', 'R']);
  });
});
