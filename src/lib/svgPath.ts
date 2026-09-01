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

export function toScreenY(y: number, view: Viewport): number {
  return view.height - ((y - view.yMin) / (view.yMax - view.yMin)) * view.height;
}

export function toPath(
  f: (x: number) => number,
  view: Viewport,
  samples = 800
): string {
  const points: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = view.xMin + (i / samples) * (view.xMax - view.xMin);
    points.push(`${toScreenX(x, view).toFixed(2)},${toScreenY(f(x), view).toFixed(2)}`);
  }
  return `M ${points.join(' L ')}`;
}