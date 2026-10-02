"use client";
import { useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { portfolio } from "@/data/portfolio";
export function ContactForm({ configured }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const result = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(20000),
      });
      const response = await result.json();
      if (!result.ok)
        throw new Error(response.error || "Unable to send your message.");
      setStatus("success");
      setMessage("Your message was sent. Thank you for reaching out.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error?.name === "TimeoutError"
          ? "The request timed out. Please try again or email directly."
          : error instanceof Error
          ? error.message
          : "Unable to send. Please try again.",
      );
    }
  }
  return (
    <form onSubmit={submit} className="contact-form">
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
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {!configured && (
        <p className="form-notice">
          Message delivery is not configured yet.
          {portfolio.email ? (
            <>
              {" "}
              You can <a href={`mailto:${portfolio.email}`}>
                email directly
              </a>{" "}
              in the meantime.
            </>
          ) : (
            " Contact details will be added from the resume."
          )}
        </p>
      )}
      <button
        type="submit"
        disabled={!configured || status === "loading"}
        className="button primary submit"
      >
        {status === "loading" ? (
          <>
            <LoaderCircle className="spin" size={18} />
            Sending…
          </>
        ) : (
          <>
            Send message
            <ArrowUpRight size={18} />
          </>
        )}
      </button>
      <p
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
        className={`form-result ${status}`}
      >
        {message}
      </p>
    </form>
  );
}
