"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import RepositoryReadmeNotice from "@/components/repository-readme-notice";
import type { ContentPageDownload } from "@/lib/content-pages";
import {
  clearPendingPageTransition,
  createCardTextOverlay,
  createPageTextOverlay,
  createPageTransitionGhost,
  getGhostTransformBetweenRects,
  getPageTransitionViewportRect,
  readPendingPageTransition,
  savePendingPageTransition,
} from "@/lib/page-transition";

type ContentPagePanelProps = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  backHref: string;
  showRepositoryReadmeNotice?: boolean;
  download?: ContentPageDownload | null;
  children: ReactNode;
};

const OPEN_PAGE_TRANSITION_DURATION_MS = 620;
const OPEN_PAGE_TRANSITION_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const EDGE_GLOW_RADIUS_PX = 180;

function shouldPrimeEntryTransition(slug: string) {
  if (typeof window === "undefined") return false;

  const transition = readPendingPageTransition();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return Boolean(
    transition &&
      transition.direction === "card-to-page" &&
      transition.slug === slug &&
      !prefersReducedMotion
  );
}

export default function ContentPagePanel({
  slug,
  title,
  eyebrow,
  description,
  backHref,
  showRepositoryReadmeNotice = false,
  download = null,
  children,
}: ContentPagePanelProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const [entryTransitionPrimed, setEntryTransitionPrimed] = useState(() =>
    shouldPrimeEntryTransition(slug)
  );

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let lastPointerPosition: { x: number; y: number; } | null = null;

    const resetGlow = () => {
      panel.style.setProperty("--glare-x", "50%");
      panel.style.setProperty("--glare-y", "50%");
      panel.style.setProperty("--edge-glow-opacity", "0");
    };

    const applyGlowFromPoint = (clientX: number, clientY: number) => {
      const rect = panel.getBoundingClientRect();
      const relativeX = ((clientX - rect.left) / rect.width) * 100;
      const relativeY = ((clientY - rect.top) / rect.height) * 100;
      const dx =
        clientX < rect.left ? rect.left - clientX : clientX > rect.right ? clientX - rect.right : 0;
      const dy =
        clientY < rect.top ? rect.top - clientY : clientY > rect.bottom ? clientY - rect.bottom : 0;
      const distanceFromPanel = Math.hypot(dx, dy);
      const glowStrength = Math.max(0, 1 - distanceFromPanel / EDGE_GLOW_RADIUS_PX);

      panel.style.setProperty("--glare-x", `${relativeX.toFixed(2)}%`);
      panel.style.setProperty("--glare-y", `${relativeY.toFixed(2)}%`);
      panel.style.setProperty("--edge-glow-opacity", glowStrength.toFixed(3));
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      lastPointerPosition = { x: event.clientX, y: event.clientY };
      applyGlowFromPoint(event.clientX, event.clientY);
    };

    const handleViewportChange = () => {
      if (!lastPointerPosition) {
        resetGlow();
        return;
      }

      applyGlowFromPoint(lastPointerPosition.x, lastPointerPosition.y);
    };

    resetGlow();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("blur", resetGlow);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("blur", resetGlow);
      resetGlow();
    };
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const transition = readPendingPageTransition();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    if (
      !transition ||
      transition.direction !== "card-to-page" ||
      transition.slug !== slug ||
      prefersReducedMotion
    ) {
      setEntryTransitionPrimed(false);
      if (transition?.direction === "card-to-page") {
        clearPendingPageTransition(transition);
      }
      return;
    }

    // Route changes can briefly preserve the old scroll position. We pin the
    // new page to the top first so the expanding box measures against the final
    // resting layout instead of a transient offset.
    root.classList.add("project-transition-no-smooth-scroll");
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }

    const targetRect = getPageTransitionViewportRect(panel.getBoundingClientRect());
    panel.style.willChange = "opacity";

    const ghost = createPageTransitionGhost(targetRect);
    const sourceTextOverlay =
      transition.sourceCardVariant && transition.sourceProjectType
        ? createCardTextOverlay(transition.sourceRect, {
            title,
            description: transition.sourceDescription,
            variant: transition.sourceCardVariant,
            projectType: transition.sourceProjectType,
          })
        : createPageTextOverlay(transition.sourceRect, {
            title,
            eyebrow: transition.sourceEyebrow,
            description: transition.sourceDescription,
          });
    const destinationTextOverlay = createPageTextOverlay(targetRect, {
      title,
      eyebrow,
      description,
    });
    destinationTextOverlay.style.opacity = "0.18";

    document.body.append(ghost, sourceTextOverlay, destinationTextOverlay);

    let frameOne = 0;
    let frameTwo = 0;
    let completed = false;

    const cleanup = () => {
      root.classList.remove("project-transition-no-smooth-scroll");
      panel.style.opacity = "1";
      panel.style.removeProperty("opacity");
      panel.style.removeProperty("willChange");
      ghost.remove();
      sourceTextOverlay.remove();
      destinationTextOverlay.remove();
      clearPendingPageTransition(transition);
    };

    frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(() => {
        const startTransform = getGhostTransformBetweenRects(transition.sourceRect, targetRect);

        // Fade the moving shell out near the end so its backdrop blur does not
        // disappear as a hard snap when the real panel is already visible.
        const ghostAnimation = ghost.animate(
          [
            {
              transform: startTransform,
              borderRadius: "1rem",
              opacity: 1,
            },
            {
              transform: "translate(0px, 0px) scale(1, 1)",
              borderRadius: "2rem",
              opacity: 1,
              offset: 0.72,
            },
            {
              transform: "translate(0px, 0px) scale(1, 1)",
              borderRadius: "2rem",
              opacity: 0,
            },
          ],
          {
            duration: OPEN_PAGE_TRANSITION_DURATION_MS,
            easing: OPEN_PAGE_TRANSITION_EASING,
            fill: "forwards",
          }
        );

        // Fade the old card text in place so the box can move without stretching
        // the typography. This keeps the transition feeling cleaner and faster.
        sourceTextOverlay.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          {
            duration: 110,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        // The destination header is drawn separately from the moving shell, so
        // it stays crisp while the box expands into place.
        destinationTextOverlay.animate(
          [{ opacity: 0.18 }, { opacity: 1 }],
          {
            duration: 220,
            delay: 80,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        panel.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          {
            duration: 240,
            delay: 220,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        ghostAnimation.finished
          .catch(() => undefined)
          .finally(() => {
            completed = true;
            cleanup();
            setEntryTransitionPrimed(false);
          });
      });
    });

    return () => {
      window.cancelAnimationFrame(frameOne);
      window.cancelAnimationFrame(frameTwo);
      cleanup();
      if (!completed) {
        setEntryTransitionPrimed(false);
      }
    };
  }, [description, eyebrow, slug, title]);

  const captureBackTransition = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) return;

    const rect = getPageTransitionViewportRect(panel.getBoundingClientRect());

    savePendingPageTransition({
      direction: "page-to-card",
      slug,
      title,
      sourceEyebrow: eyebrow,
      sourceDescription: description,
      sourceRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      recordedAt: Date.now(),
    });
  };

  const panelStyle: CSSProperties = {
    "--glare-x": "50%",
    "--glare-y": "50%",
    "--edge-glow-opacity": 0,
    ...(entryTransitionPrimed ? { opacity: 0, willChange: "opacity" } : {}),
  } as CSSProperties;

  return (
    <section
      ref={panelRef}
      className="group relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:p-8 md:p-12"
      style={panelStyle}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_58%),_linear-gradient(135deg,_rgba(125,211,252,0.12),_rgba(255,255,255,0.04),_rgba(15,23,42,0.72))]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15" />
        <div
          className="absolute inset-0 rounded-[2rem] transition-opacity duration-200 ease-out"
          style={{
            padding: "1.5px",
            opacity: "var(--edge-glow-opacity, 0)",
            background:
              "radial-gradient(460px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.9), rgba(125,211,252,0.48) 22%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0) 74%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            mixBlendMode: "screen",
            filter: "blur(2px)",
          }}
        />
      </div>

      <div className="relative z-10 space-y-6 pt-10 sm:space-y-8 sm:pt-12">
        <Link
          href={backHref}
          onClick={captureBackTransition}
          aria-label="Back"
          className="absolute top-0 left-0 inline-flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15.5 19.5 8 12l7.5-7.5" />
          </svg>
        </Link>

        <div className="space-y-6">
          <h1 className="font-title text-4xl leading-none text-white sm:text-5xl md:text-7xl">{title}</h1>
          <p className="max-w-3xl text-base leading-relaxed text-gray-200/90 sm:text-lg md:text-xl">
            {description}
          </p>
        </div>

        {showRepositoryReadmeNotice ? <RepositoryReadmeNotice /> : null}

        <div className="h-px w-full bg-white/10" />

        <div className="space-y-6">{children}</div>

        {download ? (
          <>
            <div className="h-px w-full bg-white/10" />
            <div className="flex justify-start">
              <a
                href={download.href}
                download={download.fileName}
                className="inline-flex items-center justify-center rounded-full border border-yellow-200/70 bg-yellow-200 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black transition-all duration-200 hover:border-yellow-100 hover:bg-[linear-gradient(135deg,_#fff2b0,_#fbbf24_55%,_#fff7d6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),_0_6px_16px_rgba(0,0,0,0.35)] sm:px-5 sm:text-xs sm:tracking-[0.2em]"
              >
                {download.label}
              </a>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
