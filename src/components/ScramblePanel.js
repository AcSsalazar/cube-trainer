import styles from './ScramblePanel.module.css';
import { generateScramble, SCRAMBLERS } from '../lib/scramble.js';
import { revealMoves } from '../lib/animations.js';
import { createCubeNet } from './CubeNet.js';

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
    <div class="${styles.preview}"></div>
  `;
  container.append(root);

  const net = createCubeNet(root.querySelector(`.${styles.preview}`));

  const text = root.querySelector(`.${styles.scramble}`);
  const state = { puzzle, scramble: '' };

  function render() {
    text.innerHTML = state.scramble
      .split(' ')
      .map((m) => `<span class="${styles.move}">${m}</span>`)
      .join('');
    revealMoves(text.querySelectorAll(`.${styles.move}`));
    net.show(SCRAMBLERS[state.puzzle].size, state.scramble);
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
