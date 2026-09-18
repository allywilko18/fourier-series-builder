const PI = Math.PI;

/**
 * The set of waveforms the app can plot.
 *
 * This union is the single source of truth for "which waveforms exist".
 * Every switch over a WaveformId is checked for exhaustiveness at compile
 * time (see `assertNever`), so adding an entry here produces errors
 * everywhere that needs updating rather than a silent runtime fallthrough.
 */
export type WaveformId = 'square' | 'saw' | 'tri' | 'rect';

export interface Waveform {
  readonly id: WaveformId;
  readonly label: string;
  /** The target function, defined on [-pi, pi] and extended periodically. */
  f(x: number): number;
  /** Cosine coefficient a_n for harmonic n >= 1. */
  a(n: number): number;
  /** Sine coefficient b_n for harmonic n >= 1. */
  b(n: number): number;
  /** The mean value of f over one period. */
  readonly mean: number;
  /** True when f has a jump discontinuity (so Gibbs overshoot applies). */
  readonly hasJump: boolean;
}

/**
 * Coefficients below are derived analytically from
 *   a_n = (1/pi) * integral of f(x)cos(nx) dx over [-pi, pi]
 *   b_n = (1/pi) * integral of f(x)sin(nx) dx over [-pi, pi]
 * and verified against numerical integration in waveforms.test.ts.
 */
export const WAVEFORMS: Record<WaveformId, Waveform> = {
  square: {
    id: 'square',
    label: 'Square',
    f: (x) => (x >= 0 ? 1 : -1),
    // Odd function, so every a_n vanishes.
    a: () => 0,
    // b_n = (2/n*pi)(1 - (-1)^n): 4/(n*pi) for odd n, zero for even.
    b: (n) => (n % 2 === 1 ? 4 / (n * PI) : 0),
    mean: 0,
    hasJump: true,
  },

  saw: {
    id: 'saw',
    label: 'Sawtooth',
    f: (x) => x / PI,
    a: () => 0,
    // b_n = 2(-1)^(n+1)/(n*pi). Every harmonic present, decaying as 1/n.
    b: (n) => (2 / (n * PI)) * (n % 2 === 1 ? 1 : -1),
    mean: 0,
    hasJump: true,
  },

  tri: {
    id: 'tri',
    label: 'Triangle',
    f: (x) => 1 - (2 * Math.abs(x)) / PI,
    // Even function, so every b_n vanishes.
    // a_n = 8/(pi^2 n^2) for odd n. Continuous, so decay is 1/n^2.
    a: (n) => (n % 2 === 1 ? 8 / (PI * PI * n * n) : 0),
    b: () => 0,
    mean: 0,
    hasJump: false,
  },

  rect: {
    id: 'rect',
    label: 'Half-wave rectified',
    f: (x) => (x >= 0 ? Math.sin(x) : 0),
    // a_n = -2/(pi(n^2 - 1)) for even n; a_1 = 0.
    a: (n) => (n === 1 ? 0 : n % 2 === 0 ? -2 / (PI * (n * n - 1)) : 0),
    // Only the fundamental survives in the sine terms.
    b: (n) => (n === 1 ? 0.5 : 0),
    mean: 1 / PI,
    hasJump: false,
  },
};

export const WAVEFORM_IDS = Object.keys(WAVEFORMS) as WaveformId[];

/** Magnitude of harmonic n, i.e. sqrt(a_n^2 + b_n^2). */
export function amplitude(w: Waveform, n: number): number {
  return Math.hypot(w.a(n), w.b(n));
}

/** The partial sum S_N(x), truncating the series after N harmonics. */
export function partialSum(w: Waveform, N: number, x: number): number {
  let sum = w.mean;
  for (let n = 1; n <= N; n++) {
    sum += w.a(n) * Math.cos(n * x) + w.b(n) * Math.sin(n * x);
  }
  return sum;
}

/**
 * Exhaustiveness guard. Pass the narrowed value from the default branch of a
 * switch: if a new WaveformId is added and left unhandled, the value will no
 * longer be `never` and this call stops compiling.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${String(value)}`);
}

/** A one-line description of why each spectrum looks the way it does. */
export function spectrumNote(id: WaveformId): string {
  switch (id) {
    case 'square':
      return 'Odd harmonics only, falling as 1/n';
    case 'saw':
      return 'Every harmonic, falling as 1/n';
    case 'tri':
      return 'Odd harmonics only, falling as 1/n²';
    case 'rect':
      return 'Non-zero mean, fundamental plus even harmonics';
    default:
      return assertNever(id);
  }
}