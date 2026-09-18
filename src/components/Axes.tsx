import { memo } from 'react';
import { toScreenX, toScreenY, type Viewport } from '../lib/svgPath';

interface Props {
  readonly view: Viewport;
}

const X_TICKS = [
  { x: -Math.PI, label: '\u2212\u03c0' },
  { x: -Math.PI / 2, label: '\u2212\u03c0/2' },
  { x: 0, label: '0' },
  { x: Math.PI / 2, label: '\u03c0/2' },
  { x: Math.PI, label: '\u03c0' },
];

const Y_TICKS = [-1, -0.5, 0, 0.5, 1];

/**
 * Nothing here depends on the waveform or the harmonic count, so the whole
 * subtree is memoised and skipped on every parameter change.
 */
export const Axes = memo(function Axes({ view }: Props) {
  return (
    <g aria-hidden="true">
      {Y_TICKS.map((y) => (
        <g key={y}>
          <line
            x1={0}
            x2={view.width}
            y1={toScreenY(y, view)}
            y2={toScreenY(y, view)}
            className={y === 0 ? 'axis-line' : 'grid-line'}
          />
          <text
            x={-8}
            y={toScreenY(y, view) + 4}
            textAnchor="end"
            className="tick-label"
          >
            {y}
          </text>
        </g>
      ))}

      {X_TICKS.map(({ x, label }) => (
        <text
          key={label}
          x={toScreenX(x, view)}
          y={view.height + 18}
          textAnchor="middle"
          className="tick-label"
        >
          {label}
        </text>
      ))}
    </g>
  );
});