import React from 'react';
import { useSmoothedPointerCssVars } from '../../hooks/useSmoothedPointerCssVars';

/**
 * Fixed overlay: soft dual radial glow following `--pointer-x` / `--pointer-y`.
 * Sits above starfield, below main UI. Pointer-events none; does not affect contrast of text.
 */
export function PointerSpotlightLayer() {
  useSmoothedPointerCssVars();

  return (
    <div
      className="pointer-spotlight-layer absolute inset-0 z-[2] pointer-events-none"
      aria-hidden
    />
  );
}
