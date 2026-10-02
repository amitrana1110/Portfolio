import { Mail, Phone, Download } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function Footer() {
  return (
    <footer>
      <div className="footer-socials">
        <a href={`mailto:${portfolio.email}`} aria-label="Email Amit">
          <Mail size={20} />
        </a>
        <a href={`tel:${portfolio.phone}`} aria-label="Call Amit">
          <Phone size={19} />
        </a>
        <a href={portfolio.resume} download aria-label="Download resume">
          <Download size={19} />
        </a>
        {portfolio.socials.map((s) => (
          <a
            href={s.url}
            key={s.label}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.label}
          </a>
        ))}
      </div>
      <div className="footer-message" data-reveal>
        <p>Thank you, for visiting here</p>
        <a className="footer-seal" href="#main" aria-label="Back to top">
          <span className="seal-rim" />
          <span className="seal-monogram">AR</span>
        </a>
        <p>Let’s create something beautiful.</p>
        <span className="footer-signature">Amit.</span>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {portfolio.name}
        </span>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  );
}
