import type { Project } from "@/types/project";
import ProjectCard from "@/components/projectcard";

type ProjectLayoutProps = {
  projects: Project[];
};

export default function ProjectLayout({ projects }: ProjectLayoutProps) {
  return (
    <div className="grid grid-flow-dense auto-rows-[16rem] gap-6 md:auto-rows-[18rem] md:grid-cols-2 xl:auto-rows-[20rem] xl:grid-cols-3">
      {projects.map((project) => {
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
