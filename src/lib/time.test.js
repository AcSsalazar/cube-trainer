import { describe, expect, it } from 'vitest';
import { formatTime } from './time.js';

describe('formatTime', () => {
  it('formatea segundos y centésimas', () => {
    expect(formatTime(0)).toBe('0.00');
    expect(formatTime(9876)).toBe('9.87');
    expect(formatTime(12340)).toBe('12.34');
  });

  it('agrega minutos cuando pasa de 60 s', () => {
    expect(formatTime(62340)).toBe('1:02.34');
  });

  it('muestra DNF y valores vacíos', () => {
    expect(formatTime(Infinity)).toBe('DNF');
    expect(formatTime(null)).toBe('-');
  });
});
