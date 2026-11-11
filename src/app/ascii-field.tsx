"use client";

import { useEffect, useRef } from "react";
import { CELL, GLYPHS, GLYPH_LIFETIME, hash, REST_RGB, restGlyph, restLevel } from "./ascii-glyphs";

const FRAME_MS = 1000 / 30;
const INK_DIFFUSION = 0.2;
const INK_DECAY = 0.955;
const LAMP_RADIUS = 150;
const FOOTER_FADE = 320;
const CONTENT_EDGE = 48;

// A soft blue for whatever the pointer touches.
const LIT_RGB = [56, 110, 190] as const;

function mix(from: number, to: number, amount: number) {
  return Math.round(from + (to - from) * amount);
}

/**
 * A field of mono characters behind the page. At rest it is a slowly evolving, ink-coloured texture.
 * Around the pointer, and along the trail it leaves, characters light up in a soft blue and
 * scramble, like the edge of a torch beam; the trail spreads, fades and the field settles back to rest.
 */
export function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Animate only for a fine pointer with motion allowed. Touch screens and reduced motion show the static
    // SVG texture instead (see ascii-texture.svg), painted with the page and without any JavaScript.
    const animated =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const canvas = canvasRef.current;
    const context = animated ? canvas?.getContext("2d") : undefined;

    if (!canvas || !context) return;

    const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono") || "monospace";
    let viewWidth = 0;
    let viewHeight = 0;
    let columns = 0;
    let rows = 0;
    let ink = new Float32Array(0);
    let next = new Float32Array(0);
    let footerTop = Number.POSITIVE_INFINITY;
    let contentLeft = 0;
    let contentRight = 0;
    let pointer: { x: number; y: number } | undefined;
    let lamp = 0;
    let frame = 0;
    let lastDraw = 0;

    function layout() {
      if (!canvas || !context) return;

      const ratio = window.devicePixelRatio || 1;

      viewWidth = window.innerWidth;
      viewHeight = window.innerHeight;
      canvas.width = Math.round(viewWidth * ratio);
      canvas.height = Math.round(viewHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.font = `11px ${fontFamily}`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const footer = document.querySelector("footer");

      footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;

      const content = document.querySelector("main")?.getBoundingClientRect();

      contentLeft = content?.left ?? 0;
      contentRight = content?.right ?? 0;

      const nextColumns = Math.ceil(viewWidth / CELL) + 1;
      const nextRows = Math.ceil(document.documentElement.scrollHeight / CELL) + 1;

      if (nextColumns !== columns || nextRows !== rows) {
        columns = nextColumns;
        rows = nextRows;
        ink = new Float32Array(columns * rows);
        next = new Float32Array(columns * rows);
      }
    }

    function deposit(worldX: number, worldY: number, amount: number) {
      const column = Math.round(worldX / CELL);
      const row = Math.round(worldY / CELL);

      if (column < 1 || row < 1 || column >= columns - 1 || row >= rows - 1) return;

      const index = row * columns + column;

      ink[index] = Math.min(1.6, (ink[index] ?? 0) + amount);
    }

    function onPointerMove(event: PointerEvent) {
      const point = { x: event.clientX, y: event.clientY + window.scrollY };
      const previous = pointer ?? point;
      const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
      const steps = Math.max(1, Math.ceil(distance / (CELL / 2)));
      const amount = Math.min(0.9, distance * 0.03);

      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;

        deposit(previous.x + (point.x - previous.x) * progress, previous.y + (point.y - previous.y) * progress, amount);
      }

      pointer = point;
    }

    function onPointerLeave() {
      pointer = undefined;
    }

    // The trail spreads to its neighbours and fades, so the field always returns to rest.
    function stepInk() {
      for (let row = 1; row < rows - 1; row += 1) {
        for (let column = 1; column < columns - 1; column += 1) {
          const index = row * columns + column;
          const center = ink[index] ?? 0;
          const around = (ink[index - 1] ?? 0) + (ink[index + 1] ?? 0) + (ink[index - columns] ?? 0) + (ink[index + columns] ?? 0);

          next[index] = (center + INK_DIFFUSION * (around / 4 - center)) * INK_DECAY;
        }
      }

      [ink, next] = [next, ink];
      // The lamp eases in when the pointer arrives and out when it leaves.
      lamp += ((pointer ? 1 : 0) - lamp) * 0.12;
    }

    function draw(time: number) {
      if (!context) return;

      const t = time / 1000;
      const scroll = window.scrollY;
      const firstRow = Math.max(0, Math.floor(scroll / CELL));
      const lastRow = Math.min(rows - 1, Math.ceil((scroll + viewHeight) / CELL));
      const flicker = Math.floor(t * 12);

      context.clearRect(0, 0, viewWidth, viewHeight);

      for (let row = firstRow; row <= lastRow; row += 1) {
        const worldY = row * CELL + CELL / 2;
        const fade = Math.max(0, Math.min(1, (footerTop - worldY) / FOOTER_FADE));

        if (fade === 0) continue;

        for (let column = 0; column < columns; column += 1) {
          const worldX = column * CELL + CELL / 2;
          const rest = restLevel(column, row, t);
          const near = pointer ? Math.max(0, 1 - Math.hypot(worldX - pointer.x, worldY - pointer.y) / LAMP_RADIUS) : 0;
          const lit = Math.min(1, Math.max(ink[row * columns + column] ?? 0, near * near * lamp));

          // Leave quiet gaps where the field is low, unless the pointer lights them up.
          if (rest === 0 && lit < 0.05) continue;

          const phase = hash(row, column) * GLYPH_LIFETIME;
          const scrambles = lit > 0.12 && hash(column + flicker, row) < lit * 0.6;
          const seed = scrambles ? flicker : Math.floor((t + phase) / GLYPH_LIFETIME);
          const glyph = scrambles ? GLYPHS[Math.floor(hash(column * 3 + seed, row * 7 - seed) * GLYPHS.length)] : restGlyph(column, row, seed);

          if (!glyph) continue;

          // Behind the text column the field steps back, so it never fights the copy for contrast.
          const outside = Math.max(contentLeft - worldX, worldX - contentRight, 0);
          const shield = Math.max(0, 1 - outside / CONTENT_EDGE);
          const alpha = ((0.018 + rest * 0.032) * (1 - shield * 0.55) + lit * 0.36 * (1 - shield * 0.8)) * fade;

          context.fillStyle = `rgba(${mix(REST_RGB[0], LIT_RGB[0], lit)}, ${mix(REST_RGB[1], LIT_RGB[1], lit)}, ${mix(REST_RGB[2], LIT_RGB[2], lit)}, ${alpha})`;
          context.fillText(glyph, worldX, worldY - scroll);
        }
      }
    }

    function loop(time: number) {
      frame = 0;

      if (document.hidden) return;

      if (time - lastDraw >= FRAME_MS) {
        lastDraw = time;
        stepInk();
        draw(time);
      }

      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (!frame) frame = requestAnimationFrame(loop);
    }

    layout();
    start();
    window.addEventListener("resize", layout);
    document.addEventListener("visibilitychange", start);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", layout);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="ascii-canvas pointer-events-none fixed inset-0 -z-10 h-screen w-screen" />;
}
