import { useCallback, useEffect, useReducer } from 'react';
import type { WaveformId } from './physics/waveforms';
import { initialHistory, canUndo, canRedo } from './state/history';
import { reducer, initialState, MAX_PANELS } from './state/reducer';
import { Panel } from './components/Panel';

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialHistory(initialState()),
  );

  const { panels } = state.present;

  const setWaveform = useCallback(
    (panelId: string, waveform: WaveformId) =>
      dispatch({ type: 'setWaveform', panelId, waveform }),
    [],
  );

  const setHarmonics = useCallback(
    (panelId: string, harmonics: number) =>
      dispatch({ type: 'setHarmonics', panelId, harmonics }),
    [],
  );

  const toggleHarmonics = useCallback(
    (panelId: string) => dispatch({ type: 'toggleHarmonicCurves', panelId }),
    [],
  );

  const removePanel = useCallback(
    (panelId: string) => dispatch({ type: 'removePanel', panelId }),
    [],
  );

  // Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z. The effect subscribes once and cleans up
  // on unmount; dispatch is guaranteed stable by useReducer, so the empty
  // dependency array is honest rather than a lie the linter tolerates.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z') {
        return;
      }
      event.preventDefault();
      dispatch({ type: event.shiftKey ? 'redo' : 'undo' });
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Fourier series builder</h1>
        <p className="lede">
          Every periodic function is a sum of sines and cosines. Add harmonics
          and watch the sum close in on its target.
        </p>
      </header>

      <div className="toolbar">
        <button
          type="button"
          onClick={() => dispatch({ type: 'undo' })}
          disabled={!canUndo(state)}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'redo' })}
          disabled={!canRedo(state)}
        >
          Redo
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'addPanel' })}
          disabled={panels.length >= MAX_PANELS}
        >
          Compare another
        </button>
      </div>

      <div className="panels">
        {panels.map((panel) => (
          <Panel
            key={panel.id}
            panel={panel}
            canRemove={panels.length > 1}
            onSetWaveform={setWaveform}
            onSetHarmonics={setHarmonics}
            onToggleHarmonics={toggleHarmonics}
            onRemove={removePanel}
          />
        ))}
      </div>
    </main>
  );
}