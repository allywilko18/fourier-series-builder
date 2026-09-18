import type { WaveformId } from '../physics/waveforms';
import { assertNever } from '../physics/waveforms';
import { withHistory, type History, type HistoryAction } from './history';

export const MIN_HARMONICS = 1;
export const MAX_HARMONICS = 80;
export const MAX_PANELS = 3;

export interface Panel {
  readonly id: string;
  readonly waveform: WaveformId;
  readonly harmonics: number;
  readonly showHarmonics: boolean;
}

export interface PanelsState {
  readonly panels: readonly Panel[];
}

/**
 * Every way the state can change. Because this is a discriminated union, the
 * switch below narrows `action` to the right shape in each branch, and adding
 * a member without handling it fails to compile.
 */
export type Action =
  | { type: 'setWaveform'; panelId: string; waveform: WaveformId }
  | { type: 'setHarmonics'; panelId: string; harmonics: number }
  | { type: 'toggleHarmonicCurves'; panelId: string }
  | { type: 'addPanel' }
  | { type: 'removePanel'; panelId: string }
  | { type: 'reset' };

let nextId = 0;
const makeId = () => `panel-${nextId++}`;

function makePanel(waveform: WaveformId = 'square'): Panel {
  return { id: makeId(), waveform, harmonics: 5, showHarmonics: false };
}

export function initialState(): PanelsState {
  return { panels: [makePanel()] };
}

const clamp = (n: number) =>
  Math.min(MAX_HARMONICS, Math.max(MIN_HARMONICS, Math.round(n)));

/**
 * Update one panel by id. Returns the *same* state object when the update is a
 * no-op, which is what stops the history wrapper recording empty entries.
 */
function updatePanel(
  state: PanelsState,
  id: string,
  update: (panel: Panel) => Panel,
): PanelsState {
  let changed = false;
  const panels = state.panels.map((panel) => {
    if (panel.id !== id) return panel;
    const next = update(panel);
    if (next !== panel) changed = true;
    return next;
  });
  return changed ? { panels } : state;
}

export function panelsReducer(state: PanelsState, action: Action): PanelsState {
  switch (action.type) {
    case 'setWaveform':
      return updatePanel(state, action.panelId, (panel) =>
        panel.waveform === action.waveform
          ? panel
          : { ...panel, waveform: action.waveform },
      );

    case 'setHarmonics': {
      const harmonics = clamp(action.harmonics);
      return updatePanel(state, action.panelId, (panel) =>
        panel.harmonics === harmonics ? panel : { ...panel, harmonics },
      );
    }

    case 'toggleHarmonicCurves':
      return updatePanel(state, action.panelId, (panel) => ({
        ...panel,
        showHarmonics: !panel.showHarmonics,
      }));

    case 'addPanel': {
      if (state.panels.length >= MAX_PANELS) return state;
      const used = new Set(state.panels.map((p) => p.waveform));
      const fresh = (['square', 'saw', 'tri', 'rect'] as const).find(
        (id) => !used.has(id),
      );
      return { panels: [...state.panels, makePanel(fresh)] };
    }

    case 'removePanel': {
      if (state.panels.length <= 1) return state;
      const panels = state.panels.filter((p) => p.id !== action.panelId);
      return panels.length === state.panels.length ? state : { panels };
    }

    case 'reset':
      return initialState();

    default:
      return assertNever(action);
  }
}

export const reducer = withHistory<PanelsState, Action>(panelsReducer);

export type AppState = History<PanelsState>;
export type AnyAction = Action | HistoryAction;