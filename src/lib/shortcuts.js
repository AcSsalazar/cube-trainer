/**
 * Atajos de teclado globales. Se ignoran mientras se escribe en un campo
 * o cuando hay teclas modificadoras (para no chocar con el navegador).
 */
export function registerShortcuts(map) {
  const handler = (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest?.('input, textarea, select')) return;
    const action = map[e.key.toLowerCase()];
    if (action && action(e) !== false) e.preventDefault();
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
