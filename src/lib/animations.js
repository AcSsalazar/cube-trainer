import gsap from 'gsap';

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Muestra los movimientos del scramble uno tras otro. */
export function revealMoves(elements) {
  if (reduceMotion() || !elements.length) return;
  gsap.fromTo(
    elements,
    { autoAlpha: 0, y: 10, scale: 0.9 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)', stagger: 0.025 },
  );
}

/** Pequeño salto para destacar un valor que cambió. */
export function pop(element) {
  if (reduceMotion() || !element) return;
  gsap.fromTo(element, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
}

export function fadeIn(element) {
  if (reduceMotion() || !element) return;
  gsap.fromTo(element, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' });
}
