import { notFound } from "next/navigation";
import { portfolio } from "@/data/portfolio";
import {
  BackLink,
  Progress,
  ImageLightbox,
} from "@/components/projects/case-study";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionTitle } from "@/components/shared/section-title";
export function generateStaticParams() {
  return portfolio.projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = portfolio.projects.find((p) => p.slug === slug);
  return {
    title: p?.title || "Project not found",
    description: p?.description,
    alternates: p ? { canonical: `/projects/${p.slug}` } : undefined,
  };
}
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const p = portfolio.projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const related = portfolio.projects
    .filter((item) => item.slug !== slug)
    .slice(0, 2);
  const sections = p.sections.map((s, i) => ({
    title: s.title,
    id: `point-${i}`,
  }));
  return (
    <>
      <Progress sections={sections} />
      <article className="case-study">
        <BackLink />
        <h1 data-reveal>{p.title}</h1>
        <div data-reveal>
          <ImageLightbox
            src={p.image}
            alt={`${p.shortTitle} concept cover — illustrative, not a production screenshot`}
          />
        </div>
        <dl className="project-meta" data-reveal>
          {[
            ["Organisation", p.organisation],
            ["Role", p.role],
            ["Dates", p.duration],
            ["Project", p.kind],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          <div className="meta-tools">
            <dt>Tools & Technologies</dt>
            <dd className="tags">
              {p.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </dd>
          </div>
        </dl>
        {p.sections.map((s, i) => (
          <section
            className="case-section"
            id={`point-${i}`}
            key={s.title}
            data-reveal
          >
            <h2>{s.title}</h2>
            <div>
              <p>{s.body}</p>
              {s.points && (
                <ul>
                  {s.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
        <div className="actions">
          {p.url && (
            <a
              href={p.url}
              className="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit project ↗
            </a>
          )}
          {p.repository && (
            <a
              href={p.repository}
              className="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code ↗
            </a>
          )}
        </div>
      </article>
      <section>
        <SectionTitle
          label="Other works"
          title="Have a look at my other work"
        />
        <ProjectGrid projects={related} />
      </section>
    </>
  );
}
