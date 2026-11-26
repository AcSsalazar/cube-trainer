import styles from './Stats.module.css';
import { summarize } from '../lib/stats.js';
import { formatTime } from '../lib/time.js';
import { effectiveTime } from '../lib/session.js';
import { pop } from '../lib/animations.js';

const CARDS = [
  ['best', 'Mejor'],
  ['ao5', 'ao5'],
  ['ao12', 'ao12'],
  ['bestAo5', 'Mejor ao5'],
  ['mean', 'Media'],
  ['count', 'Solves'],
];

export function createStats(container, { session, getPuzzle }) {
  const root = document.createElement('section');
  root.className = styles.stats;
  root.innerHTML = CARDS.map(
    ([key, label]) => `
    <div class="${styles.card}">
      <span class="${styles.label}">${label}</span>
      <span class="${styles.value}" data-stat="${key}">-</span>
    </div>`,
  ).join('');
  container.append(root);

  function render() {
    const times = session.list(getPuzzle()).map(effectiveTime);
    const summary = summarize(times);
    for (const [key] of CARDS) {
      const el = root.querySelector(`[data-stat="${key}"]`);
      const text = key === 'count' ? String(summary.count) : formatTime(summary[key]);
      if (el.textContent !== text) {
        el.textContent = text;
        pop(el);
      }
    }
  }

  session.subscribe(render);
  render();
  return { render };
}
