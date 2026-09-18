import { memo, useMemo } from 'react';
import { toPath, type Viewport } from '../lib/svgPath';

interface Props {
  readonly n: number;
  readonly a: number;
  readonly b: number;
  readonly view: Viewport;
  readonly highlighted: boolean;
  readonly onHover: (n: number | null) => void;
}

/**
 * One term of the series: a_n cos(nx) + b_n sin(nx).
 *
 * This is the component that justifies SVG over canvas. Each harmonic is a
 * real DOM node, so it carries its own hover state and the browser does the
 * hit-testing. Raising the harmonic count from 20 to 21 mounts one new path
 * and leaves the other twenty alone, because React keys them by n.
 *
 * `memo` is what makes that true in practice: without it every sibling would
 * re-run its render function and rebuild its path string on each keystroke.
 * The `onHover` callback must therefore be stable in the parent (useCallback)
 * or the comparison fails and the memo does nothing.
 */
export const HarmonicCurve = memo(function HarmonicCurve({
  n,
  a,
  b,
  view,
  highlighted,
  onHover,
}: Props) {
  const d = useMemo(
    () => toPath((x) => a * Math.cos(n * x) + b * Math.sin(n * x), view, 400),
    [n, a, b, view],
  );

  return (
    <path
      d={d}
      fill="none"
      className={highlighted ? 'curve-harmonic is-highlighted' : 'curve-harmonic'}
      onPointerEnter={() => onHover(n)}
      onPointerLeave={() => onHover(null)}
    />
  );
});