import { useMemo } from 'react';
import type { Waveform } from '../physics/waveforms';
import type { Viewport } from '../lib/svgPath';
import { Axes } from './Axes';
import { TargetCurve } from './TargetCurve';
import { HarmonicCurve } from './HarmonicCurve';
import { PartialSumCurve } from './PartialSumCurve';

interface Props {
  readonly waveform: Waveform;
  readonly harmonics: number;
  readonly showHarmonics: boolean;
  readonly highlighted: number | null;
  readonly onHover: (n: number | null) => void;
  readonly view: Viewport;
}

const MAX_DRAWN_HARMONICS = 40;

export function FourierPlot({
  waveform,
  harmonics,
  showHarmonics,
  highlighted,
  onHover,
  view,
}: Props) {
  // Coefficients are computed once per (waveform, N) rather than once per
  // curve, so the harmonic components receive plain numbers as props and
  // their memo comparison stays cheap.
  const terms = useMemo(() => {
    const count = Math.min(harmonics, MAX_DRAWN_HARMONICS);
    return Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      return { n, a: waveform.a(n), b: waveform.b(n) };
    }).filter((term) => term.a !== 0 || term.b !== 0);
  }, [waveform, harmonics]);

  return (
    <svg
      viewBox={`-32 -12 ${view.width + 48} ${view.height + 40}`}
      className="plot"
      role="img"
      aria-label={`Partial sum of ${harmonics} harmonics approximating a ${waveform.label.toLowerCase()} wave`}
    >
      <Axes view={view} />

      {showHarmonics &&
        terms.map((term) => (
          <HarmonicCurve
            key={term.n}
            n={term.n}
            a={term.a}
            b={term.b}
            view={view}
            highlighted={highlighted === term.n}
            onHover={onHover}
          />
        ))}

      <TargetCurve waveform={waveform} view={view} />
      <PartialSumCurve waveform={waveform} harmonics={harmonics} view={view} />
    </svg>
  );
}