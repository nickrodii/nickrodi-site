import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";

type ProjectLink = { label: string; href: string };
type TonedLink = ProjectLink & { tone: "primary" | "secondary" };

type ProjectListProps = {
  projects: Project[];
};

const TIER_ORDER: Record<string, number> = { featured: 0, default: 1, mini: 2 };

const BUTTON_BASE =
  "relative z-10 inline-flex items-center justify-center overflow-hidden rounded-full border font-semibold uppercase transition-all duration-200";

const BUTTON_SIZE = "px-3.5 py-[0.44rem] text-[0.68rem] tracking-[0.18em] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]";

const BUTTON_TONE = {
  primary:
    "border-yellow-200/70 bg-yellow-200 text-black hover:border-yellow-100 hover:bg-[linear-gradient(135deg,_#fff2b0,_#fbbf24_55%,_#fff7d6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),_0_6px_16px_rgba(0,0,0,0.35)]",
  secondary:
    "border-white/20 text-white/80 hover:border-white/60 hover:text-white hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.32),_rgba(255,255,255,0.06))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),_0_6px_16px_rgba(0,0,0,0.35)]",
} as const;

/** Where clicking the row itself goes. */
function rowTarget(project: Project): ProjectLink | null {
  const { article, live, repo } = project.linkUrl ?? {};
  return article ?? live ?? repo ?? null;
}

function tonedLinks(project: Project): TonedLink[] {
  const { live, repo, article } = project.linkUrl ?? {};

  return [
    live ? { ...live, tone: "primary" as const } : null,
    repo ? { ...repo, tone: "secondary" as const } : null,
    article ? { ...article, tone: "secondary" as const } : null,
  ].filter(Boolean) as TonedLink[];
}

function typeLabel(project: Project) {
  return project.projectType === "class" ? "Class project" : "Personal project";
}

/** Covers the whole row so the row itself is clickable. Buttons sit above it. */
function RowLink({ link, title }: { link: ProjectLink; title: string }) {
  const className =
    "absolute inset-0 z-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50";
  const label = `${title} — ${link.label}`;

  if (link.href.startsWith("/")) {
    return <Link href={link.href} aria-label={label} className={className} />;
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
    />
  );
}

function ProjectButtons({ project }: { project: Project }) {
  const links = tonedLinks(project);
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3">
      {links.map((link) => {
        const className = [BUTTON_BASE, BUTTON_SIZE, BUTTON_TONE[link.tone]].join(" ");
        const ariaLabel = `${link.label} for ${project.title}`;

        return link.href.startsWith("/") ? (
          <Link key={link.href} href={link.href} aria-label={ariaLabel} className={className}>
            {link.label}
          </Link>
        ) : (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={className}
          >
            {link.label}
          </a>
        );
      })}
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const { title, description, imageUrl, video } = project;
  const target = rowTarget(project);
  const media = video ?? imageUrl;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.06]">
      {target ? <RowLink link={target} title={title} /> : null}

      <div className="flex flex-col md:flex-row md:items-stretch">
        {media ? (
          <div className="relative aspect-[1200/630] w-full border-b border-white/10 md:aspect-auto md:w-[56%] md:border-r md:border-b-0">
            {video ? (
              <video
                src={video.src}
                poster={video.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                tabIndex={-1}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={imageUrl as string}
                alt={title}
                fill
                priority
                sizes="(min-width: 768px) 32rem, 100vw"
                className="object-cover"
              />
            )}
          </div>
        ) : null}

        <div className="flex flex-1 flex-col justify-between gap-6 p-6 md:p-7">
          <div>
            <p className="text-xs tracking-wide text-white/55">{typeLabel(project)}</p>

            <h3 className="mt-3 font-plex-mono text-2xl leading-tight text-white sm:text-3xl">
              {title}
            </h3>

            <p className="mt-3.5 max-w-3xl text-[0.95rem] leading-relaxed text-gray-300">
              {description}
            </p>
          </div>

          <ProjectButtons project={project} />
        </div>
      </div>
    </article>
  );
}

function StandardProject({ project }: { project: Project }) {
  const { title, description, imageUrl } = project;
  const target = rowTarget(project);

  return (
    <div className="group relative -mx-3 rounded-lg px-3 transition-colors duration-200 hover:bg-white/[0.04]">
      {target ? <RowLink link={target} title={title} /> : null}

      <div className="flex items-start gap-5 py-6">
        {imageUrl ? (
          <div className="relative hidden h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 opacity-85 transition-opacity duration-200 group-hover:opacity-100 sm:block">
            <Image src={imageUrl} alt={title} fill sizes="112px" className="object-cover" />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-plex-mono text-xl leading-tight text-white transition-colors group-hover:text-yellow-100">
              {title}
            </h3>
            <span className="text-xs text-white/45">{typeLabel(project)}</span>
          </div>

          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-gray-300">{description}</p>

          <div className="mt-4">
            <ProjectButtons project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniProject({ project }: { project: Project }) {
  const { title, description } = project;
  const target = rowTarget(project);

  return (
    <div className="group relative -mx-3 rounded-lg px-3 transition-colors duration-200 hover:bg-white/[0.04]">
      {target ? <RowLink link={target} title={title} /> : null}

      <div className="flex items-start gap-4 py-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-plex-mono text-base leading-tight text-white transition-colors group-hover:text-yellow-100">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{description}</p>
        </div>

        <span
          aria-hidden="true"
          className="mt-1 shrink-0 text-sm text-white/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/70"
        >
          &#8594;
        </span>
      </div>
    </div>
  );
}

export default function ProjectList({ projects }: ProjectListProps) {
  const ordered = [...projects].sort(
    (a, b) => (TIER_ORDER[a.variant ?? "default"] ?? 1) - (TIER_ORDER[b.variant ?? "default"] ?? 1),
  );

  const featured = ordered.filter((project) => project.variant === "featured");
  const listed = ordered.filter((project) => project.variant !== "featured");

  return (
    <div className="space-y-10">
      {featured.length > 0 ? (
        <div className="space-y-5">
          {featured.map((project) => (
            <FeaturedProject key={project.id} project={project} />
          ))}
        </div>
      ) : null}

      {listed.length > 0 ? (
        <ul>
          {listed.map((project, index) => (
            <li key={project.id}>
              {index > 0 ? <div aria-hidden="true" className="h-px w-full bg-white/10" /> : null}
              {project.variant === "mini" ? (
                <MiniProject project={project} />
              ) : (
                <StandardProject project={project} />
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
