import styles from './Trainer.module.css';
import { PLL, PLL_2LOOK } from '../data/pll.js';
import { OLL } from '../data/oll.js';
import { PARITY_4X4 } from '../data/parity.js';
import { F2L_BASIC } from '../data/f2l.js';
import { invertAlg } from '../lib/moves.js';
import { createCubeNet } from './CubeNet.js';
import { fadeIn } from '../lib/animations.js';

export const SETS = {
  f2l: { label: 'F2L básico', size: 3, cases: F2L_BASIC },
  oll: { label: 'OLL 2 pasos', size: 3, cases: OLL },
  pll2: { label: 'PLL 2 pasos', size: 3, cases: PLL_2LOOK },
  pll: { label: 'PLL', size: 3, cases: PLL },
  parity: { label: 'Paridad 4x4', size: 4, cases: PARITY_4X4 },
};

// Los casos se muestran con amarillo arriba, como se suelen practicar.
const ORIENTATION = 'z2';

/** Secuencia que lleva un cubo resuelto al caso: el inverso del algoritmo. */
export function setupFor(alg) {
  return invertAlg(alg);
}

export function createTrainer(container, { rng = Math.random } = {}) {
  const root = document.createElement('section');
  root.className = styles.trainer;
  root.innerHTML = `
    <div class="${styles.card}">
      <div class="${styles.sets}">
        ${Object.entries(SETS)
          .map(([id, s]) => `<button type="button" class="${styles.set}" data-set="${id}">${s.label}</button>`)
          .join('')}
      </div>
      <div data-role="net"></div>
      <p class="${styles.setup}">Para armar el caso: <code data-role="setup"></code></p>
      <div class="${styles.answer} ${styles.hidden}" data-role="answer">
        <span class="${styles.name}" data-role="name"></span>
        <span class="${styles.alg}" data-role="alg"></span>
      </div>
      <div class="${styles.actions}">
        <button type="button" class="${styles.button}" data-action="reveal">Mostrar solución</button>
        <button type="button" class="${styles.button} ${styles.primary}" data-action="next">Siguiente caso</button>
      </div>
    </div>
    <div class="${styles.list}" data-role="list"></div>
  `;
  container.append(root);

  const $ = (sel) => root.querySelector(sel);
  const net = createCubeNet($('[data-role="net"]'));
  const state = { set: 'pll', current: null };

  function renderList() {
    $('[data-role="list"]').innerHTML = SETS[state.set].cases
      .map((c) => `<div class="${styles.row}"><strong>${c.name}</strong><span class="${styles.alg}">${c.alg}</span></div>`)
      .join('');
  }

  function next() {
    const { cases, size } = SETS[state.set];
    let pick;
    do {
      pick = cases[Math.floor(rng() * cases.length)];
    } while (cases.length > 1 && pick === state.current);
    state.current = pick;

    const setup = setupFor(pick.alg);
    net.show(size, `${ORIENTATION} ${setup}`);
    $('[data-role="setup"]').textContent = `${ORIENTATION} ${setup}`;
    $('[data-role="name"]').textContent = pick.name;
    $('[data-role="alg"]').textContent = pick.alg;
    $('[data-role="answer"]').classList.add(styles.hidden);
    fadeIn(net.root);
  }

  function selectSet(id) {
    state.set = id;
    state.current = null;
    root.querySelectorAll('[data-set]').forEach((b) => b.classList.toggle(styles.active, b.dataset.set === id));
    renderList();
    next();
  }

  root.addEventListener('click', (e) => {
    const set = e.target.closest('[data-set]')?.dataset.set;
    if (set) return selectSet(set);
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'next') next();
    if (action === 'reveal') {
      $('[data-role="answer"]').classList.remove(styles.hidden);
      fadeIn($('[data-role="answer"]'));
    }
  });

  selectSet(state.set);
  return { root, next, selectSet, reveal: () => $('[data-action="reveal"]').click() };
}
