import { useEffect, useRef } from 'react';

/** Interpolation factor toward cursor (lower = smoother, more lag). */
const LERP = 0.12;

/**
 * Tracks pointer position in viewport space (0–1), smoothed with lerp each frame.
 * Writes `--pointer-x` and `--pointer-y` on `document.documentElement` for CSS-driven
 * spotlight and parallax (StringTune-style, without the third-party runtime).
 *
 * - Disabled when `prefers-reduced-motion: reduce` (vars stay centered at 0.5).
 * - Disabled for coarse / touch primary pointers (vars stay at 0.5).
 * - Uses a single `requestAnimationFrame` loop and one `mousemove` listener.
 */
export function useSmoothedPointerCssVars(): void {
  const targetX = useRef(0.5);
  const targetY = useRef(0.5);
  const currentX = useRef(0.5);
  const currentY = useRef(0.5);
  const rafId = useRef<number>(0);
  const reducedRef = useRef(false);
  const coarseRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');

    const readFlags = () => {
      reducedRef.current = mqReduce.matches;
      coarseRef.current = mqCoarse.matches;
    };

    const applyCentered = () => {
      currentX.current = 0.5;
      currentY.current = 0.5;
      targetX.current = 0.5;
      targetY.current = 0.5;
      root.style.setProperty('--pointer-x', '0.5');
      root.style.setProperty('--pointer-y', '0.5');
    };

    const onMove = (e: MouseEvent) => {
      if (reducedRef.current || coarseRef.current) return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetX.current = e.clientX / w;
      targetY.current = e.clientY / h;
    };

    const tick = () => {
      readFlags();
      if (reducedRef.current || coarseRef.current) {
        applyCentered();
      } else {
        const tx = targetX.current;
        const ty = targetY.current;
        const cx = currentX.current + (tx - currentX.current) * LERP;
        const cy = currentY.current + (ty - currentY.current) * LERP;
        currentX.current = cx;
        currentY.current = cy;
        root.style.setProperty('--pointer-x', cx.toFixed(5));
        root.style.setProperty('--pointer-y', cy.toFixed(5));
      }
      rafId.current = requestAnimationFrame(tick);
    };

    readFlags();
    if (mqReduce.matches || mqCoarse.matches) {
      applyCentered();
    }

    const onPrefsChange = () => {
      readFlags();
      if (mqReduce.matches || mqCoarse.matches) applyCentered();
    };

    mqReduce.addEventListener('change', onPrefsChange);
    mqCoarse.addEventListener('change', onPrefsChange);
    window.addEventListener('mousemove', onMove, { passive: true });

    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMove);
      mqReduce.removeEventListener('change', onPrefsChange);
      mqCoarse.removeEventListener('change', onPrefsChange);
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
    };
  }, []);
}
