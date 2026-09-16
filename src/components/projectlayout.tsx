import type { Project } from "@/types/project";
import ProjectCard from "@/components/projectcard";

type ProjectLayoutProps = {
  projects: Project[];
};

export default function ProjectLayout({ projects }: ProjectLayoutProps) {
  const orderedProjects = [...projects].sort((a, b) => {
    const aFeatured = a.variant === "featured";
    const bFeatured = b.variant === "featured";
    if (aFeatured === bFeatured) return 0;
    return aFeatured ? -1 : 1;
  });

  return (
    <div className="grid grid-flow-dense auto-rows-[8.75rem] gap-4 sm:gap-6 md:auto-rows-[9rem] md:grid-cols-2 xl:auto-rows-[10rem] xl:grid-cols-3">
      {orderedProjects.map((project) => {
        const isFeatured = project.variant === "featured";
        const isMini = project.variant === "mini";

        return (
          <div
            key={project.id}
            className={[
              "h-full",
              isFeatured ? "row-span-3 md:col-span-3 md:row-span-2" : isMini ? "row-span-1" : "row-span-2",
            ].join(" ")}
          >
            <ProjectCard project={project} />
          </div>
        );
      })}
    </div>
  );
}
