"use client";
import { useEffect, useRef } from "react";
export function ScrollTimeline({ children }) {
  const container = useRef(null);
  const track = useRef(null);
  useEffect(() => {
    const element = container.current;
    const line = track.current;
    let frame = 0;
    function update() {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (innerHeight * 0.55 - rect.top) / rect.height),
      );
      line.style.setProperty("--timeline-progress", String(progress));
      line.dataset.progress = progress.toFixed(3);
    }
    function measure() {
      const rails = Array.from(element.querySelectorAll(".timeline-rail"));
      const first = rails[0];
      if (!first) return;
      line.style.left = `${first.offsetLeft + first.parentElement.offsetLeft + first.offsetWidth / 2 - 1.5}px`;
      // Mask the entire track, including its orange child, around each number.
      // Layout offsets ignore reveal transforms, keeping the gaps stable.
      const stops = ["#000 0px"];
      for (const rail of rails) {
        const number = rail.querySelector("span");
        const top =
          rail.parentElement.offsetTop + rail.offsetTop + number.offsetTop;
        const start = Math.max(0, top - 8),
          end = top + number.offsetHeight + 8;
        stops.push(
          `#000 ${start}px`,
          `transparent ${start}px`,
          `transparent ${end}px`,
          `#000 ${end}px`,
        );
      }
      stops.push("#000 100%");
      line.style.maskImage = `linear-gradient(to bottom,${stops.join(",")})`;
      update();
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element
      .querySelectorAll(".timeline-rail span")
      .forEach((number) => observer.observe(number));
    measure();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", measure);
    };
  }, []);
  return (
    <div ref={container} className="timeline">
      <div ref={track} className="timeline-track" aria-hidden="true">
        <div className="timeline-fill" />
      </div>
      {children}
    </div>
  );
}
