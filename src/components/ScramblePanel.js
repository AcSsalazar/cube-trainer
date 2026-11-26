import styles from './ScramblePanel.module.css';
import { generateScramble } from '../lib/scramble.js';

export function createScramblePanel(container, { puzzle = '3x3', onChange } = {}) {
  const root = document.createElement('section');
  root.className = styles.panel;
  root.innerHTML = `
    <div class="${styles.toolbar}">
      <div data-slot="left"></div>
      <div data-slot="right">
        <button type="button" class="${styles.button}" data-action="next">Nuevo scramble</button>
      </div>
    </div>
    <p class="${styles.scramble}" aria-live="polite"></p>
  `;
  container.append(root);

  const text = root.querySelector(`.${styles.scramble}`);
  const state = { puzzle, scramble: '' };

  function render() {
    text.innerHTML = state.scramble
      .split(' ')
      .map((m) => `<span class="${styles.move}">${m}</span>`)
      .join('');
  }

  function next() {
    state.scramble = generateScramble(state.puzzle);
    render();
    onChange?.(state.scramble, state.puzzle);
    return state.scramble;
  }

  root.querySelector('[data-action="next"]').addEventListener('click', next);
  next();

  return {
    root,
    next,
    get scramble() {
      return state.scramble;
    },
    get puzzle() {
      return state.puzzle;
    },
    setPuzzle(value) {
      state.puzzle = value;
      next();
    },
    slot: (name) => root.querySelector(`[data-slot="${name}"]`),
    buttonClass: styles.button,
    moveSelector: `.${styles.move}`,
  };
}
