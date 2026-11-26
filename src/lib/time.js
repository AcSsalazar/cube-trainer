/** Formatea milisegundos como 12.34 o 1:02.34. Infinity = DNF. */
export function formatTime(ms) {
  if (ms == null) return '-';
  if (!Number.isFinite(ms)) return 'DNF';
  const cs = Math.floor(ms / 10);
  const minutes = Math.floor(cs / 6000);
  const seconds = Math.floor((cs % 6000) / 100);
  const hundredths = String(cs % 100).padStart(2, '0');
  if (minutes > 0) return `${minutes}:${String(seconds).padStart(2, '0')}.${hundredths}`;
  return `${seconds}.${hundredths}`;
}
