import { describe, expect, it } from 'vitest';
import { inspectionPenalty } from './Timer.js';

describe('inspectionPenalty', () => {
  it('no penaliza dentro de 15 s', () => {
    expect(inspectionPenalty(14999)).toBeNull();
    expect(inspectionPenalty(15000)).toBeNull();
  });

  it('da +2 entre 15 y 17 s', () => {
    expect(inspectionPenalty(15001)).toBe('+2');
    expect(inspectionPenalty(17000)).toBe('+2');
  });

  it('da DNF después de 17 s', () => {
    expect(inspectionPenalty(17001)).toBe('DNF');
  });
});
