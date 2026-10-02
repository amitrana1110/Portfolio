"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserRound,
  PencilRuler,
  SquareTerminal,
  MessageCircle,
  Sun,
  Moon,
} from "lucide-react";
import { subscribeScroll } from "@/lib/scroll-scheduler";
import { portfolio } from "@/data/portfolio";
import { Avatar } from "@/components/shared/avatar";

export function Profile() {
  const [visible, setVisible] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const update = () => setVisible(scrollY > 460 || path !== "/");
    update();
    return subscribeScroll(update);
  }, [path]);
  return (
    <header
      className={`floating-profile ${visible ? "shown" : ""}`}
      inert={!visible}
    >
      <Link
        href="/#main"
        className="profile"
        title="Back to top"
        onClick={(event) => {
          if (path !== "/") return;
          event.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          });
        }}
      >
        <span className="sr-only">Back to top</span>
        <Avatar />
        <span>
          <strong>{portfolio.name}</strong>
          <small>{portfolio.role}</small>
        </span>
        {portfolio.availability && (
          <span className="status profile-availability">
            <i />
            {portfolio.availability}
          </span>
        )}
      </Link>
    </header>
  );
}

export function Dock() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("");
  const path = usePathname();
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    const update = () => {
      const sections = [
        "about-me",
        "work",
        "stack-and-experience",
        "service",
        "highlights",
        "how-it-work",
        "contact",
      ];
      let current = "";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (
          el &&
          el.getClientRects().length > 0 &&
          el.getBoundingClientRect().top < innerHeight * 0.38
        )
          current = id;
      });
      setActive(current);
    };
    update();
    return subscribeScroll(update);
  }, [path]);
  function toggle() {
    const next = document.documentElement.dataset.theme !== "dark";
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }
  const items = [
    { id: "about-me", label: "About", icon: UserRound },
    { id: "work", label: "Work", icon: PencilRuler },
    { id: "service", label: "Expertise", icon: SquareTerminal },
    { id: "how-it-work", label: "Connect", icon: MessageCircle },
  ];
  return (
    <nav className="dock" aria-label="Main navigation">
      {items.map((item) => {
        const selected =
          path === "/" &&
          (active === item.id ||
            (item.id === "work" && active === "stack-and-experience") ||
            (item.id === "how-it-work" &&
              ["highlights", "contact"].includes(active)));
        return (
          <Link
            key={item.id}
            href={`/#${item.id}`}
            aria-label={item.label}
            aria-current={selected ? "location" : undefined}
            className={selected ? "active" : ""}
          >
            <item.icon size={18} strokeWidth={2.6} />
            <span className="dock-label" aria-hidden="true">{item.label}</span>
            <span className="tooltip">{item.label}</span>
          </Link>
        );
      })}
      <span className="dock-divider" />
      <button
        onClick={toggle}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className="theme-icon">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </span>
        <span className="dock-label" aria-hidden="true">{dark ? "Light" : "Dark"}</span>
        <span className="tooltip">{dark ? "Light" : "Dark"} mode</span>
      </button>
    </nav>
  );
}
