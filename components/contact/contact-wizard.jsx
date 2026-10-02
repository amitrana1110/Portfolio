"use client";
import { useState } from "react";
import { ArrowUpRight, ArrowLeft, ChevronRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function ContactWizard() {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const choose = [
    {
      name: "Frontend development",
      description: "React, Next.js, and responsive interfaces",
    },
    {
      name: "API & CMS integration",
      description: "GraphQL, REST APIs, and dynamic content",
    },
    {
      name: "Career opportunity",
      description: "Discuss a frontend engineering role",
    },
  ];
  function next() {
    if (step === 1 && !topic) return;
    if (step === 2 && (!name.trim() || !/^\S+@\S+\.\S+$/.test(email))) {
      setError("Please enter your name and a valid email address.");
      return;
    }
    setError("");
    setStep(step + 1);
  }
  const mailto = `mailto:${portfolio.email}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(`Hi Amit,\n\n${message}\n\n${name}\n${email}`)}`;
  return (
    <div className="contact-wizard card">
      <div className="wizard-header">
        <div>
          <h3>
            {step === 1
              ? "Let’s connect"
              : step === 2
                ? "Your details"
                : "Start the conversation"}
          </h3>
          <p>Step {step} of 3</p>
        </div>
        <div className="step-dots" role="img" aria-label={`Step ${step} of 3`}>
          {[1, 2, 3].map((s) => (
            <i key={s} className={s === step ? "current" : ""} />
          ))}
        </div>
      </div>
      <div className="wizard-body" key={step}>
        {step === 1 ? (
          <fieldset>
            <legend className="sr-only">Choose a conversation topic</legend>
            {choose.map((c) => (
              <label
                className={`wizard-choice ${topic === c.name ? "selected" : ""}`}
                key={c.name}
              >
                <input
                  type="radio"
                  name="topic"
                  value={c.name}
                  checked={topic === c.name}
                  onChange={() => setTopic(c.name)}
                />
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.description}</small>
                </span>
              </label>
            ))}
          </fieldset>
        ) : step === 2 ? (
          <div className="wizard-fields">
            <div className="field">
              <label htmlFor="wizard-name">Name *</label>
              <input
                id="wizard-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                maxLength={100}
              />
            </div>
            <div className="field">
              <label htmlFor="wizard-email">Email *</label>
              <input
                id="wizard-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                maxLength={254}
              />
            </div>
            <p>{topic}</p>
          </div>
        ) : (
          <div className="wizard-fields">
            <div className="field">
              <label htmlFor="wizard-message">What do you have in mind?</label>
              <textarea
                id="wizard-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={5000}
              />
            </div>
            <p className="wizard-disclaimer">
              This opens your email app with a draft. Your message is sent when
              you send it there.
            </p>
          </div>
        )}
        {error && (
          <p className="form-result error" role="alert">
            {error}
          </p>
        )}
        <div className="wizard-actions">
          {step > 1 && (
            <button
              className="wizard-back"
              onClick={() => {
                setStep(step - 1);
                setError("");
              }}
              aria-label="Previous step"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          {step < 3 ? (
            <button
              className="wizard-next"
              disabled={step === 1 && !topic}
              onClick={next}
              aria-label="Next step"
            >
              <ChevronRight size={22} />
            </button>
          ) : (
            <a href={mailto} className="button primary">
              Open email draft
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
