import { useCallback, useState } from 'react';
import { WAVEFORMS, type WaveformId } from '../physics/waveforms';
import type { Viewport } from '../lib/svgPath';
import type { Panel as PanelState } from '../state/reducer';
import { useDebounced } from '../hooks/useDebounced';
import { FourierPlot } from './FourierPlot';
import { Spectrum } from '../spectrum/Spectrum';
import { WaveformPicker } from '../controls/WaveformPicker';
import { HarmonicSlider } from '../controls/HarmonicSlider';
import { Readouts } from './Readouts';

interface Props {
  readonly panel: PanelState;
  readonly canRemove: boolean;
  readonly onSetWaveform: (panelId: string, waveform: WaveformId) => void;
  readonly onSetHarmonics: (panelId: string, harmonics: number) => void;
  readonly onToggleHarmonics: (panelId: string) => void;
  readonly onRemove: (panelId: string) => void;
}

// Module-level so its reference never changes. Children memoised on `view`
// would otherwise re-render on every parent render.
const VIEW: Viewport = {
  width: 620,
  height: 260,
  xMin: -Math.PI,
  xMax: Math.PI,
  yMin: -1.45,
  yMax: 1.45,
};

export function Panel({
  panel,
  canRemove,
  onSetWaveform,
  onSetHarmonics,
  onToggleHarmonics,
  onRemove,
}: Props) {
  // Which harmonic the pointer is over. Local, because nothing outside this
  // panel needs to know, and it changes far too often to belong in the
  // reducer where it would pollute the undo history.
  const [highlighted, setHighlighted] = useState<number | null>(null);

  // The label tracks the slider immediately; the curves wait for the drag to
  // settle. Rebuilding 1200 sample points per pixel of travel is the one
  // genuinely expensive thing this app does.
  const settledHarmonics = useDebounced(panel.harmonics, 40);

  const waveform = WAVEFORMS[panel.waveform];

  // Stable identity, or memo on HarmonicCurve and SpectrumBar does nothing.
  const handleHover = useCallback((n: number | null) => setHighlighted(n), []);

  return (
    <article className="panel">
      <header className="panel-header">
        <WaveformPicker
          value={panel.waveform}
          onChange={(id) => onSetWaveform(panel.id, id)}
        />
        {canRemove && (
          <button
            type="button"
            className="ghost"
            onClick={() => onRemove(panel.id)}
          >
            Remove
          </button>
        )}
      </header>

      <FourierPlot
        waveform={waveform}
        harmonics={settledHarmonics}
        showHarmonics={panel.showHarmonics}
        highlighted={highlighted}
        onHover={handleHover}
        view={VIEW}
      />

      <div className="panel-controls">
        <HarmonicSlider
          value={panel.harmonics}
          onChange={(n) => onSetHarmonics(panel.id, n)}
        />
        <label className="toggle">
          <input
            type="checkbox"
            checked={panel.showHarmonics}
            onChange={() => onToggleHarmonics(panel.id)}
          />
          Show individual harmonics
        </label>
      </div>

      <Spectrum
        waveform={waveform}
        harmonics={settledHarmonics}
        highlighted={highlighted}
        onHover={handleHover}
      />

      <Readouts waveform={waveform} harmonics={settledHarmonics} />
    </article>
  );
}