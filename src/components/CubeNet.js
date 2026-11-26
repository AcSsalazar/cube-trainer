import styles from './CubeNet.module.css';
import { applyAlg, faces, maskCube, solvedCube } from '../lib/cube.js';

const AREAS = { U: 'u', L: 'l', F: 'f', R: 'r', B: 'b', D: 'd' };

/** Dibuja el cubo desplegado (U arriba, L F R B al centro, D abajo). */
export function renderNet(cube) {
  const f = faces(cube);
  const N = cube.size;
  return `
    <div class="${styles.net}" role="img" aria-label="Vista del cubo desplegado">
      ${Object.entries(AREAS)
        .map(
          ([face, area]) => `
        <div class="${styles.face}" style="grid-area:${area};grid-template-columns:repeat(${N}, var(--cell))">
          ${f[face]
            .flat()
            .map((c) => `<span class="${styles.sticker} ${styles[c]}"></span>`)
            .join('')}
        </div>`,
        )
        .join('')}
    </div>`;
}

export function createCubeNet(container) {
  const root = document.createElement('div');
  container.append(root);
  return {
    root,
    /** mask (opcional): filtro de stickers visibles; el resto se ve gris. */
    show(size, alg, mask) {
      const cube = solvedCube(size);
      if (mask) maskCube(cube, mask);
      root.innerHTML = renderNet(applyAlg(cube, alg));
    },
  };
}
