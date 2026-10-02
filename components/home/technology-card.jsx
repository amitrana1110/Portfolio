"use client";

import { useState } from "react";

const stacks = [
  {
    name: "React & Next.js",
    icon: "react",
    description: "Reusable components, dynamic experiences.",
  },
  {
    name: "Tailwind CSS",
    icon: "tailwind",
    description: "Responsive layouts, thoughtful styling.",
  },
  {
    name: "JavaScript",
    icon: "javascript",
    description: "Interactive interfaces, clean application logic.",
  },
  {
    name: "GraphQL",
    icon: "graphql",
    description: "Flexible queries, reliable API integration.",
  },
  {
    name: "Node.js & Express",
    icon: "node",
    description: "Backend routes, dependable form processing.",
  },
];

function StackIcon({ type }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {type === "react" && (
        <g stroke="currentColor" strokeWidth="3">
          <ellipse cx="50" cy="50" rx="44" ry="16" />
          <ellipse
            cx="50"
            cy="50"
            rx="44"
            ry="16"
            transform="rotate(60 50 50)"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="44"
            ry="16"
            transform="rotate(120 50 50)"
          />
          <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
        </g>
      )}
      {type === "tailwind" && (
        <path
          fill="currentColor"
          d="M25 40c3-13 11-20 25-20 20 0 22 15 32 15 7 0 12-3 18-10-3 13-11 20-25 20-20 0-22-15-32-15-7 0-12 3-18 10ZM0 65c3-13 11-20 25-20 20 0 22 15 32 15 7 0 12-3 18-10-3 13-11 20-25 20-20 0-22-15-32-15-7 0-12 3-18 10Z"
        />
      )}
      {type === "javascript" && (
        <>
          <rect
            x="12"
            y="12"
            width="76"
            height="76"
            rx="8"
            stroke="currentColor"
            strokeWidth="4"
          />
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fill="currentColor"
            fontSize="38"
            fontWeight="700"
          >
            JS
          </text>
        </>
      )}
      {type === "graphql" && (
        <g stroke="currentColor" strokeWidth="3">
          <path d="M50 8 86 29v42L50 92 14 71V29ZM50 8 14 71h72ZM50 92V8" />
          {[
            [50, 8],
            [86, 29],
            [86, 71],
            [50, 92],
            [14, 71],
            [14, 29],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="6"
              fill="currentColor"
              stroke="none"
            />
          ))}
        </g>
      )}
      {type === "node" && (
        <>
          <path
            d="M50 7 88 29v42L50 93 12 71V29Z"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <text
            x="50"
            y="63"
            textAnchor="middle"
            fill="currentColor"
            fontSize="32"
            fontWeight="700"
          >
            JS
          </text>
        </>
      )}
    </svg>
  );
}

export function TechnologyCard() {
  const [index, setIndex] = useState(0);
  const stack = stacks[index];
  return (
    <button
      className="tech-personal card"
      data-reveal
      onClick={() => setIndex((current) => (current + 1) % stacks.length)}
      aria-label={`${stack.name}. Show next technology stack`}
    >
      <div className="tech-disc" aria-hidden="true">
        <span className="stack-icon" key={index}>
          <StackIcon type={stack.icon} />
        </span>
      </div>
      <div className="tech-personal-copy">
        <small>MY TECHNOLOGY STACK</small>
        <div
          className="stack-copy"
          key={index}
          aria-live="polite"
          aria-atomic="true"
        >
          <h3>{stack.name}</h3>
          <p>{stack.description}</p>
        </div>
        <span className="flip-hint">
          Click for next stack ↗ · {index + 1}/{stacks.length}
        </span>
      </div>
    </button>
  );
}
