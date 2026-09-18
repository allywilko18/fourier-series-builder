import { memo, useMemo } from 'react';
import type { Waveform } from '../physics/waveforms';
import { toPathWithBreaks, type Viewport } from '../lib/svgPath';

interface Props {
  readonly waveform: Waveform;
  readonly view: Viewport;
}

/**
 * The function the series is converging towards. Depends only on the waveform,
 * so it survives every change to the harmonic count untouched.
 */
export const TargetCurve = memo(function TargetCurve({ waveform, view }: Props) {
  const d = useMemo(
    () => toPathWithBreaks((x) => waveform.f(x), view, 0.8),
    [waveform, view],
  );

  return <path d={d} className="curve-target" fill="none" />;
});