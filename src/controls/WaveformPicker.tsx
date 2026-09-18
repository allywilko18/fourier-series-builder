import { WAVEFORMS, WAVEFORM_IDS, type WaveformId } from '../physics/waveforms';

interface Props {
  readonly value: WaveformId;
  readonly onChange: (id: WaveformId) => void;
}

/**
 * Fully controlled: it owns no state, it renders what it is given and reports
 * what the user did.
 */
export function WaveformPicker({ value, onChange }: Props) {
  return (
    <div className="waveform-picker" role="group" aria-label="Waveform">
      {WAVEFORM_IDS.map((id) => (
        <button
          key={id}
          type="button"
          className={id === value ? 'chip is-selected' : 'chip'}
          aria-pressed={id === value}
          onClick={() => onChange(id)}
        >
          {WAVEFORMS[id].label}
        </button>
      ))}
    </div>
  );
}