"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Code2 } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { SectionTitle } from "@/components/shared/section-title";

export function Highlights() {
  const [index, setIndex] = useState(0);
  const count = portfolio.highlights.length;
  const item = portfolio.highlights[index % count];
  if (!count) return null;
  return (
    <section id="highlights">
      <SectionTitle
        label="Work highlights"
        title="Small details. Measurable impact."
      />
      <div className="highlights-layout" data-reveal>
        <div className="highlight-art card">
          <span key={item.number}>{item.number}</span>
          <small>{item.label}</small>
          <Code2 size={44} />
        </div>
        <div className="highlight-content">
          <div key={index} className="highlight-slide" aria-live="polite">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="highlight-attribution">
              <strong>{portfolio.experience[0]?.employer}</strong>
              <span>{portfolio.experience[0]?.role}</span>
            </div>
          </div>
          <div className="carousel-controls">
            <span>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
            <button
              onClick={() => setIndex((index + count - 1) % count)}
              aria-label="Previous work highlight"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => setIndex((index + 1) % count)}
              aria-label="Next work highlight"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
