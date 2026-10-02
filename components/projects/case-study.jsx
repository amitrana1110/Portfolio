"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus, ArrowLeft, X } from "lucide-react";
import { subscribeScroll } from "@/lib/scroll-scheduler";

export function BackLink() {
  return (
    <Link href="/#work" className="back-link">
      <ArrowLeft size={16} />
      Back to home
    </Link>
  );
}

export function Progress({ sections = [] }) {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(sections[0]?.id || "");
  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      setProgress(
        height > 0 ? Math.min(100, Math.round((scrollY / height) * 100)) : 0,
      );
      let current = sections[0]?.id || "";
      sections.forEach((s) => {
        const e = document.getElementById(s.id);
        if (e && e.getBoundingClientRect().top < innerHeight * 0.4)
          current = s.id;
      });
      setActive(current);
    };
    update();
    return subscribeScroll(update);
  }, [sections]);
  return (
    <nav
      className={`reading-progress ${open ? "opened" : ""}`}
      aria-label="Case study navigation"
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="case-points"
      >
        <span
          className="progress-circle"
          style={{ "--progress": `${progress * 3.6}deg` }}
        >
          {progress}%
        </span>
        <span>Points</span>
        <Plus size={15} />
      </button>
      <div
        id="case-points"
        className="case-points"
        inert={!open}
        aria-hidden={!open}
      >
        {sections.map((s) => (
          <a
            className={active === s.id ? "active" : ""}
            key={s.id}
            href={`#${s.id}`}
            onClick={() => setOpen(false)}
          >
            {s.title}
            <ArrowUpRight size={12} />
          </a>
        ))}
      </div>
    </nav>
  );
}

export function ImageLightbox({ src, alt }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <>
      <button
        className="zoom-cover"
        onClick={() => setOpen(true)}
        aria-label="Enlarge project cover"
      >
        <Image src={src} alt={alt} width={1200} height={800} />
        <span>Click to explore ↗</span>
      </button>
      <dialog
        ref={dialog}
        className="image-dialog"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <button
          aria-label="Close enlarged project cover"
          onClick={() => setOpen(false)}
        >
          <X size={22} />
        </button>
        <Image src={src} alt={alt} width={1200} height={800} />
      </dialog>
    </>
  );
}
