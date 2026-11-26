import styles from './Timer.module.css';
import { formatTime } from '../lib/time.js';
import { pop } from '../lib/animations.js';

const HOLD_MS = 300;
const INSPECTION_MS = 15000;

/** Penalización WCA según el tiempo de inspección usado. */
export function inspectionPenalty(elapsedMs) {
  if (elapsedMs > INSPECTION_MS + 2000) return 'DNF';
  if (elapsedMs > INSPECTION_MS) return '+2';
  return null;
}

/**
 * Cronómetro estilo competencia: mantener espacio (o tocar) hasta que se
 * ponga verde, soltar para empezar y presionar de nuevo para parar.
 * Con inspección activa, el primer toque inicia la cuenta regresiva de 15 s.
 */
export function createTimer(container, { onSolve, inspection = false } = {}) {
  const root = document.createElement('section');
  root.className = styles.timer;
  root.innerHTML = `
    <div class="${styles.display}">0.00</div>
    <p class="${styles.hint}">Mantén espacio hasta que esté en verde y suelta para empezar</p>
    <label class="${styles.option}">
      <input type="checkbox" data-role="inspection" ${inspection ? 'checked' : ''} />
      Inspección de 15 s
    </label>
  `;
  container.append(root);

  const display = root.querySelector(`.${styles.display}`);
  const inspectionToggle = root.querySelector('[data-role="inspection"]');
  let state = 'idle';
  let holdTimer = null;
  let startedAt = 0;
  let inspectionStart = null;
  let frame = null;
  let inspectionFrame = null;

  function setState(next) {
    root.classList.remove(styles[state]);
    state = next;
    if (styles[state]) root.classList.add(styles[state]);
  }

  function tick() {
    display.textContent = formatTime(performance.now() - startedAt);
    frame = requestAnimationFrame(tick);
  }

  function inspectionTick() {
    const elapsed = performance.now() - inspectionStart;
    const penalty = inspectionPenalty(elapsed);
    display.textContent = penalty ?? String(Math.ceil((INSPECTION_MS - elapsed) / 1000));
    inspectionFrame = requestAnimationFrame(inspectionTick);
  }

  function startInspection() {
    inspectionStart = performance.now();
    setState('inspecting');
    inspectionTick();
  }

  function startSolve() {
    let penalty = null;
    if (inspectionStart != null) {
      penalty = inspectionPenalty(performance.now() - inspectionStart);
      cancelAnimationFrame(inspectionFrame);
      inspectionStart = null;
    }
    startedAt = performance.now();
    current.penalty = penalty;
    setState('running');
    tick();
  }

  const current = { penalty: null };

  function press() {
    if (state === 'running') {
      cancelAnimationFrame(frame);
      const ms = performance.now() - startedAt;
      display.textContent = formatTime(ms) + (current.penalty ? ` ${current.penalty}` : '');
      setState('stopped');
      pop(display);
      onSolve?.(ms, current.penalty);
      return;
    }
    if ((state === 'idle' || state === 'stopped') && inspectionToggle.checked) {
      setState('arming');
      return;
    }
    if (state === 'idle' || state === 'stopped' || state === 'inspecting') {
      setState('holding');
      holdTimer = setTimeout(() => setState('ready'), HOLD_MS);
    }
  }

  function release() {
    clearTimeout(holdTimer);
    if (state === 'arming') startInspection();
    else if (state === 'ready') startSolve();
    else if (state === 'holding') setState(inspectionStart != null ? 'inspecting' : 'idle');
    else if (state === 'stopped') setState('idle');
  }

  const isTyping = (e) => e.target.closest?.('input, textarea, select, label');
  const isHidden = () => Boolean(root.closest('[hidden]'));

  window.addEventListener('keydown', (e) => {
    if (isTyping(e) || isHidden()) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) press();
    } else if (state === 'running') {
      e.preventDefault();
      press();
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && !isTyping(e) && !isHidden()) release();
  });
  root.addEventListener('pointerdown', (e) => {
    if (isTyping(e)) return;
    e.preventDefault();
    press();
  });
  root.addEventListener('pointerup', (e) => {
    if (!isTyping(e)) release();
  });

  return {
    root,
    get state() {
      return state;
    },
  };
}
