import { Avatar } from "@/components/shared/avatar";
import { SectionTitle } from "@/components/shared/section-title";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Expertise } from "@/components/home/expertise";
import { Highlights } from "@/components/home/highlights";
import { ContactForm } from "@/components/contact/contact-form";
import { TiltSurface } from "@/components/motion/pointer-motion";
import { portfolio } from "@/data/portfolio";
import { Mail, Phone, Download } from "lucide-react";
export const metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description:
    "Contact Amit Singh Rana about frontend development, a project, or a career opportunity.",
};
export const dynamic = "force-dynamic";
export default function Contact() {
  const configured = !!(
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_TO_EMAIL &&
    process.env.CONTACT_FROM_EMAIL
  );
  return (
    <>
      <section id="contact-form" className="contact-section">
        <SectionTitle
          level={1}
          label="Contact me"
          title="Feel free to send me a message."
        />
        <p className="contact-lead">
          Let’s talk about your next project or opportunity.
        </p>
        <div className="contact-grid" data-reveal>
          <ContactForm configured={configured} />
          <aside className="contact-profile">
            <TiltSurface className="contact-portrait">
              <Avatar large />
              <span className="booking-role">FRONTEND DEVELOPER</span>
            </TiltSurface>
            <h2>{portfolio.name}</h2>
            <p>{portfolio.role}</p>
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
            <a className="email-link" href={`mailto:${portfolio.email}`}>
              {portfolio.email}
            </a>
            <a className="phone-link" href={`tel:${portfolio.phone}`}>
              {portfolio.phone}
            </a>
          </aside>
        </div>
      </section>
      <section>
        <SectionTitle
          label="Featured works"
          title="Have a look at some of my work"
        />
        <ProjectGrid projects={portfolio.projects.slice(0, 2)} />
      </section>
      <Expertise />
      <Highlights />
    </>
  );
}
