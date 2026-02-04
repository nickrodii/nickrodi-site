"use client";

import type { Project } from "@/types/project";
import Image from "next/image";
import { useRef } from "react";
import type { PointerEvent } from "react";

type ProjectCardProps = {
  project: Project;
};

type ProjectLink = {
  label: string;
  href: string;
  tone: "primary" | "secondary";
};

function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, imageUrl, linkUrl, variant = "default" } = project;
  const isFeatured = variant === "featured";
  const cardRef = useRef<HTMLElement | null>(null);

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

  return (
    <div
      className="group h-full transition-transform duration-300 ease-out hover:-translate-y-1"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <article
        ref={cardRef}
        className={[
          "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5",
          "shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-transform duration-200 ease-out will-change-transform",
          isFeatured ? "p-8" : "p-6",
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
                <div
                  className="absolute inset-0 overflow-hidden"
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
                  className="absolute inset-0 bg-white/5"
                  style={{
                    clipPath:
                      "polygon(57.5% 0%, 58% 0%, 48% 100%, 47.5% 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-30"
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

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-xs font-plex-mono uppercase tracking-[0.28em] text-gray-200/80">
            <span className="h-2 w-2 rounded-full bg-yellow-200" />
            {isFeatured ? "Personal Project" : "Personal Project"}{" "}
            {/*in case i want diff name for featured*/}
          </div>

          <div className="space-y-3">
            <h3 className="font-title text-3xl leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] md:text-4xl">
              {title}
            </h3>
            <p className="max-w-prose text-base leading-relaxed text-gray-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
              {description}
            </p>
          </div>
        </div>

        {links.length > 0 ? (
          <div className="relative z-10 mt-6 flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} for ${title}`}
              className={[
                  "inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]",
                  "relative overflow-hidden transition-all duration-200",
                  link.tone === "primary"
                    ? "border-yellow-200/70 bg-yellow-200 text-black hover:border-yellow-100 hover:bg-[linear-gradient(135deg,_#fff2b0,_#fbbf24_55%,_#fff7d6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),_0_6px_16px_rgba(0,0,0,0.35)]"
                    : "border-white/20 text-white/80 hover:border-white/60 hover:text-white hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.32),_rgba(255,255,255,0.06))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),_0_6px_16px_rgba(0,0,0,0.35)]",
                ].join(" ")}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </article>
    </div>
  );
}

export default ProjectCard;
