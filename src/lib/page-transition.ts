export const PAGE_TRANSITION_KEY = "nickrodi.page-transition";
export const PAGE_TRANSITION_MAX_AGE_MS = 2500;
export const PAGE_TRANSITION_DURATION_MS = 420;
export const PAGE_TRANSITION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const PAGE_TRANSITION_NAV_GAP_PX = 16;

export type PageTransitionDirection = "card-to-page" | "page-to-card";
type ProjectCardVariant = "default" | "featured" | "mini";
type ProjectType = "personal" | "class";

export type PendingPageTransition = {
  direction: PageTransitionDirection;
  slug: string;
  title: string;
  sourceEyebrow?: string;
  sourceDescription?: string;
  sourceCardVariant?: ProjectCardVariant;
  sourceProjectType?: ProjectType;
  sourceRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  recordedAt: number;
};

type RectLike = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function isSamePendingTransition(current: PendingPageTransition, expected: PendingPageTransition) {
  return (
    current.direction === expected.direction &&
    current.slug === expected.slug &&
    current.recordedAt === expected.recordedAt
  );
}

export function getPageSlugFromHref(href: string) {
  const match = href.match(/^\/pages\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function savePendingPageTransition(transition: PendingPageTransition) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PAGE_TRANSITION_KEY, JSON.stringify(transition));
}

export function readPendingPageTransition() {
  if (typeof window === "undefined") return null;

  const rawValue = sessionStorage.getItem(PAGE_TRANSITION_KEY);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as PendingPageTransition;

    if (Date.now() - parsed.recordedAt > PAGE_TRANSITION_MAX_AGE_MS) {
      clearPendingPageTransition();
      return null;
    }

    return parsed;
  } catch {
    clearPendingPageTransition();
    return null;
  }
}

export function clearPendingPageTransition(expected?: PendingPageTransition) {
  if (typeof window === "undefined") return;

  if (!expected) {
    sessionStorage.removeItem(PAGE_TRANSITION_KEY);
    return;
  }

  const current = readPendingPageTransition();
  if (!current || !isSamePendingTransition(current, expected)) {
    return;
  }

  sessionStorage.removeItem(PAGE_TRANSITION_KEY);
}

export function getGhostTransformBetweenRects(fromRect: RectLike, toRect: RectLike) {
  const translateX = fromRect.left - toRect.left;
  const translateY = fromRect.top - toRect.top;
  const scaleX = fromRect.width / toRect.width;
  const scaleY = fromRect.height / toRect.height;

  return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
}

function getSiteNavBottom() {
  const nav = document.querySelector<HTMLElement>("[data-site-nav='true']");
  return nav ? nav.getBoundingClientRect().bottom : 0;
}

export function getPageTransitionViewportRect(rect: DOMRect | RectLike) {
  // Long content pages should still let the ghost panel extend past the bottom
  // of the screen so it matches the real panel. We only clamp the top edge to
  // stay below the sticky nav, then preserve the rest of the panel height.
  const fullBottom = rect.top + rect.height;
  const safeTop = Math.min(
    Math.max(rect.top, getSiteNavBottom() + PAGE_TRANSITION_NAV_GAP_PX),
    fullBottom - 1
  );

  return {
    top: safeTop,
    left: rect.left,
    width: rect.width,
    height: Math.max(1, fullBottom - safeTop),
  };
}

function createOverlayRoot(targetRect: DOMRect | RectLike, zIndex: string) {
  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.className = "pointer-events-none fixed overflow-hidden";

  Object.assign(overlay.style, {
    top: `${targetRect.top}px`,
    left: `${targetRect.left}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`,
    zIndex,
  });

  return overlay;
}

function getProjectTypePresentation(projectType: ProjectType) {
  return {
    label: projectType === "class" ? "Class Project" : "Personal Project",
    dotClass: projectType === "class" ? "bg-yellow-200" : "bg-sky-200",
  };
}

export function createPageTransitionGhost(targetRect: DOMRect | RectLike) {
  const ghost = createOverlayRoot(targetRect, "90");

  // Only the shell moves now. Text lives in separate fixed overlays so the
  // animation keeps crisp typography instead of scaling letters in flight.
  ghost.className = [
    ghost.className,
    "rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm",
  ].join(" ");
  ghost.style.transformOrigin = "top left";

  const background = document.createElement("div");
  background.className = "absolute inset-0";

  const radialGlow = document.createElement("div");
  radialGlow.className =
    "absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_58%),_linear-gradient(135deg,_rgba(125,211,252,0.12),_rgba(255,255,255,0.04),_rgba(15,23,42,0.72))]";

  const shade = document.createElement("div");
  shade.className = "absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15";

  background.append(radialGlow, shade);
  ghost.append(background);

  return ghost;
}

export function createCardTextOverlay(
  targetRect: DOMRect | RectLike,
  {
    title,
    description,
    variant,
    projectType,
  }: {
    title: string;
    description?: string;
    variant: ProjectCardVariant;
    projectType: ProjectType;
  }
) {
  const overlay = createOverlayRoot(targetRect, "91");
  const { label, dotClass } = getProjectTypePresentation(projectType);
  const layer = document.createElement("div");

  if (variant === "mini") {
    layer.className = "absolute inset-0 z-10 space-y-2.5 p-4 md:p-5";

    const titleRow = document.createElement("div");
    titleRow.className = "flex min-w-0 items-center gap-3";

    const dot = document.createElement("span");
    dot.className = `h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`;

    const heading = document.createElement("h2");
    heading.className =
      "min-w-0 truncate font-title text-2xl leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] md:text-[1.7rem]";
    heading.textContent = title;

    titleRow.append(dot, heading);
    layer.append(titleRow);

    if (description) {
      const copy = document.createElement("p");
      copy.className =
        "max-w-prose text-sm leading-snug text-gray-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]";
      copy.textContent = description;
      layer.append(copy);
    }
  } else {
    layer.className = variant === "featured" ? "absolute inset-0 z-10 space-y-4 p-8" : "absolute inset-0 z-10 space-y-4 p-6";

    const eyebrow = document.createElement("div");
    eyebrow.className =
      "flex items-center gap-3 text-xs font-plex-mono uppercase tracking-[0.28em] text-gray-200/80";

    const dot = document.createElement("span");
    dot.className = `h-2 w-2 rounded-full ${dotClass}`;

    const eyebrowLabel = document.createElement("span");
    eyebrowLabel.textContent = label;

    eyebrow.append(dot, eyebrowLabel);
    layer.append(eyebrow);

    const content = document.createElement("div");
    content.className = "space-y-3";

    const heading = document.createElement("h2");
    heading.className =
      "font-title text-3xl leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] md:text-4xl";
    heading.textContent = title;
    content.append(heading);

    if (description) {
      const copy = document.createElement("p");
      copy.className =
        "max-w-prose text-base leading-relaxed text-gray-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]";
      copy.textContent = description;
      content.append(copy);
    }

    layer.append(content);
  }

  overlay.append(layer);
  return overlay;
}

export function createPageTextOverlay(
  targetRect: DOMRect | RectLike,
  {
    title,
    description,
  }: {
    title: string;
    eyebrow?: string;
    description?: string;
  }
) {
  const overlay = createOverlayRoot(targetRect, "92");
  const layer = document.createElement("div");
  layer.className = "absolute inset-0 z-10 p-5 pt-16 sm:p-8 sm:pt-20 md:p-12 md:pt-24";

  const content = document.createElement("div");
  content.className = "space-y-6";

  const heading = document.createElement("h2");
  heading.className = "font-title text-4xl leading-none text-white sm:text-5xl md:text-7xl";
  heading.textContent = title;
  content.append(heading);

  if (description) {
    const copy = document.createElement("p");
    copy.className = "max-w-3xl text-base leading-relaxed text-gray-200/90 sm:text-lg md:text-xl";
    copy.textContent = description;
    content.append(copy);
  }

  layer.append(content);
  overlay.append(layer);
  return overlay;
}
