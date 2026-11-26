const KEY = 'cube-trainer:solves';

function safeRead(storage) {
  try {
    const raw = storage?.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(storage, solves) {
  try {
    storage?.setItem(KEY, JSON.stringify(solves));
  } catch {
    // Sin almacenamiento disponible: la sesión vive solo en memoria.
  }
}

/** Tiempo efectivo de un solve aplicando su penalización. */
export function effectiveTime(solve) {
  if (solve.penalty === 'DNF') return Infinity;
  if (solve.penalty === '+2') return solve.ms + 2000;
  return solve.ms;
}

export function createSession(storage = globalThis.localStorage) {
  let solves = safeRead(storage);
  const listeners = new Set();

  const emit = () => {
    safeWrite(storage, solves);
    listeners.forEach((fn) => fn());
  };

  return {
    list: (puzzle) => solves.filter((s) => s.puzzle === puzzle),
    add(solve) {
      const entry = { id: Date.now() + Math.random().toString(36).slice(2, 6), date: new Date().toISOString(), penalty: null, ...solve };
      solves = [...solves, entry];
      emit();
      return entry;
    },
    setPenalty(id, penalty) {
      solves = solves.map((s) => (s.id === id ? { ...s, penalty } : s));
      emit();
    },
    remove(id) {
      solves = solves.filter((s) => s.id !== id);
      emit();
    },
    clear(puzzle) {
      solves = solves.filter((s) => s.puzzle !== puzzle);
      emit();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
