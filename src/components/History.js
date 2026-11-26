import styles from './History.module.css';
import { formatTime } from '../lib/time.js';
import { effectiveTime } from '../lib/session.js';

export function createHistory(container, { session, getPuzzle }) {
  const root = document.createElement('section');
  root.className = styles.history;
  root.innerHTML = `
    <div class="${styles.header}">
      <h2 class="${styles.title}">Historial</h2>
      <button type="button" class="${styles.small}" data-action="clear">Borrar sesión</button>
    </div>
    <ol class="${styles.list}" reversed></ol>
  `;
  container.append(root);
  const list = root.querySelector('ol');

  function render() {
    const solves = session.list(getPuzzle());
    if (!solves.length) {
      list.innerHTML = `<li class="${styles.empty}">Aún no hay tiempos para este cubo.</li>`;
      return;
    }
    list.innerHTML = solves
      .map((s, i) => ({ s, i }))
      .reverse()
      .map(
        ({ s, i }) => `
        <li class="${styles.item}" data-id="${s.id}" title="${s.scramble ?? ''}">
          <span class="${styles.index}">${i + 1}.</span>
          <span class="${styles.time}">${formatTime(effectiveTime(s))}${s.penalty === '+2' ? '+' : ''}</span>
          <span class="${styles.actions}">
            <button type="button" class="${styles.small} ${s.penalty === '+2' ? styles.on : ''}" data-action="plus2">+2</button>
            <button type="button" class="${styles.small} ${s.penalty === 'DNF' ? styles.on : ''}" data-action="dnf">DNF</button>
            <button type="button" class="${styles.small}" data-action="remove" aria-label="Eliminar">x</button>
          </span>
        </li>`,
      )
      .join('');
  }

  root.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'clear') {
      if (confirm('¿Borrar todos los tiempos de este cubo?')) session.clear(getPuzzle());
      return;
    }
    const id = e.target.closest('[data-id]')?.dataset.id;
    const solve = session.list(getPuzzle()).find((s) => s.id === id);
    if (!solve) return;
    if (action === 'remove') session.remove(id);
    if (action === 'plus2') session.setPenalty(id, solve.penalty === '+2' ? null : '+2');
    if (action === 'dnf') session.setPenalty(id, solve.penalty === 'DNF' ? null : 'DNF');
  });

  session.subscribe(render);
  render();
  return { render };
}
