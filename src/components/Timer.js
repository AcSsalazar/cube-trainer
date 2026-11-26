import styles from './Timer.module.css';
import { formatTime } from '../lib/time.js';
import { pop } from '../lib/animations.js';

const HOLD_MS = 300;

/**
 * Cronómetro estilo competencia: mantener espacio (o tocar) hasta que se
 * ponga verde, soltar para empezar y presionar de nuevo para parar.
 */
export function createTimer(container, { onSolve } = {}) {
  const root = document.createElement('section');
  root.className = styles.timer;
  root.innerHTML = `
    <div class="${styles.display}">0.00</div>
    <p class="${styles.hint}">Mantén espacio hasta que esté en verde y suelta para empezar</p>
  `;
  container.append(root);

  const display = root.querySelector(`.${styles.display}`);
  let state = 'idle';
  let holdTimer = null;
  let startedAt = 0;
  let frame = null;

  function setState(next) {
    root.classList.remove(styles[state]);
    state = next;
    if (styles[state]) root.classList.add(styles[state]);
  }

  function tick() {
    display.textContent = formatTime(performance.now() - startedAt);
    frame = requestAnimationFrame(tick);
  }

  function press() {
    if (state === 'running') {
      cancelAnimationFrame(frame);
      const ms = performance.now() - startedAt;
      display.textContent = formatTime(ms);
      setState('stopped');
      pop(display);
      onSolve?.(ms);
      return;
    }
    if (state === 'idle' || state === 'stopped') {
      setState('holding');
      holdTimer = setTimeout(() => setState('ready'), HOLD_MS);
    }
  }

  function release() {
    clearTimeout(holdTimer);
    if (state === 'ready') {
      startedAt = performance.now();
      setState('running');
      tick();
    } else if (state === 'holding') {
      setState('idle');
    } else if (state === 'stopped') {
      setState('idle');
    }
  }

  const isTyping = (e) => e.target.closest?.('input, textarea, select');

  window.addEventListener('keydown', (e) => {
    if (isTyping(e)) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) press();
    } else if (state === 'running') {
      press();
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && !isTyping(e)) release();
  });
  root.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    press();
  });
  root.addEventListener('pointerup', release);

  return {
    root,
    get state() {
      return state;
    },
  };
}
