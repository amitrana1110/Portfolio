"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Download, GraduationCap } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import {
  TiltSurface,
  usePointerSpring,
} from "@/components/motion/pointer-motion";
import { Avatar } from "@/components/shared/avatar";
import { TechnologyCard } from "@/components/home/technology-card";

const noteMessages = [
  "Grab it and get a surprise",
  "Hahaha !!",
  "Nope !",
  "Don't try, you can't",
  "Come on, chase me",
  "Haha, you got me running!",
  "Enough already, I'm tired of this",
  "You think it worked? Just kidding!",
  "Did you try it again? You silly goose!",
  "Gotcha!",
];

export function StickyNote() {
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState(0);
  const spring = usePointerSpring({ x: 0, y: 0, angle: -2 });
  const destination = useRef({ x: 0, y: 0 });
  const lastDodge = useRef(0);
  function dodge(event) {
    if (
      revealed ||
      event.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const note = spring.element.current;
    if (!note) return;
    const rect = note.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - event.clientX;
    const dy = rect.top + rect.height / 2 - event.clientY;
    const distance = Math.hypot(dx, dy);
    if (distance > 105 || event.timeStamp - lastDodge.current < 180) return;
    const area = event.currentTarget.getBoundingClientRect();
    const maxX = Math.max(0, (area.width - 110) / 2 - 16);
    const direction = dx === 0 ? (message % 2 ? -1 : 1) : Math.sign(dx);
    let x = Math.max(
      -maxX,
      Math.min(maxX, destination.current.x + direction * 110),
    );
    // If cornered, dodge across the card rather than sticking to its boundary.
    if (Math.abs(x - destination.current.x) < 22) x = -destination.current.x;
    const y = Math.max(
      -25,
      Math.min(area.height - 165, destination.current.y + (dy >= 0 ? 58 : -58)),
    );
    destination.current = { x, y };
    spring.move({ x, y, angle: direction * 12 });
    lastDodge.current = event.timeStamp;
    setMessage((current) =>
      current === noteMessages.length - 1 ? 1 : current + 1,
    );
  }
  function resetPosition() {
    destination.current = { x: 0, y: 0 };
    spring.move({ x: 0, y: 0, angle: -2 });
  }
  return (
    <div
      className={`surprise-card card ${revealed ? "revealed" : ""}`}
      data-reveal
      onPointerMove={dodge}
      onPointerLeave={resetPosition}
    >
      <div className="note-backdrop" />
      <button
        ref={spring.element}
        className="sticky-note evasive-note"
        aria-label={
          revealed
            ? "Reset the note"
            : "Catch the note to reveal my resume, or press Enter"
        }
        onFocus={resetPosition}
        onClick={() => {
          resetPosition();
          setRevealed(!revealed);
        }}
      >
        <span className="paperclip" />
        <span key={message}>
          {revealed ? "There it is!" : noteMessages[message]}
        </span>
        <span className="note-fold" />
      </button>
      <div className="resume-reveal" aria-hidden={!revealed} inert={!revealed}>
        <Download size={27} />
        <strong>The story, on paper.</strong>
        <a href={portfolio.resume} download className="button">
          Download my resume
          <ArrowDown size={15} />
        </a>
      </div>
      <h3>
        {revealed
          ? "A little more about me 🙂"
          : "I have a surprise for you 🙃"}
      </h3>
      <span className="note-help">
        {revealed
          ? "Click the note to reset"
          : "Catch it, tap it, or use Enter to reveal"}
      </span>
    </div>
  );
}

function EducationFolder() {
  const folder = useRef(null);
  useEffect(() => {
    let frame = 0;
    const mobile = matchMedia("(max-width: 809.98px)");
    const update = () => {
      frame = 0;
      if (!folder.current) return;
      const bounds = folder.current.getBoundingClientRect();
      const centre = (bounds.top + bounds.height / 2) / window.innerHeight;
      const progress = mobile.matches
        ? Math.max(0, Math.min(1, (0.35 - Math.abs(centre - 0.5)) / 0.2))
        : 0;
      folder.current.style.setProperty("--folder-open", String(progress));
      folder.current.dataset.open = String(progress);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    mobile.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      mobile.removeEventListener("change", schedule);
    };
  }, []);
  return (
    <a
      ref={folder}
      href="#education"
      className="education-folder card"
      data-reveal
      aria-label="Explore my education"
    >
      <div className="folder-art" aria-hidden="true">
        <span className="folder-paper paper-one">
          MCA <small>2021 — 2023</small>
        </span>
        <span className="folder-paper paper-two">
          B.Sc. IT <small>2018 — 2021</small>
        </span>
        <span className="folder-front">
          <GraduationCap size={30} />
          <span>GEHU</span>
        </span>
      </div>
      <div>
        <h3>My education</h3>
        <small>2 degrees</small>
      </div>
    </a>
  );
}

export function AboutCards() {
  return (
    <div className="about-grid">
      <TiltSurface className="about-person card">
        <Avatar large preload />
        <div className="about-person-copy">
          <span className="mini-label">THE PERSON BEHIND THE CODE</span>
          <h3>{portfolio.name}</h3>
          <p>{portfolio.about}</p>
        </div>
      </TiltSurface>
      <TechnologyCard />
      <EducationFolder />
      <StickyNote />
    </div>
  );
}
