/**
 * Promedio WCA de n tiempos: se quitan el mejor y el peor y se promedia el
 * resto. Con más de un DNF el promedio es DNF. Devuelve null si faltan tiempos.
 */
export function averageOf(times, n) {
  if (times.length < n) return null;
  const last = times.slice(-n).sort((a, b) => a - b);
  const trimmed = last.slice(1, -1);
  if (trimmed.some((t) => !Number.isFinite(t))) return Infinity;
  return trimmed.reduce((sum, t) => sum + t, 0) / trimmed.length;
}

export function mean(times) {
  if (!times.length) return null;
  if (times.some((t) => !Number.isFinite(t))) return Infinity;
  return times.reduce((sum, t) => sum + t, 0) / times.length;
}

/** Mejor promedio de n en toda la lista. */
export function bestAverageOf(times, n) {
  let best = null;
  for (let i = n; i <= times.length; i++) {
    const avg = averageOf(times.slice(i - n, i), n);
    if (avg != null && (best == null || avg < best)) best = avg;
  }
  return best;
}

export function summarize(times) {
  const finite = times.filter(Number.isFinite);
  return {
    count: times.length,
    best: finite.length ? Math.min(...finite) : times.length ? Infinity : null,
    ao5: averageOf(times, 5),
    ao12: averageOf(times, 12),
    bestAo5: bestAverageOf(times, 5),
    mean: finite.length ? mean(finite) : null,
  };
}
