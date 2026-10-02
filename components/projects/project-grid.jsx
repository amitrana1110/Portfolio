import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function ProjectCover({ project }) {
  return (
    <div className="project-visual">
      <Image
        src={project.image}
        alt={`${project.shortTitle} — illustrative concept cover, not a production screenshot`}
        width={1200}
        height={800}
        className="project-cover"
      />
      <span className="cover-label">Concept cover</span>
    </div>
  );
}

export function ProjectCard({ project, index = 0 }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`project-card project-${index}`}
      data-reveal
      style={{ "--accent": project.accent }}
    >
      <ProjectCover project={project} />
      <div className="project-copy">
        <h3>{project.title}</h3>
        <div className="project-chips">
          <span>{project.kind}</span>
          {project.duration && <span>{project.duration}</span>}
        </div>
        <p>{project.description}</p>
        <div className="project-author">
          <span className="project-mark">{project.mark}</span>
          <span>
            <strong>{project.shortTitle}</strong>
            <small>{project.role}</small>
          </span>
          <span className="project-arrow">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectGrid({ projects = portfolio.projects }) {
  return (
    <div
      className={`projects-grid ${projects.length === 2 ? "two-projects" : ""}`}
    >
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}
