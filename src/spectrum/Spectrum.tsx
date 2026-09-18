import { useMemo } from 'react';
import { amplitude, spectrumNote, type Waveform } from '../physics/waveforms';
import { SpectrumBar } from './SpectrumBar';

interface Props {
  readonly waveform: Waveform;
  readonly harmonics: number;
  readonly highlighted: number | null;
  readonly onHover: (n: number | null) => void;
}

const SHOWN = 24;

export function Spectrum({ waveform, harmonics, highlighted, onHover }: Props) {
  const bars = useMemo(
    () =>
      Array.from({ length: SHOWN }, (_, i) => ({
        n: i + 1,
        amplitude: amplitude(waveform, i + 1),
      })),
    [waveform],
  );

  const max = useMemo(
    () => Math.max(...bars.map((bar) => bar.amplitude)),
    [bars],
  );

  return (
    <section className="spectrum">
      <div className="spectrum-chart">
        {bars.map((bar) => (
          <SpectrumBar
            key={bar.n}
            n={bar.n}
            amplitude={bar.amplitude}
            maxAmplitude={max}
            included={bar.n <= harmonics}
            highlighted={highlighted === bar.n}
            onHover={onHover}
          />
        ))}
      </div>
      <p className="spectrum-note">{spectrumNote(waveform.id)}</p>
    </section>
  );
}