"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function MotionRoot() {
  const path = usePathname();
  const previousPath = useRef(path);
  useEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.dataset.navigation = "true";
    const timer = setTimeout(
      () => delete document.documentElement.dataset.navigation,
      550,
    );
    return () => {
      clearTimeout(timer);
      delete document.documentElement.dataset.navigation;
    };
  }, [path]);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
    );
    const initiallyVisible = new Set(
      elements.filter((element) => element.getBoundingClientRect().top < innerHeight),
    );
    elements.forEach((element) => {
      // Content initially in view must stay visible during hydration; only
      // sections reached later should wait for an entrance animation.
      if (initiallyVisible.has(element))
        element.dataset.revealed = "true";
      else observer.observe(element);
    });
    document.documentElement.classList.add("motion-ready");
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.motionVisible = String(entry.isIntersecting);
        });
      },
      { rootMargin: "100px" },
    );
    document
      .querySelectorAll("main section")
      .forEach((section) => animationObserver.observe(section));
    return () => {
      observer.disconnect();
      animationObserver.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, [path]);
  return null;
}
