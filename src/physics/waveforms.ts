export type WaveformId = 'square' | 'saw' | 'tri';

export interface Waveform {
  readonly id: WaveformId;
  readonly label: string;
  /** The target function on [-pi, pi]. */
  f(x: number): number;
  /** Cosine coefficient for harmonic n >= 1. */
  a(n: number): number;
  /** Sine coefficient for harmonic n >= 1. */
  b(n: number): number;
  readonly a0: number;
}

const PI = Math.PI;

export const WAVEFORMS: Record<WaveformId, Waveform> = {
  square: {
    id: 'square',
    label: 'Square',
    f: (x) => (x >= 0 ? 1 : -1),
    a: () => 0,
    b: (n) => (n % 2 === 1 ? 4 / (n * PI) : 0),
    a0: 0,
  },
  saw: {
    id: 'saw',
    label: 'Sawtooth',
    f: (x) => x / PI,
    a: () => 0,
    b: (n) => (2 / (n * PI)) * (n % 2 === 1 ? 1 : -1),
    a0: 0,
  },
  tri: {
    id: 'tri',
    label: 'Triangle',
    f: (x) => 1 - (2 * Math.abs(x)) / PI,
    a: (n) => (n % 2 === 1 ? 8 / (PI * PI * n * n) : 0),
    b: () => 0,
    a0: 0,
  },
};

export function partialSum(w: Waveform, N: number, x: number): number {
  let sum = w.a0;
  for (let n = 1; n <= N; n++) {
    sum += w.a(n) * Math.cos(n * x) + w.b(n) * Math.sin(n * x);
  }
  return sum;
}