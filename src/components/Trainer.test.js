import { describe, expect, it } from 'vitest';
import { SETS, setupFor } from './Trainer.js';
import { applyAlg, isSolved, solvedCube } from '../lib/cube.js';

describe('entrenador', () => {
  const all = Object.entries(SETS).flatMap(([id, set]) =>
    set.cases.map((c) => [`${id} ${c.name}`, set.size, c.alg]),
  );

  it.each(all)('%s: el setup más el algoritmo resuelve el cubo', (_, size, alg) => {
    const cube = applyAlg(solvedCube(size), `z2 ${setupFor(alg)}`);
    expect(isSolved(cube)).toBe(false);
    expect(isSolved(applyAlg(cube, alg))).toBe(true);
  });

  it('cada set indica el tamaño de cubo correcto', () => {
    expect(SETS.pll.size).toBe(3);
    expect(SETS.pll2.size).toBe(3);
    expect(SETS.f2l.size).toBe(3);
    expect(SETS.oll.size).toBe(3);
    expect(SETS.parity.size).toBe(4);
  });
});
