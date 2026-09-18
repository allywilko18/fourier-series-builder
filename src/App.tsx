import { useCallback, useState } from 'react';
import { WAVEFORMS, type WaveformId } from './physics/waveforms';
import type { Viewport } from './lib/svgPath';
import { FourierPlot } from './components/FourierPlot';
import { Spectrum } from './spectrum/Spectrum';
import { WaveformPicker } from './controls/WaveformPicker';
import { HarmonicSlider } from './controls/HarmonicSlider';
import { Readouts } from './components/Readouts';

const VIEW: Viewport = {
  width: 620,
  height: 260,
  xMin: -Math.PI,
  xMax: Math.PI,
  yMin: -1.45,
  yMax: 1.45,
};

export default function App() {
  const [waveformId, setWaveformId] = useState<WaveformId>('square');
  const [harmonics, setHarmonics] = useState(5);
  const [showHarmonics, setShowHarmonics] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const waveform = WAVEFORMS[waveformId];

  // Stable identity, or memo on HarmonicCurve does nothing.
  const handleHover = useCallback((n: number | null) => setHighlighted(n), []);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Fourier series builder</h1>
        <p className="lede">
          Every periodic function is a sum of sines and cosines. Add harmonics
          and watch the sum close in on its target.
        </p>
      </header>

      <div className="panel">
        <WaveformPicker value={waveformId} onChange={setWaveformId} />

        <FourierPlot
          waveform={waveform}
          harmonics={harmonics}
          showHarmonics={showHarmonics}
          highlighted={highlighted}
          onHover={handleHover}
          view={VIEW}
        />

        <div className="panel-controls">
          <HarmonicSlider value={harmonics} onChange={setHarmonics} />
          <label className="toggle">
            <input
              type="checkbox"
              checked={showHarmonics}
              onChange={() => setShowHarmonics((on) => !on)}
            />
            Show individual harmonics
          </label>
        </div>

        <Spectrum
          waveform={waveform}
          harmonics={harmonics}
          highlighted={highlighted}
          onHover={handleHover}
        />

        <Readouts waveform={waveform} harmonics={harmonics} />
      </div>
    </main>
  );
}