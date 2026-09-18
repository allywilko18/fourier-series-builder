import { useMemo } from 'react';
import { partialSum, type Waveform } from '../physics/waveforms';

interface Props {
  readonly waveform: Waveform;
  readonly harmonics: number;
}

const SAMPLES = 3000;

/**
 * Both figures are derived from the waveform and N, so neither is stored in
 * state. Recomputing in render is correct; caching it in a useState and
 * syncing with an effect would be the classic mistake.
 */
export function Readouts({ waveform, harmonics }: Props) {
  const { rms, overshoot } = useMemo(() => {
    let squared = 0;
    let peak = 0;

    for (let i = 0; i < SAMPLES; i++) {
      const x = -Math.PI + ((i + 0.5) / SAMPLES) * 2 * Math.PI;
      const approx = partialSum(waveform, harmonics, x);
      const error = approx - waveform.f(x);
      squared += error * error;
      peak = Math.max(peak, Math.abs(approx));
    }

    return {
      rms: Math.sqrt(squared / SAMPLES),
      overshoot: peak - 1,
    };
  }, [waveform, harmonics]);

  return (
    <dl className="readouts">
      <div className="readout">
        <dt>RMS error</dt>
        <dd>{rms.toFixed(4)}</dd>
      </div>
      <div className="readout">
        <dt>Peak overshoot</dt>
        <dd>
          {waveform.hasJump ? `${(overshoot * 100).toFixed(1)}%` : '\u2014'}
        </dd>
      </div>
    </dl>
  );
}