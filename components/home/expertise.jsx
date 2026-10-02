"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { SectionTitle } from "@/components/shared/section-title";

export function Expertise() {
  const [open, setOpen] = useState(0);
  return (
    <section id="service">
      <SectionTitle
        label="Areas of expertise"
        title="I can help you with these things"
      />
      <div className="accordion" data-reveal>
        {portfolio.expertise.map((item, i) => {
          const p = portfolio.projects.find((p) => p.slug === item.project);
          if (!p) return null;
          return (
            <article
              key={item.title}
              className={`accordion-item ${open === i ? "expanded" : ""}`}
            >
              <h3>
                <button
                  aria-expanded={open === i}
                  aria-controls={`expertise-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>
                    {i + 1}. {item.title}
                  </span>
                  <span className="accordion-plus">
                    <Plus size={16} />
                  </span>
                </button>
              </h3>
              <div
                className={`accordion-panel ${open === i ? "open" : ""}`}
                id={`expertise-${i}`}
                inert={open !== i}
                aria-hidden={open !== i}
              >
                <div>
                  <div className="expertise-details">
                    <span className="mini-label">FROM MY EXPERIENCE</span>
                    <div className="expertise-tools">
                      {item.tools.map((t, j) => (
                        <span key={t}>
                          {j > 0 && <b>✦</b>}
                          {t}
                        </span>
                      ))}
                    </div>
                    <p>{item.description}</p>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="expertise-link"
                    >
                      Explore related work
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="expertise-preview"
                    aria-label={`View ${p.shortTitle}`}
                  >
                    <Image src={p.image} alt="" width={400} height={280} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
