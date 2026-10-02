"use client";
import { Code2 } from "lucide-react";
import { portfolio } from "@/data/portfolio";

const symbols = {
  "React.js": "⚛",
  "Next.js": "N",
  JavaScript: "JS",
  TypeScript: "TS",
  HTML5: "5",
  CSS3: "3",
  "Tailwind CSS": "≈",
  "Node.js": "JS",
  "Express.js": "ex",
  GraphQL: "◇",
  Redux: "⌘",
  Git: "⑂",
  GitHub: "GH",
  "Strapi Headless CMS": "S",
  Postman: "↗",
  "VS Code": "⌁",
  "Apollo Client": "A",
};

export function TechStack() {
  const featured = portfolio.skills.filter((s) => symbols[s]);
  return (
    <div className="stack-card card" data-reveal>
      <div className="stack-top">
        <Code2 size={19} />
        <div>
          <strong>My everyday toolkit</strong>
          <small>Tools behind the interfaces</small>
        </div>
      </div>
      <div className="tech-marquees" aria-hidden="true">
        {[featured, featured.slice().reverse()].map((row, i) => (
          <div className={`tech-track track-${i}`} key={i}>
            {[...row, ...row].map((s, j) => (
              <span className="tech-logo" key={`${s}-${j}`} title={s}>
                <b>{symbols[s]}</b>
                <small>{s.replace(" Headless CMS", "")}</small>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="skill-groups">
        {portfolio.skillGroups.map((g) => (
          <div className="skill-group" key={g.title}>
            <h3>{g.title}</h3>
            <div className="tags">
              {g.skills.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
