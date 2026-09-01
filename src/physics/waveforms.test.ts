import { describe, it, expect } from 'vitest';
import { WAVEFORMS, type Waveform } from './waveforms';

function numericalB(w: Waveform, n: number, steps = 20000): number {
  let sum = 0;
  const dx = (2 * Math.PI) / steps;
  for (let i = 0; i < steps; i++) {
    const x = -Math.PI + (i + 0.5) * dx;
    sum += w.f(x) * Math.sin(n * x) * dx;
  }
  return sum / Math.PI;
}

describe('waveform coefficients', () => {
  for (const w of Object.values(WAVEFORMS)) {
    it(`${w.id}: analytic b_n matches numerical integration`, () => {
      for (let n = 1; n <= 6; n++) {
        expect(numericalB(w, n)).toBeCloseTo(w.b(n), 2);
      }
    });
  }
});