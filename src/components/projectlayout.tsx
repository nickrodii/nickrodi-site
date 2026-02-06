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
    <div className="grid grid-flow-dense auto-rows-[16rem] gap-6 md:auto-rows-[18rem] md:grid-cols-2 xl:auto-rows-[20rem] xl:grid-cols-3">
      {orderedProjects.map((project) => {
        const isFeatured = project.variant === "featured";
        return (
          <div
            key={project.id}
            className={[
              "h-full",
              isFeatured ? "md:col-span-3 md:row-span-1" : "",
            ].join(" ")}
          >
            <ProjectCard project={project} />
          </div>
        );
      })}
    </div>
  );
}
