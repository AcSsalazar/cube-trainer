import styles from './Tabs.module.css';
import { fadeIn } from '../lib/animations.js';

/** Pestañas simples: cada pestaña muestra uno de los paneles dados. */
export function createTabs(container, tabs, { onChange } = {}) {
  const nav = document.createElement('nav');
  nav.className = styles.tabs;
  nav.setAttribute('role', 'tablist');
  nav.innerHTML = tabs
    .map(({ id, label }) => `<button type="button" role="tab" class="${styles.tab}" data-tab="${id}">${label}</button>`)
    .join('');
  container.append(nav);

  let current = null;

  function select(id) {
    if (id === current) return;
    current = id;
    for (const tab of tabs) {
      const on = tab.id === id;
      tab.panel.hidden = !on;
      const btn = nav.querySelector(`[data-tab="${tab.id}"]`);
      btn.classList.toggle(styles.active, on);
      btn.setAttribute('aria-selected', String(on));
      if (on) fadeIn(tab.panel);
    }
    onChange?.(id);
  }

  nav.addEventListener('click', (e) => {
    const id = e.target.closest('[data-tab]')?.dataset.tab;
    if (id) select(id);
  });

  select(tabs[0].id);
  return { select, get current() { return current; } };
}
