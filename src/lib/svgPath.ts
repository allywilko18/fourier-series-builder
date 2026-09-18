/**
 * A window onto the plane: the region of maths coordinates that is visible,
 * and the pixel box it maps onto. Treated as immutable so components that
 * take a Viewport as a prop can rely on reference equality when memoising.
 */
export interface Viewport {
  readonly width: number;
  readonly height: number;
  readonly xMin: number;
  readonly xMax: number;
  readonly yMin: number;
  readonly yMax: number;
}

export function toScreenX(x: number, view: Viewport): number {
  return ((x - view.xMin) / (view.xMax - view.xMin)) * view.width;
}

/** SVG's y axis points downwards, so the fraction is subtracted from height. */
export function toScreenY(y: number, view: Viewport): number {
  return view.height - ((y - view.yMin) / (view.yMax - view.yMin)) * view.height;
}

/**
 * Sample f across the visible x range and join the points into an SVG path.
 *
 * `samples` trades smoothness against string length. At roughly one sample
 * per pixel the polyline is indistinguishable from a curve, so a few hundred
 * points is enough for a plot this size.
 */
export function toPath(
  f: (x: number) => number,
  view: Viewport,
  samples = 800,
): string {
  const span = view.xMax - view.xMin;
  const points: string[] = [];

  for (let i = 0; i <= samples; i++) {
    const x = view.xMin + (i / samples) * span;
    const y = f(x);
    // A single NaN silently invalidates the whole path, so skip bad samples.
    if (!Number.isFinite(y)) continue;
    points.push(
      `${toScreenX(x, view).toFixed(2)},${toScreenY(y, view).toFixed(2)}`,
    );
  }

  if (points.length === 0) return '';
  return `M ${points.join(' L ')}`;
}

/**
 * As toPath, but lifts the pen where f jumps by more than `threshold` between
 * consecutive samples. Without this a discontinuity is drawn as a steep
 * diagonal joining the two branches, which misrepresents the target function.
 */
export function toPathWithBreaks(
  f: (x: number) => number,
  view: Viewport,
  threshold: number,
  samples = 800,
): string {
  const span = view.xMax - view.xMin;
  const commands: string[] = [];
  let previous: number | null = null;

  for (let i = 0; i <= samples; i++) {
    const x = view.xMin + (i / samples) * span;
    const y = f(x);
    if (!Number.isFinite(y)) {
      previous = null;
      continue;
    }

    const px = toScreenX(x, view).toFixed(2);
    const py = toScreenY(y, view).toFixed(2);
    const jumped = previous !== null && Math.abs(y - previous) > threshold;

    commands.push(`${previous === null || jumped ? 'M' : 'L'} ${px},${py}`);
    previous = y;
  }

  return commands.join(' ');
}