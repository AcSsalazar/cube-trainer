import styles from './Manual.module.css';
import { METHODS } from '../data/manual.js';
import { STAGES } from '../lib/cube.js';
import { createCubeNet } from './CubeNet.js';
import { SETS } from './Trainer.js';
import { fadeIn } from '../lib/animations.js';

const escape = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function algRows(list) {
  return list
    .map(
      (a) => `
      <div class="${styles.alg}">
        <strong>${escape(a.name)}</strong>
        <span><code>${escape(a.alg)}</code>${a.note ? `<br><small>${escape(a.note)}</small>` : ''}</span>
      </div>`,
    )
    .join('');
}

/** Manual del método Fridrich. onTrain(setId) abre ese set en el entrenador. */
export function createManual(container, { onTrain } = {}) {
  const root = document.createElement('section');
  root.className = styles.manual;
  container.append(root);

  let current = Object.keys(METHODS)[0];

  function render() {
    const method = METHODS[current];
    root.innerHTML = `
      <div class="${styles.switch}">
        ${Object.entries(METHODS)
          .map(
            ([id, m]) =>
              `<button type="button" class="${styles.method} ${id === current ? styles.active : ''}" data-method="${id}">${m.label}</button>`,
          )
          .join('')}
      </div>
      <article class="${styles.intro}">
        ${method.intro.map((p) => `<p>${escape(p)}</p>`).join('')}
      </article>
      ${method.steps
        .map((step, i) => {
          const algs = step.algs ?? (step.algsFrom && SETS[step.algsFrom]?.cases) ?? [];
          return `
        <article class="${styles.step}">
          <header>
            <h2>${escape(step.title)}</h2>
            <p class="${styles.goal}">${escape(step.goal)}</p>
          </header>
          <div class="${styles.figure}" data-figure="${i}"></div>
          <div class="${styles.body}">
            ${step.text.map((p) => `<p>${escape(p)}</p>`).join('')}
            ${step.tips?.length ? `<ul class="${styles.tips}">${step.tips.map((t) => `<li>${escape(t)}</li>`).join('')}</ul>` : ''}
          </div>
          ${algs.length ? `<div class="${styles.algs}">${algRows(algs)}</div>` : ''}
          ${step.note ? `<p class="${styles.note}">${escape(step.note)}</p>` : ''}
          ${step.trainer && SETS[step.trainer] ? `<button type="button" class="${styles.train}" data-train="${step.trainer}">Practicar en el entrenador</button>` : ''}
        </article>`;
        })
        .join('')}
    `;

    method.steps.forEach((step, i) => {
      if (!step.stage) return;
      const net = createCubeNet(root.querySelector(`[data-figure="${i}"]`));
      net.show(step.size ?? 3, step.view ?? 'z2', STAGES[step.stage]);
    });
    fadeIn(root);
  }

  root.addEventListener('click', (e) => {
    const method = e.target.closest('[data-method]')?.dataset.method;
    if (method && method !== current) {
      current = method;
      render();
      return;
    }
    const set = e.target.closest('[data-train]')?.dataset.train;
    if (set) onTrain?.(set);
  });

  render();
  return { root, get method() { return current; } };
}
