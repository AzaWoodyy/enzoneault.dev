"use client";

import { useEffect, useRef } from "react";

const GUTTER = 28;
const SAMPLES = 400;
const READ_LINE = 0.55;

type Anchor = { top: number; bottom: number; left: number };

/**
 * Layout position relative to the wrapper. Offsets ignore CSS transforms, so the entrance animations
 * (which translate sections while they play) never shift the thread or its dots.
 */
function within(element: Element, wrapper: HTMLElement): Anchor | undefined {
  if (!(element instanceof HTMLElement)) return undefined;

  let top = 0;
  let left = 0;
  let node: HTMLElement | undefined = element;

  while (node && node !== wrapper) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : undefined;
  }

  return { top, bottom: top + element.offsetHeight, left };
}

/**
 * A thread that draws itself down the left margin as the page scrolls, from the experience timeline,
 * past the projects, to the end of the education timeline.
 * Each timeline entry has a dot that lights up when the thread reaches it.
 */
export function ScrollThread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    const dots = dotsRef.current;
    const wrapper = svg?.parentElement;

    if (!svg || !track || !progress || !dots || !wrapper) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let totalLength = 0;
    let lengthAtY: number[] = [];
    let dotLengths: number[] = [];
    let frame = 0;

    function lengthFor(y: number) {
      if (lengthAtY.length === 0) return 0;

      const index = Math.max(0, Math.min(lengthAtY.length - 1, Math.round(y)));

      return lengthAtY[index] ?? 0;
    }

    function build() {
      if (!svg || !track || !progress || !dots || !wrapper) return;

      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;
      const experience = wrapper.querySelector("[data-thread='experience']");
      const education = wrapper.querySelector("[data-thread='education']");
      const exp = experience ? within(experience, wrapper) : undefined;
      const edu = education ? within(education, wrapper) : undefined;

      if (!exp || !edu) return;

      // On narrow screens the margin is smaller than the gutter: center the thread in it instead of hugging the edge.
      const leftX = Math.max(exp.left / 2, exp.left - GUTTER);
      const d = `M ${leftX} ${exp.top} L ${leftX} ${edu.bottom}`;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      track.setAttribute("d", d);
      progress.setAttribute("d", d);
      totalLength = progress.getTotalLength();
      progress.style.strokeDasharray = `${totalLength}`;

      // The path only ever goes down, so map each pixel row to the path length that reaches it.
      lengthAtY = Array.from({ length: Math.ceil(height) + 1 }, () => 0);

      let previousY = 0;
      let previousLength = 0;

      for (let sample = 0; sample <= SAMPLES; sample += 1) {
        const length = (sample / SAMPLES) * totalLength;
        const point = progress.getPointAtLength(length);

        for (let y = Math.ceil(previousY); y <= Math.min(lengthAtY.length - 1, Math.floor(point.y)); y += 1) {
          lengthAtY[y] = previousLength + ((y - previousY) / Math.max(1, point.y - previousY)) * (length - previousLength);
        }

        previousY = point.y;
        previousLength = length;
      }

      for (let y = Math.ceil(previousY); y < lengthAtY.length; y += 1) lengthAtY[y] = totalLength;

      // One dot per timeline entry, on the left margin at the entry's first line.
      dots.replaceChildren();
      dotLengths = [];

      for (const entry of wrapper.querySelectorAll("[data-thread-dot]")) {
        const anchor = within(entry, wrapper);

        if (!anchor) continue;

        const y = anchor.top + 10;
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        dot.setAttribute("cx", String(leftX));
        dot.setAttribute("cy", String(y));
        dot.setAttribute("r", "3");
        dots.append(dot);
        dotLengths.push(lengthFor(y));
      }

      update();
    }

    function update() {
      if (!progress || !dots || !wrapper) return;

      frame = 0;

      const origin = wrapper.getBoundingClientRect();
      const reached = reducedMotion ? totalLength : lengthFor(window.innerHeight * READ_LINE - origin.top);

      progress.style.strokeDashoffset = `${totalLength - reached}`;

      for (const [index, dot] of [...dots.children].entries()) {
        dot.toggleAttribute("data-lit", (dotLengths[index] ?? Number.POSITIVE_INFINITY) <= reached);
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const observer = new ResizeObserver(build);

    observer.observe(wrapper);
    build();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Web fonts can reflow the timeline after first paint.
    void document.fonts.ready.then(build);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <svg ref={svgRef} aria-hidden="true" className="scroll-thread pointer-events-none absolute inset-0 -z-[5] h-full w-full">
      <path ref={trackRef} className="scroll-thread-track" fill="none" />
      <path ref={progressRef} className="scroll-thread-progress" fill="none" />
      <g ref={dotsRef} className="scroll-thread-dots" />
    </svg>
  );
}
