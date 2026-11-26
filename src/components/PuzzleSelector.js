import styles from './PuzzleSelector.module.css';
import { SCRAMBLERS } from '../lib/scramble.js';

export function createPuzzleSelector(container, { value = '3x3', onSelect } = {}) {
  const group = document.createElement('div');
  group.className = styles.group;
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-label', 'Tipo de cubo');

  const buttons = Object.entries(SCRAMBLERS).map(([id, { label }]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = styles.option;
    btn.textContent = label;
    btn.dataset.puzzle = id;
    btn.setAttribute('role', 'radio');
    btn.addEventListener('click', () => select(id));
    group.append(btn);
    return btn;
  });

  function paint(current) {
    for (const btn of buttons) {
      const on = btn.dataset.puzzle === current;
      btn.classList.toggle(styles.active, on);
      btn.setAttribute('aria-checked', String(on));
    }
  }

  function select(id) {
    if (id === value) return;
    value = id;
    paint(value);
    onSelect?.(value);
  }

  paint(value);
  container.append(group);
  return { select, get value() { return value; } };
}
