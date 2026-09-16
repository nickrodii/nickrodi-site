"use client";

import type { Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";
import {
  clearPendingPageTransition,
  createCardTextOverlay,
  createPageTextOverlay,
  createPageTransitionGhost,
  getGhostTransformBetweenRects,
  getPageSlugFromHref,
  PAGE_TRANSITION_DURATION_MS,
  PAGE_TRANSITION_EASING,
  readPendingPageTransition,
  savePendingPageTransition,
} from "@/lib/page-transition";

type ProjectCardProps = {
  project: Project;
};

type ProjectLink = {
  label: string;
  href: string;
  tone: "primary" | "secondary";
};

function ProjectActionLink({
  href,
  title,
  label,
  className,
  onInternalClick,
}: {
  href: string;
  title: string;
  label: string;
  className: string;
  onInternalClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link
        href={href}
        aria-label={`${label} for ${title}`}
        className={className}
        onClick={onInternalClick}
      >
        {label}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} for ${title}`}
      className={className}
    >
      {label}
    </a>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  const {
    title,
    description,
    imageUrl,
    linkUrl,
    variant = "default",
    projectType = "personal",
  } = project;
  const isFeatured = variant === "featured";
  const isMini = variant === "mini";
  const cardRef = useRef<HTMLElement | null>(null);
  const typeLabel = projectType === "class" ? "Class Project" : "Personal Project";
  const typeDotClass = projectType === "class" ? "bg-yellow-200" : "bg-sky-200";
  const linkedPageSlug = linkUrl?.article?.href
    ? getPageSlugFromHref(linkUrl.article.href)
    : null;

  const links = [
    linkUrl?.live ? { ...linkUrl.live, tone: "primary" as const } : null,
    linkUrl?.repo ? { ...linkUrl.repo, tone: "secondary" as const } : null,
    linkUrl?.article ? { ...linkUrl.article, tone: "secondary" as const } : null,
  ].filter(Boolean) as ProjectLink[];

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * 4;
    const tiltY = (x - 0.5) * 4;

    el.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    el.style.setProperty("--glare-x", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--glare-y", `${(y * 100).toFixed(2)}%`);
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  const capturePageTransition = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
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

    const slug = getPageSlugFromHref(href);
    const card = cardRef.current;
    if (!slug || !card) return;

    const rect = card.getBoundingClientRect();

    savePendingPageTransition({
      direction: "card-to-page",
      slug,
      title,
      sourceEyebrow: isMini ? undefined : typeLabel,
      sourceDescription: description,
      sourceCardVariant: variant,
      sourceProjectType: projectType,
      sourceRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      recordedAt: Date.now(),
    });
  };

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !linkedPageSlug) return;

    const transition = readPendingPageTransition();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      !transition ||
      transition.direction !== "page-to-card" ||
      transition.slug !== linkedPageSlug ||
      prefersReducedMotion
    ) {
      if (transition?.direction === "page-to-card" && transition.slug === linkedPageSlug) {
        clearPendingPageTransition(transition);
      }
      return;
    }

    let ghost: HTMLDivElement | null = null;
    let sourceTextOverlay: HTMLDivElement | null = null;
    let destinationTextOverlay: HTMLDivElement | null = null;
    let frameOne = 0;
    let frameTwo = 0;

    const projectsSection = document.getElementById("projects");
    const root = document.documentElement;
    root.classList.add("project-transition-no-smooth-scroll");
    if (window.location.hash === "#projects" && projectsSection) {
      projectsSection.scrollIntoView();
    }

    const cleanup = () => {
      root.classList.remove("project-transition-no-smooth-scroll");
      card.style.removeProperty("opacity");
      card.style.removeProperty("willChange");
      ghost?.remove();
      sourceTextOverlay?.remove();
      destinationTextOverlay?.remove();
      clearPendingPageTransition(transition);
    };

    card.style.opacity = "0";
    card.style.willChange = "opacity";

    frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(() => {
        const targetRect = card.getBoundingClientRect();
        const startTransform = getGhostTransformBetweenRects(
          transition.sourceRect,
          targetRect
        );

        ghost = createPageTransitionGhost(targetRect);
        sourceTextOverlay = createPageTextOverlay(transition.sourceRect, {
          title,
          eyebrow: transition.sourceEyebrow,
          description: transition.sourceDescription,
        });
        destinationTextOverlay = createCardTextOverlay(targetRect, {
          title,
          description,
          variant,
          projectType,
        });
        destinationTextOverlay.style.opacity = "0.18";
        document.body.append(ghost, sourceTextOverlay, destinationTextOverlay);

        const ghostAnimation = ghost.animate(
          [
            {
              transform: startTransform,
              borderRadius: "2rem",
            },
            {
              transform: "translate(0px, 0px) scale(1, 1)",
              borderRadius: "1rem",
            },
          ],
          {
            duration: PAGE_TRANSITION_DURATION_MS,
            easing: PAGE_TRANSITION_EASING,
            fill: "forwards",
          }
        );

        sourceTextOverlay.animate(
          [
            {
              opacity: 1,
            },
            {
              opacity: 0,
            },
          ],
          {
            duration: 110,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        destinationTextOverlay.animate(
          [
            {
              opacity: 0.18,
            },
            {
              opacity: 1,
            },
          ],
          {
            duration: 140,
            delay: 35,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        card.animate(
          [
            {
              opacity: 0,
            },
            {
              opacity: 1,
            },
          ],
          {
            duration: 90,
            delay: 300,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        ghostAnimation.finished
          .catch(() => undefined)
          .finally(() => {
            cleanup();
          });
      });
    });

    return () => {
      window.cancelAnimationFrame(frameOne);
      window.cancelAnimationFrame(frameTwo);
      cleanup();
    };
  }, [description, linkedPageSlug, projectType, title, variant]);

  return (
    <div
      className="group h-full transition-transform duration-300 ease-out md:hover:-translate-y-1"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <article
        ref={cardRef}
        className={[
          "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5",
          "shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-transform duration-200 ease-out will-change-transform",
          isFeatured
            ? "p-5 sm:p-6 lg:p-8"
            : isMini
              ? "px-4 pt-4 pb-6 sm:px-5 sm:pt-5 sm:pb-7"
              : "p-5 sm:p-6",
        ].join(" ")}
        style={{
          transform:
            "perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
          transformStyle: "preserve-3d",
        }}
        data-variant={variant}
      >
        <div className="absolute inset-0 pointer-events-none">
          {imageUrl ? (
            isFeatured ? (
              <>
                <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_60%),_linear-gradient(135deg,_rgba(253,224,71,0.18),_rgba(14,116,144,0.22),_rgba(15,23,42,0.9))]" />
                <div className="absolute inset-0 sm:hidden">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="100vw"
                    priority={isFeatured}
                    className="object-cover opacity-28 blur-[1px]"
                  />
                </div>
                <div
                  className="absolute inset-0 hidden overflow-hidden sm:block"
                  style={{
                    clipPath:
                      "polygon(58% 0%, 100% 0%, 100% 100%, 48% 100%)",
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(min-width: 1280px) 36vw, (min-width: 768px) 48vw, 100vw"
                    priority={isFeatured}
                    className="object-cover opacity-80 blur-[1.5px]"
                  />
                </div>
                <div
                  className="absolute inset-0 hidden bg-white/5 sm:block"
                  style={{
                    clipPath:
                      "polygon(57.5% 0%, 58% 0%, 48% 100%, 47.5% 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 hidden opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-30 sm:block"
                  style={{
                    clipPath:
                      "polygon(57.5% 0%, 58% 0%, 48% 100%, 47.5% 100%)",
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0) 15%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 85%)",
                    backgroundPosition: "var(--glare-x, 50%) var(--glare-y, 50%)",
                    backgroundSize: "260% 260%",
                    mixBlendMode: "screen",
                  }}
                />
              </>
            ) : (
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(min-width: 1280px) 48vw, (min-width: 768px) 66vw, 100vw"
                priority={isFeatured}
                className="object-cover opacity-70 blur-[1.5px]"
              />
            )
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%),_linear-gradient(135deg,_rgba(253,224,71,0.28),_rgba(14,116,144,0.28),_rgba(15,23,42,0.85))]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-40"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 65%)",
              backgroundPosition: "var(--glare-x, 50%) var(--glare-y, 50%)",
              backgroundSize: "200% 200%",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-30"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        {isMini ? (
          <div className="relative z-10 space-y-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className={["h-2.5 w-2.5 shrink-0 rounded-full", typeDotClass].join(" ")} />
              <h3 className="min-w-0 truncate font-title text-[1.65rem] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-2xl md:text-[1.7rem]">
                {title}
              </h3>
            </div>
            <p
              className="max-w-prose text-sm leading-snug text-gray-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {description}
            </p>
          </div>
        ) : (
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-xs font-plex-mono uppercase tracking-[0.28em] text-gray-200/80">
              <span className={["h-2 w-2 rounded-full", typeDotClass].join(" ")} />
              {typeLabel}
            </div>

            <div className="space-y-3">
              <h3 className="font-title text-2xl leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-3xl md:text-4xl">
                {title}
              </h3>
              <p className="max-w-prose text-sm leading-relaxed text-gray-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-base">
                {description}
              </p>
            </div>
          </div>
        )}

        {links.length > 0 ? (
          <div className={["relative z-10 flex flex-wrap", isMini ? "mt-4 gap-2" : "mt-6 gap-3"].join(" ")}>
            {links.map((link) => (
              <ProjectActionLink
                key={link.href}
                href={link.href}
                title={title}
                label={link.label}
                onInternalClick={link.href.startsWith("/pages/") ? capturePageTransition(link.href) : undefined}
                className={[
                  "inline-flex items-center justify-center rounded-full border font-semibold uppercase",
                  "relative overflow-hidden transition-all duration-200",
                  isMini
                    ? "px-3 py-1.5 text-[0.62rem] tracking-[0.18em] sm:text-[0.65rem]"
                    : "px-3.5 py-[0.44rem] text-[0.68rem] tracking-[0.18em] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]",
                  link.tone === "primary"
                    ? "border-yellow-200/70 bg-yellow-200 text-black hover:border-yellow-100 hover:bg-[linear-gradient(135deg,_#fff2b0,_#fbbf24_55%,_#fff7d6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),_0_6px_16px_rgba(0,0,0,0.35)]"
                    : "border-white/20 text-white/80 hover:border-white/60 hover:text-white hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.32),_rgba(255,255,255,0.06))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),_0_6px_16px_rgba(0,0,0,0.35)]",
                ].join(" ")}
              />
            ))}
          </div>
        ) : null}
      </article>
    </div>
  );
}

export default ProjectCard;
