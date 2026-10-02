"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gmailDraft } from "@/lib/gmail-draft";
import { portfolio } from "@/data/portfolio";
export function ContactForm() {
  const [draft, setDraft] = useState(null);
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (!data.name.trim()) {
      form.elements.name.setCustomValidity("Please enter your name.");
      form.reportValidity();
      return;
    }
    if (data.message.trim().length < 10) {
      form.elements.message.setCustomValidity("Please enter at least 10 characters.");
      form.reportValidity();
      return;
    }
    const urls = gmailDraft({ ...data, recipient: portfolio.email }, navigator.userAgent);
    setDraft(urls.web);
    if (urls.app === urls.web) {
      window.open(urls.web, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(urls.app);
    }
  }
  return (
    <form
      onSubmit={submit}
      onInput={(event) => {
        event.target.setCustomValidity?.("");
        setDraft(null);
      }}
      className="contact-form"
    >
      <div className="field">
        <label htmlFor="name">
          Name <span>*</span>
        </label>
        <input
          id="name"
          name="name"
          placeholder="Your name"
          autoComplete="name"
          required
          maxLength={100}
        />
      </div>
      <div className="field">
        <label htmlFor="email">
          Email <span>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          maxLength={254}
        />
      </div>
      <div className="field">
        <label htmlFor="type">
          Enquiry type <span>*</span>
        </label>
        <select id="type" name="type" required defaultValue="">
          <option value="" disabled>
            Select an enquiry
          </option>
          <option>Project enquiry</option>
          <option>Career opportunity</option>
          <option>General conversation</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">
          Message <span>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell me a little about what you have in mind…"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
        />
      </div>
      <p className="form-notice">
        Opens a draft in Gmail with your details filled in. Review it and tap
        Send there.
      </p>
      <button type="submit" className="button primary submit">
        Send message
        <ArrowUpRight size={18} />
      </button>
      {draft && (
        <div className="form-result" role="status" aria-live="polite">
          <p>Your draft is ready. Your message has not been sent yet.</p>
          <a
            href={draft}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            Open Gmail in browser
            <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </form>
  );
}
