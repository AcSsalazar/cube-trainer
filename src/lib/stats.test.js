import { describe, expect, it } from 'vitest';
import { averageOf, bestAverageOf, summarize } from './stats.js';

describe('averageOf', () => {
  it('quita mejor y peor', () => {
    expect(averageOf([10, 20, 30, 40, 50], 5)).toBe(30);
  });

  it('usa solo los últimos n tiempos', () => {
    expect(averageOf([999, 10, 20, 30, 40, 50], 5)).toBe(30);
  });

  it('un DNF se descarta como el peor', () => {
    expect(averageOf([10, 20, 30, 40, Infinity], 5)).toBe(30);
  });

  it('dos DNF hacen DNF el promedio', () => {
    expect(averageOf([10, 20, 30, Infinity, Infinity], 5)).toBe(Infinity);
  });

  it('devuelve null si no hay suficientes tiempos', () => {
    expect(averageOf([1, 2, 3], 5)).toBeNull();
  });
});

describe('bestAverageOf y summarize', () => {
  it('encuentra el mejor ao5 de la sesión', () => {
    const times = [50, 50, 50, 50, 50, 10, 10, 10];
    expect(bestAverageOf(times, 5)).toBeCloseTo(70 / 3);
  });

  it('resume la sesión', () => {
    const s = summarize([12, 10, Infinity, 14]);
    expect(s.count).toBe(4);
    expect(s.best).toBe(10);
    expect(s.ao5).toBeNull();
    expect(s.mean).toBe(12);
  });
});
