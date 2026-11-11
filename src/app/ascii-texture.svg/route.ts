import { CELL, REST_RGB, restGlyph, restLevel } from "../ascii-glyphs";

// A tile of the resting field at t = 0, for screens where the field stays still (touch, reduced motion).
// It paints with the page, so those devices skip the canvas, its JavaScript and a late visual change.
const COLUMNS = 40;
const ROWS = 40;
const SIZE = COLUMNS * CELL;

function escapeXml(glyph: string) {
  return glyph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function GET() {
  const glyphs: string[] = [];

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const rest = restLevel(column, row, 0);
      const glyph = restGlyph(column, row, 0);

      if (rest === 0 || !glyph) continue;

      // Same opacity the canvas uses behind the text column on narrow screens.
      const alpha = ((0.018 + rest * 0.032) * 0.45).toFixed(4);

      glyphs.push(`<text x="${column * CELL + CELL / 2}" y="${row * CELL + CELL / 2}" fill-opacity="${alpha}">${escapeXml(glyph)}</text>`);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><g fill="rgb(${REST_RGB.join(" ")})" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" text-anchor="middle" dominant-baseline="central">${glyphs.join("")}</g></svg>`;

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
