import { MAX_HARMONICS, MIN_HARMONICS } from '../state/reducer';

interface Props {
  readonly value: number;
  readonly onChange: (n: number) => void;
}

export function HarmonicSlider({ value, onChange }: Props) {
  return (
    <label className="slider">
      <span className="slider-label">Harmonics</span>
      <input
        type="range"
        min={MIN_HARMONICS}
        max={MAX_HARMONICS}
        step={1}
        value={value}
        // e.target.value is a string even on a range input, so the conversion
        // is not optional. TypeScript catches the omission; plain JS would
        // silently start concatenating.
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output className="slider-value">{value}</output>
    </label>
  );
}