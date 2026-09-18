import { memo } from 'react';

interface Props {
  readonly n: number;
  readonly amplitude: number;
  readonly maxAmplitude: number;
  readonly included: boolean;
  readonly highlighted: boolean;
  readonly onHover: (n: number | null) => void;
}

export const SpectrumBar = memo(function SpectrumBar({
  n,
  amplitude,
  maxAmplitude,
  included,
  highlighted,
  onHover,
}: Props) {
  const height = maxAmplitude > 0 ? (amplitude / maxAmplitude) * 100 : 0;
  const classes = [
    'spectrum-bar',
    included ? 'is-included' : '',
    highlighted ? 'is-highlighted' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onPointerEnter={() => onHover(n)}
      onPointerLeave={() => onHover(null)}
      title={`Harmonic ${n}: amplitude ${amplitude.toFixed(4)}`}
    >
      <div className="spectrum-bar-fill" style={{ height: `${height}%` }} />
    </div>
  );
});