import Link from "next/link";
import { ScrollTimeline } from "@/components/home/scroll-timeline";
import Image from "next/image";
import { CalendarDays, MapPin, GraduationCap } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Greeting, HangingCard } from "@/components/home/hero";
import { SectionTitle } from "@/components/shared/section-title";
import { AboutCards } from "@/components/home/about-cards";
import { ProjectGrid } from "@/components/projects/project-grid";
import { TechStack } from "@/components/home/tech-stack";
import { Expertise } from "@/components/home/expertise";
import { Highlights } from "@/components/home/highlights";
import { ResumeLink } from "@/components/shared/resume-link";
import { ConnectSection } from "@/components/home/connect-section";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="status">
            <i />
            {portfolio.role}
          </span>
          <h1>
            <Greeting />
            <span className="intro">
              I am {portfolio.firstName}
              <Image
                src="/images/waving-hand.png"
                alt=""
                width={75}
                height={75}
                className="wave"
                preload
              />
            </span>
          </h1>
          <p className="hero-role">{portfolio.role}</p>
          <p className="hero-summary">{portfolio.summary}</p>
          <div className="actions">
            <ResumeLink />
            <Link href="/contact#contact-form" className="button primary">
              <i className="orange-dot" />
              Let’s connect
            </Link>
          </div>
        </div>
        <HangingCard />
      </section>
      <section id="about-me">
        <SectionTitle label="About me" title="The person behind the pixels" />
        <AboutCards />
      </section>
      <section id="work">
        <SectionTitle
          label="Featured works"
          title="These are the ones that taught me the most"
        />
        <ProjectGrid />
      </section>
      <section id="stack-and-experience">
        <SectionTitle
          label="Stacks & Experience"
          title="Where I’m good and where I learned from"
        />
        <TechStack />
        <ScrollTimeline>
          {portfolio.experience.map((e, i) => (
            <article key={e.employer}>
              <div className="timeline-rail">
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="timeline-content" data-reveal>
                <div className="timeline-title">
                  <span className="employer-logo">
                    A<span>.</span>
                  </span>
                  <div>
                    <p>{e.employer}</p>
                    <h3>{e.role}</h3>
                  </div>
                </div>
                <p className="timeline-date">
                  <CalendarDays size={16} />
                  {e.dates}
                </p>
                <p className="timeline-location">
                  <MapPin size={14} />
                  {e.location}
                </p>
                <div className="timeline-tags">
                  <span aria-hidden="true">🏅</span>
                  <div className="tags">
                    {e.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="timeline-achievements">
                  <h4>📣 Scalable components. Reliable integrations.</h4>
                  <ul>
                    {e.achievements.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </ScrollTimeline>
        <div id="education" className="education-section">
          <SectionTitle
            label="Education"
            title="The foundation behind the work"
          />
          <div className="education-grid">
            {portfolio.education.map((e) => (
              <article
                className="education-card card"
                key={e.shortName}
                data-reveal
              >
                <span className="education-icon">
                  <GraduationCap size={24} />
                </span>
                <p className="mini-label">{e.dates}</p>
                <h3>{e.qualification}</h3>
                <p>{e.institution}</p>
                <div className="education-grade">
                  <strong>{e.grade}</strong>
                  <span>CGPA</span>
                  <span className="degree-tag">{e.shortName}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Expertise />
      <Highlights />
      <ConnectSection />
    </>
  );
}
