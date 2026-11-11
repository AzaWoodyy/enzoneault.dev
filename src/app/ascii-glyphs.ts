// Shared by the animated canvas (fine pointers) and the static SVG texture (touch, reduced motion),
// so both draw the same field.

// Letters and symbols, no digits, like the torch field on aiforui.dev/lab.
export const GLYPHS = "abcdefghijklmnopqrstuvwxyz=+-*/\\|<>:;.,_~^()[]{}!?&%$#@";
export const GLYPH_LIFETIME = 18;
export const CELL = 16;

// Ink of the page at rest.
export const REST_RGB = [29, 27, 24] as const;

export function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43_758.545_3;

  return value - Math.floor(value);
}

/** Smooth value noise in [0, 1]. */
export function noise(x: number, y: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const top = hash(x0, y0) + (hash(x0 + 1, y0) - hash(x0, y0)) * u;
  const bottom = hash(x0, y0 + 1) + (hash(x0 + 1, y0 + 1) - hash(x0, y0 + 1)) * u;

  return top + (bottom - top) * v;
}

/** Resting level of the field at a cell and time, 0 where the field leaves a quiet gap. */
export function restLevel(column: number, row: number, seconds: number) {
  const field = noise(column * 0.07 + seconds * 0.04, row * 0.07 - seconds * 0.03) * 0.7 + noise(column * 0.19 - seconds * 0.05, row * 0.19) * 0.3;

  return Math.max(0, (field - 0.28) * 1.4);
}

/** The glyph a cell shows at rest for a given seed. */
export function restGlyph(column: number, row: number, seed: number) {
  return GLYPHS[Math.floor(hash(column * 3 + seed, row * 7 - seed) * GLYPHS.length)];
}
