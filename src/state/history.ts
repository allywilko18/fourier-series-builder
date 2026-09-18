/**
 * A generic undo/redo wrapper.
 *
 * `withHistory` takes any reducer and returns a reducer over the same state
 * plus a past and a future. It knows nothing about what it is wrapping, which
 * is the point: the panels reducer stays a plain state machine and undo comes
 * for free.
 *
 * Correctness rests on the inner reducer being immutable. A no-op action must
 * return the *same object*, not an equal one, or every keystroke would push a
 * history entry.
 */

export interface History<T> {
  readonly past: readonly T[];
  readonly present: T;
  readonly future: readonly T[];
}

export type HistoryAction = { type: 'undo' } | { type: 'redo' };

export function initialHistory<T>(present: T): History<T> {
  return { past: [], present, future: [] };
}

export function canUndo<T>(state: History<T>): boolean {
  return state.past.length > 0;
}

export function canRedo<T>(state: History<T>): boolean {
  return state.future.length > 0;
}

interface Options {
  /** How many past states to retain. Older entries are discarded. */
  readonly limit?: number;
}

export function withHistory<T, A extends { type: string }>(
  reducer: (state: T, action: A) => T,
  options: Options = {},
) {
  const limit = options.limit ?? 50;

  return function historyReducer(
    state: History<T>,
    action: A | HistoryAction,
  ): History<T> {
    switch (action.type) {
      case 'undo': {
        const [previous, ...rest] = state.past;
        if (previous === undefined) return state;
        return {
          past: rest,
          present: previous,
          future: [state.present, ...state.future],
        };
      }

      case 'redo': {
        const [next, ...rest] = state.future;
        if (next === undefined) return state;
        return {
          past: [state.present, ...state.past],
          present: next,
          future: rest,
        };
      }

      default: {
        const present = reducer(state.present, action as A);
        // Reference equality: the inner reducer returns the same object when
        // nothing changed, so no history entry is recorded.
        if (present === state.present) return state;
        return {
          past: [state.present, ...state.past].slice(0, limit),
          present,
          // Any new action abandons the redo branch.
          future: [],
        };
      }
    }
  };
}