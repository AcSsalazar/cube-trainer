import { describe, expect, it } from 'vitest';
import { createSession, effectiveTime } from './session.js';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, v),
  };
}

describe('session', () => {
  it('guarda y separa los solves por cubo', () => {
    const storage = memoryStorage();
    const session = createSession(storage);
    session.add({ ms: 15000, puzzle: '3x3' });
    session.add({ ms: 60000, puzzle: '4x4' });
    expect(session.list('3x3')).toHaveLength(1);
    expect(createSession(storage).list('4x4')[0].ms).toBe(60000);
  });

  it('cambia penalizaciones, borra y limpia', () => {
    const session = createSession(memoryStorage());
    const a = session.add({ ms: 10000, puzzle: '3x3' });
    session.add({ ms: 11000, puzzle: '3x3' });
    session.setPenalty(a.id, '+2');
    expect(effectiveTime(session.list('3x3')[0])).toBe(12000);
    session.remove(a.id);
    expect(session.list('3x3')).toHaveLength(1);
    session.clear('3x3');
    expect(session.list('3x3')).toHaveLength(0);
  });

  it('tolera almacenamiento dañado o ausente', () => {
    const broken = { getItem: () => '{no json', setItem: () => { throw new Error('lleno'); } };
    const session = createSession(broken);
    expect(() => session.add({ ms: 1, puzzle: '3x3' })).not.toThrow();
    expect(createSession(undefined).list('3x3')).toEqual([]);
  });

  it('DNF cuenta como infinito', () => {
    expect(effectiveTime({ ms: 5000, penalty: 'DNF' })).toBe(Infinity);
  });
});
