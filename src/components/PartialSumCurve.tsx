import { memo, useMemo } from 'react';
import { partialSum, type Waveform } from '../physics/waveforms';
import { toPath, type Viewport } from '../lib/svgPath';

interface Props {
  readonly waveform: Waveform;
  readonly harmonics: number;
  readonly view: Viewport;
}

/**
 * S_N(x), the sum of the first N harmonics. The only curve in the plot that
 * genuinely has to be rebuilt when N changes.
 */
export const PartialSumCurve = memo(function PartialSumCurve({
  waveform,
  harmonics,
  view,
}: Props) {
  const d = useMemo(
    () => toPath((x) => partialSum(waveform, harmonics, x), view, 1200),
    [waveform, harmonics, view],
  );

  return <path d={d} className="curve-sum" fill="none" />;
});