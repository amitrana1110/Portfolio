"use client";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone, Download } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { TiltSurface } from "@/components/motion/pointer-motion";
import { Avatar } from "@/components/shared/avatar";
import { SectionTitle } from "@/components/shared/section-title";
import { ContactWizard } from "@/components/contact/contact-wizard";

export function ConnectSection() {
  return (
    <>
      <section id="how-it-work">
        <SectionTitle
          label="Let’s work together"
          title="From the first component to the final experience"
        />
        <div className="connect-grid" data-reveal>
          <div className="connect-person">
            <TiltSurface className="resume-card card" restingAngle={-3}>
              <Avatar />
              <h3>{portfolio.name}</h3>
              <p>{portfolio.role}</p>
              <div className="resume-stats">
                {portfolio.highlights.map((h) => (
                  <div key={h.number}>
                    <strong>{h.number}</strong>
                    <small>{h.label}</small>
                  </div>
                ))}
              </div>
            </TiltSurface>
            <div className="connect-intro">
              <span className="status">
                <i />
                React & Next.js
              </span>
              <h3>Let’s build something.</h3>
              <p>
                Clean components, thoughtful interfaces, and reliable
                integrations. Bring your next idea into the conversation.
              </p>
            </div>
          </div>
          <div className="connect-details card">
            <h3>Frontend, with a full-stack perspective.</h3>
            <p>
              My work spans responsive interfaces, API integrations, component
              architecture, and backend form processing.
            </p>
            <div className="connect-rule" />
            <span className="mini-label">
              {portfolio.experience[0]?.employer ? `CURRENTLY AT ${portfolio.experience[0].employer.toUpperCase()}` : "FRONTEND DEVELOPMENT"}
            </span>
            <h4>
              {portfolio.experienceLabel}<span>of experience</span>
            </h4>
            <div className="connect-list">
              {[
                "Reusable React components",
                "GraphQL & REST APIs",
                "Mobile-first interfaces",
                "Node.js & Express.js",
                "Agile collaboration",
                "Git & code reviews",
              ].map((t) => (
                <span key={t}>
                  <i />
                  {t}
                </span>
              ))}
            </div>
            <Link href="/contact#contact-form" className="button primary">
              <i className="orange-dot" />
              Let’s connect
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section id="contact" className="booking-section">
        <div className="booking-grid" data-reveal>
          <div className="booking-profile">
            <TiltSurface className="booking-portrait">
              <Avatar large />
              <span className="booking-role">FRONTEND DEVELOPER</span>
            </TiltSurface>
            <p>
              <strong>{portfolio.name}</strong>
              <span> · </span>
              {portfolio.role}
            </p>
            <div className="socials">
              <a href={`mailto:${portfolio.email}`} aria-label="Email Amit">
                <Mail size={19} />
              </a>
              <a href={`tel:${portfolio.phone}`} aria-label="Call Amit">
                <Phone size={18} />
              </a>
              <a href={portfolio.resume} download aria-label="Download resume">
                <Download size={18} />
              </a>
            </div>
          </div>
          <ContactWizard />
        </div>
      </section>
    </>
  );
}
