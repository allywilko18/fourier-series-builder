import { WAVEFORMS, partialSum } from './physics/waveforms';
import { toPath, type Viewport } from './lib/svgPath';

const VIEW: Viewport = {
  width: 660,
  height: 300,
  xMin: -Math.PI,
  xMax: Math.PI,
  yMin: -1.5,
  yMax: 1.5,
};

export default function App() {
  const waveform = WAVEFORMS.square;
  const n = 5;

  return (
    <div style={{ padding: 24 }}>
      <h1>Fourier series builder</h1>
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        style={{ width: '100%', border: '1px solid #ccc' }}
      >
        <path
          d={toPath((x) => waveform.f(x), VIEW)}
          stroke="#999"
          strokeWidth={1.5}
          fill="none"
        />
        <path
          d={toPath((x) => partialSum(waveform, n, x), VIEW)}
          stroke="#2a78d6"
          strokeWidth={2}
          fill="none"
        />
      </svg>
    </div>
  );
}