"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";

type StarTone = "gold" | "teal" | "wine" | "white";
type StarSize = "micro" | "small" | "medium";

type StarDef = {
  cx: number;
  cy: number;
  size: StarSize;
  tone: StarTone;
  /** Preferred candidates for rare idle sparks (every 5–10 min) */
  twinkle?: boolean;
  /** Soft four-ray flare behind a few important stars only */
  flare?: boolean;
};

type SegmentDef = {
  from: number;
  to: number;
  stroke: "gold" | "teal";
  /** Subtle quadratic bend in SVG units (0.15–0.45) */
  bend?: number;
};

type ConstellationDef = {
  id: string;
  desktopOnly: boolean;
  stars: StarDef[];
  segments: SegmentDef[];
};

const STAR_RADII: Record<StarSize, number> = {
  micro: 0.08,
  small: 0.14,
  medium: 0.22,
};

/**
 * viewBox 160×90 with preserveAspectRatio slice.
 * Artwork stays in y≈16–78; central content ~46–114 × 34–62 stays clear.
 */
const CONSTELLATIONS: ConstellationDef[] = [
  {
    id: "cassiopeia",
    desktopOnly: false,
    stars: [
      { cx: 48, cy: 22, size: "small", tone: "gold" },
      { cx: 60, cy: 17, size: "micro", tone: "gold", twinkle: true },
      { cx: 72, cy: 23, size: "medium", tone: "teal", flare: true },
      { cx: 84, cy: 16, size: "small", tone: "gold" },
      { cx: 96, cy: 21, size: "small", tone: "gold", twinkle: true },
    ],
    segments: [
      { from: 0, to: 1, stroke: "gold" },
      { from: 1, to: 2, stroke: "teal", bend: 0.22 },
      { from: 2, to: 3, stroke: "gold" },
      { from: 3, to: 4, stroke: "gold", bend: 0.18 },
    ],
  },
  {
    id: "ursa-major",
    desktopOnly: true,
    stars: [
      { cx: 8, cy: 24, size: "small", tone: "gold" },
      { cx: 16, cy: 20, size: "micro", tone: "gold", twinkle: true },
      { cx: 24, cy: 22, size: "small", tone: "gold" },
      { cx: 30, cy: 28, size: "medium", tone: "teal" },
      { cx: 26, cy: 36, size: "micro", tone: "gold" },
      { cx: 16, cy: 38, size: "small", tone: "gold" },
      { cx: 10, cy: 32, size: "micro", tone: "gold", twinkle: true },
    ],
    segments: [
      { from: 0, to: 1, stroke: "gold" },
      { from: 1, to: 2, stroke: "gold" },
      { from: 2, to: 3, stroke: "teal", bend: 0.2 },
      { from: 3, to: 4, stroke: "gold" },
      { from: 4, to: 5, stroke: "gold", bend: 0.25 },
      { from: 5, to: 6, stroke: "gold" },
    ],
  },
  {
    id: "orion",
    desktopOnly: true,
    stars: [
      { cx: 14, cy: 58, size: "small", tone: "gold" },
      { cx: 28, cy: 56, size: "small", tone: "gold" },
      { cx: 18, cy: 64, size: "medium", tone: "teal", twinkle: true },
      { cx: 24, cy: 66, size: "medium", tone: "gold", flare: true },
      { cx: 30, cy: 68, size: "small", tone: "gold" },
      { cx: 16, cy: 74, size: "micro", tone: "gold" },
      { cx: 34, cy: 72, size: "small", tone: "gold", twinkle: true },
    ],
    segments: [
      { from: 0, to: 2, stroke: "gold", bend: 0.2 },
      { from: 1, to: 4, stroke: "gold", bend: 0.18 },
      { from: 2, to: 3, stroke: "teal" },
      { from: 3, to: 4, stroke: "gold" },
      { from: 2, to: 5, stroke: "gold", bend: 0.28 },
      { from: 4, to: 6, stroke: "gold", bend: 0.22 },
    ],
  },
  {
    id: "cygnus",
    desktopOnly: true,
    stars: [
      { cx: 138, cy: 24, size: "medium", tone: "teal", twinkle: true, flare: true },
      { cx: 138, cy: 34, size: "small", tone: "gold" },
      { cx: 138, cy: 46, size: "small", tone: "gold" },
      { cx: 128, cy: 34, size: "micro", tone: "gold" },
      { cx: 148, cy: 34, size: "micro", tone: "gold", twinkle: true },
    ],
    segments: [
      { from: 0, to: 1, stroke: "teal" },
      { from: 1, to: 2, stroke: "gold", bend: 0.15 },
      { from: 3, to: 1, stroke: "gold" },
      { from: 1, to: 4, stroke: "gold" },
    ],
  },
];

/** Exactly two wine accents — small, discovered rather than dominant. */
const WINE_ACCENTS: StarDef[] = [
  { cx: 40, cy: 62, size: "small", tone: "wine" },
  { cx: 146, cy: 42, size: "small", tone: "wine" },
];

const FIELD_STARS: StarDef[] = [
  { cx: 5, cy: 42, size: "micro", tone: "gold" },
  { cx: 40, cy: 20, size: "micro", tone: "white", twinkle: true },
  { cx: 110, cy: 18, size: "micro", tone: "teal" },
  { cx: 155, cy: 60, size: "micro", tone: "gold" },
  { cx: 92, cy: 78, size: "micro", tone: "white", twinkle: true },
  { cx: 55, cy: 80, size: "micro", tone: "gold" },
  { cx: 22, cy: 48, size: "micro", tone: "white" },
];

const STAR_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const STAR_MS = 650;
const LINE_MS = 1150;
const SEGMENT_GAP_MS = 40;
const CONSTELLATION_STAGGER_MS = 420;
/** Idle star spark — rare enough to be atmospheric, not busy. */
const SPARK_MIN_MS = 5 * 60 * 1000;
const SPARK_MAX_MS = 10 * 60 * 1000;

function starRadius(star: StarDef): number {
  if (star.tone === "wine") return 0.18;
  if (star.tone === "white") return 0.06;
  return STAR_RADII[star.size];
}

function starFill(tone: StarTone): string {
  switch (tone) {
    case "teal":
      return "#72d5d2";
    case "wine":
      return "#9b3048";
    case "white":
      return "#f2ebe0";
    default:
      return "#d4aa45";
  }
}

function segmentPath(a: StarDef, b: StarDef, bend = 0): string {
  if (!bend) {
    return `M ${a.cx} ${a.cy} L ${b.cx} ${b.cy}`;
  }

  const mx = (a.cx + b.cx) / 2;
  const my = (a.cy + b.cy) / 2;
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const distance = Math.hypot(dx, dy) || 1;
  const nx = -dy / distance;
  const ny = dx / distance;

  return `M ${a.cx} ${a.cy} Q ${mx + nx * bend} ${my + ny * bend} ${b.cx} ${b.cy}`;
}

/** Approximate cubic-bezier(0.33, 0, 0.2, 1) for rAF progress. */
function lineEase(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  // Smooth ease-out that stays continuous without a hard stop.
  return 1 - (1 - clamped) ** 2.65;
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(() => resolve(), ms);
    const onAbort = () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function animateElement(
  el: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const animation = el.animate(keyframes, options);
    const onAbort = () => {
      animation.cancel();
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    animation.finished.then(
      () => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      },
      () => {
        signal.removeEventListener("abort", onAbort);
        reject(new DOMException("Aborted", "AbortError"));
      },
    );
  });
}

function prepareHiddenPath(path: SVGPathElement) {
  const length = Math.max(path.getTotalLength(), 0.001);
  path.style.transition = "none";
  path.style.setProperty("--path-length", `${length}`);
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;
  path.style.opacity = "0";
  path.classList.remove("isVisible");
  void path.getBoundingClientRect();
  return length;
}

function createDrawTip(svg: SVGSVGElement): SVGCircleElement {
  const tip = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  tip.setAttribute("r", "0.07");
  tip.setAttribute("class", "constellationDrawTip");
  tip.setAttribute("cx", "0");
  tip.setAttribute("cy", "0");
  tip.style.opacity = "0";
  svg.appendChild(tip);
  return tip;
}

async function drawPath(
  svg: SVGSVGElement,
  path: SVGPathElement,
  length: number,
  finalOpacity: number,
  signal: AbortSignal,
): Promise<void> {
  path.classList.add("isVisible");
  const tip = createDrawTip(svg);

  await new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      tip.remove();
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const start = performance.now();
    const onAbort = () => {
      tip.remove();
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });

    const frame = (now: number) => {
      if (signal.aborted) return;
      const raw = Math.min(1, (now - start) / LINE_MS);
      const t = lineEase(raw);

      path.style.strokeDashoffset = `${length * (1 - t)}`;

      let opacity = 0.04;
      if (t < 0.22) {
        opacity = 0.04 + (0.18 - 0.04) * (t / 0.22);
      } else {
        opacity = 0.18 + (finalOpacity - 0.18) * ((t - 0.22) / 0.78);
      }
      path.style.opacity = `${opacity}`;

      const point = path.getPointAtLength(t * length);
      tip.setAttribute("cx", `${point.x}`);
      tip.setAttribute("cy", `${point.y}`);
      tip.style.opacity =
        t > 0.03 && t < 0.97 ? `${0.55 + 0.25 * Math.sin(t * Math.PI)}` : "0";

      if (raw < 1) {
        requestAnimationFrame(frame);
        return;
      }

      signal.removeEventListener("abort", onAbort);
      tip.remove();
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      path.style.opacity = `${finalOpacity}`;
      resolve();
    };

    requestAnimationFrame(frame);
  });
}

async function lightStar(
  el: SVGCircleElement,
  signal: AbortSignal,
  awaitCompletion = true,
): Promise<void> {
  el.classList.add("isVisible");
  const flare =
    el.previousElementSibling instanceof SVGGElement &&
    el.previousElementSibling.classList.contains("constellationFlare")
      ? el.previousElementSibling
      : null;

  const run = animateElement(
    el,
    [
      { opacity: 0, transform: "scale(0.92)" },
      { opacity: 1, transform: "scale(1.035)", offset: 0.7 },
      { opacity: 0.92, transform: "scale(1)" },
    ],
    {
      duration: STAR_MS,
      easing: STAR_EASE,
      fill: "forwards",
    },
    signal,
  );

  if (flare) {
    void animateElement(
      flare,
      [
        { opacity: 0 },
        { opacity: 0.35, offset: 0.55 },
        { opacity: 0.22 },
      ],
      {
        duration: STAR_MS,
        easing: STAR_EASE,
        fill: "forwards",
      },
      signal,
    );
  }

  if (awaitCompletion) await run;
}

/**
 * Schedules a single distant timeout; does no work on load.
 * When it fires, briefly brightens 1–2 visible stars, then waits again.
 */
function scheduleRareStarSparks(root: SVGSVGElement, signal: AbortSignal) {
  let timeoutId = 0;

  const clear = () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = 0;
  };

  const queueNext = () => {
    if (signal.aborted) return;
    const delay =
      SPARK_MIN_MS + Math.random() * (SPARK_MAX_MS - SPARK_MIN_MS);
    timeoutId = window.setTimeout(sparkOnce, delay);
  };

  const sparkOnce = () => {
    if (signal.aborted) return;

    // Skip work while the tab is hidden; try again later.
    if (document.visibilityState === "hidden") {
      queueNext();
      return;
    }

    const preferred = root.querySelectorAll<SVGCircleElement>(
      ".constellationStar.isVisible.constellationStar--twinkle",
    );
    const pool =
      preferred.length > 0
        ? preferred
        : root.querySelectorAll<SVGCircleElement>(
            ".constellationStar.isVisible",
          );

    if (pool.length === 0) {
      queueNext();
      return;
    }

    const count = Math.min(pool.length, Math.random() < 0.4 ? 2 : 1);
    const used = new Set<number>();
    while (used.size < count) {
      used.add(Math.floor(Math.random() * pool.length));
    }

    for (const index of used) {
      const star = pool[index];
      star.classList.remove("constellationStar--spark");
      requestAnimationFrame(() => {
        if (signal.aborted) return;
        star.classList.add("constellationStar--spark");
      });
      star.addEventListener(
        "animationend",
        () => star.classList.remove("constellationStar--spark"),
        { once: true },
      );
    }

    queueNext();
  };

  signal.addEventListener("abort", clear, { once: true });
  queueNext();
}

function subscribeMedia(query: string, onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => subscribeMedia(query, onChange),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export function HeroConstellationSky() {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const runIdRef = useRef(0);

  useEffect(() => {
    const root = svgRef.current;
    if (!root) return;

    const controller = new AbortController();
    const { signal } = controller;
    const runId = ++runIdRef.current;
    const active = CONSTELLATIONS.filter((c) => !c.desktopOnly || isDesktop);

    const allPaths = () =>
      root.querySelectorAll<SVGPathElement>(".constellationPath");
    const allStars = () =>
      root.querySelectorAll<SVGCircleElement>(".constellationStar");

    allPaths().forEach((path) => prepareHiddenPath(path));
    allStars().forEach((star) => {
      star.classList.remove("isVisible");
      star.style.opacity = "0";
      star.style.transform = "scale(0.92)";
    });
    root.querySelectorAll(".constellationFlare").forEach((flare) => {
      (flare as SVGElement).style.opacity = "0";
    });
    root.querySelectorAll(".constellationDrawTip").forEach((tip) => tip.remove());

    const showFinal = () => {
      allPaths().forEach((path) => {
        prepareHiddenPath(path);
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
        const isTeal = path.classList.contains("constellationPath--teal");
        path.style.opacity = isTeal ? "0.3" : "0.34";
        path.classList.add("isVisible");
      });
      allStars().forEach((star) => {
        star.classList.add("isVisible");
        const isField = star.classList.contains("constellationStar--field");
        star.style.opacity = isField ? "0.55" : "0.92";
        star.style.transform = "scale(1)";
      });
      root.querySelectorAll<SVGGElement>(".constellationFlare").forEach((flare) => {
        flare.style.opacity = "0.22";
      });
    };

    if (reducedMotion) {
      showFinal();
      return () => controller.abort();
    }

    scheduleRareStarSparks(root, signal);

    async function runIntro() {
      const rootEl = root!;

      rootEl
        .querySelectorAll<SVGCircleElement>('[data-field-star="true"]')
        .forEach((star, index) => {
          window.setTimeout(() => {
            if (signal.aborted || runId !== runIdRef.current) return;
            star.classList.add("isVisible");
            void animateElement(
              star,
              [
                { opacity: 0, transform: "scale(0.92)" },
                { opacity: 0.55, transform: "scale(1)" },
              ],
              {
                duration: STAR_MS,
                easing: STAR_EASE,
                fill: "forwards",
              },
              signal,
            );
          }, index * 55);
        });

      rootEl
        .querySelectorAll<SVGCircleElement>('[data-wine-accent="true"]')
        .forEach((star, index) => {
          window.setTimeout(() => {
            if (signal.aborted || runId !== runIdRef.current) return;
            void lightStar(star, signal, false);
          }, 320 + index * 260);
        });

      await wait(140, signal);

      await Promise.all(
        active.map(async (constellation, cIndex) => {
          await wait(cIndex * CONSTELLATION_STAGGER_MS, signal);
          if (signal.aborted || runId !== runIdRef.current) return;

          const group = rootEl.querySelector(
            `[data-constellation="${constellation.id}"]`,
          );
          if (!group) return;

          const starEls = Array.from(
            group.querySelectorAll<SVGCircleElement>("[data-star-index]"),
          ).sort(
            (a, b) =>
              Number(a.dataset.starIndex) - Number(b.dataset.starIndex),
          );
          const pathEls = Array.from(
            group.querySelectorAll<SVGPathElement>("[data-segment-index]"),
          ).sort(
            (a, b) =>
              Number(a.dataset.segmentIndex) -
              Number(b.dataset.segmentIndex),
          );

          const lit = new Set<number>();
          const ensureStar = async (index: number, awaitFull: boolean) => {
            if (lit.has(index)) return;
            lit.add(index);
            const el = starEls[index];
            if (!el) return;
            await lightStar(el, signal, awaitFull);
          };

          const first = constellation.segments[0]?.from ?? 0;
          await ensureStar(first, true);
          await wait(60, signal);

          for (let s = 0; s < constellation.segments.length; s += 1) {
            if (signal.aborted || runId !== runIdRef.current) return;
            const segment = constellation.segments[s];
            const path = pathEls[s];
            if (!path) continue;

            await ensureStar(segment.from, false);
            const length = prepareHiddenPath(path);
            const finalOpacity = segment.stroke === "teal" ? 0.3 : 0.34;
            await drawPath(rootEl, path, length, finalOpacity, signal);
            // Softly illuminate destination without blocking the next thread.
            void ensureStar(segment.to, false);
            await wait(SEGMENT_GAP_MS, signal);
          }
        }),
      );
    }

    void runIntro().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error(error);
    });

    return () => {
      controller.abort();
      root.querySelectorAll(".constellationDrawTip").forEach((tip) => tip.remove());
    };
  }, [isDesktop, reducedMotion]);

  const visibleConstellations = CONSTELLATIONS.filter(
    (c) => !c.desktopOnly || isDesktop,
  );

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full hero-sky"
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {FIELD_STARS.map((star, index) => (
        <circle
          key={`field-${index}`}
          cx={star.cx}
          cy={star.cy}
          r={starRadius(star)}
          data-field-star="true"
          fill={starFill(star.tone)}
          className={`constellationStar constellationStar--field constellationStar--${star.tone}${star.twinkle ? " constellationStar--twinkle" : ""}`}
        />
      ))}

      {(isDesktop ? WINE_ACCENTS : []).map((star, index) => (
        <circle
          key={`wine-${index}`}
          cx={star.cx}
          cy={star.cy}
          r={starRadius(star)}
          fill={starFill("wine")}
          data-wine-accent="true"
          className="constellationStar constellationStar--wine"
        />
      ))}

      {visibleConstellations.map((constellation) => (
        <g
          key={constellation.id}
          data-constellation={constellation.id}
          className="hero-constellation"
        >
          {constellation.segments.map((segment, index) => {
            const a = constellation.stars[segment.from];
            const b = constellation.stars[segment.to];
            return (
              <path
                key={`${constellation.id}-seg-${index}`}
                d={segmentPath(a, b, segment.bend ?? 0)}
                data-segment-index={index}
                className={`constellationPath constellationPath--${segment.stroke}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="nonScalingStroke"
              />
            );
          })}
          {constellation.stars.map((star, index) => {
            const r = starRadius(star);
            return (
              <g key={`${constellation.id}-star-${index}`}>
                {star.flare ? (
                  <g
                    className="constellationFlare"
                    data-flare-for={index}
                    style={{ opacity: 0 }}
                  >
                    <line
                      x1={star.cx - 0.32}
                      y1={star.cy}
                      x2={star.cx + 0.32}
                      y2={star.cy}
                      className="constellationFlare-ray"
                    />
                    <line
                      x1={star.cx}
                      y1={star.cy - 0.32}
                      x2={star.cx}
                      y2={star.cy + 0.32}
                      className="constellationFlare-ray"
                    />
                  </g>
                ) : null}
                <circle
                  cx={star.cx}
                  cy={star.cy}
                  r={r}
                  data-star-index={index}
                  fill={starFill(star.tone)}
                  className={`constellationStar constellationStar--${star.tone}${star.twinkle ? " constellationStar--twinkle" : ""}`}
                />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
