"use client";
import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/data/portfolio";
import { restingCard, stepCard, cardAtRest } from "@/lib/motion/card-physics";
import { Avatar } from "@/components/shared/avatar";

export function Greeting() {
  const greetings = ["Hello", "Hola", "नमस्ते", "Ciao", "你好"];
  const [index, setIndex] = useState(0);
  const greeting = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer;
    let visible = false;
    const sync = () => {
      clearInterval(timer);
      timer = undefined;
      if (visible && !document.hidden)
        timer = setInterval(
          () => setIndex((i) => (i + 1) % greetings.length),
          2000,
        );
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    if (greeting.current) observer.observe(greeting.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <span ref={greeting} className="greeting" role="img" aria-label="Hello">
      <span key={index} aria-hidden="true">
        {greetings[index]}
      </span>
    </span>
  );
}

export function HangingCard() {
  const root = useRef(null);
  const badge = useRef(null);
  const cord = useRef(null);
  const motion = useRef(restingCard());
  const held = useRef(false);
  const grab = useRef({ x: 0, y: 0, time: 0 });
  const previous = useRef({ x: 0, y: 0, time: 0 });
  const frame = useRef(0);
  const last = useRef(0);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !matchMedia("(max-width: 809.98px)").matches
    ) {
      motion.current = {
        ...restingCard(),
        x: -8,
        y: -360,
        vy: -90,
        yaw: -8,
        roll: 2,
      };
      paint();
      animate();
    } else {
      motion.current = restingCard();
      paint();
    }
    let away = false;
    const onScroll = () => {
      const hero = root.current?.closest(".hero");
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom < window.innerHeight * 0.5) away = true;
      if (away && bounds.top > -80 && !held.current) {
        away = false;
        if (
          !matchMedia("(prefers-reduced-motion: reduce)").matches &&
          !matchMedia("(max-width: 809.98px)").matches
        ) {
          motion.current = {
            ...restingCard(),
            x: -12,
            y: -280,
            vy: 40,
            yaw: -8,
          };
          paint();
          animate();
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, []);
  function paint() {
    const m = motion.current;
    if (badge.current) {
      badge.current.style.transform = `translate3d(${m.x}px,${m.y}px,0) rotateZ(${m.roll}deg) rotateY(${m.yaw}deg) rotateX(${m.pitch}deg)`;
      badge.current.dataset.motion = held.current
        ? "dragging"
        : cardAtRest(m)
          ? "idle"
          : "swinging";
    }
    // The rope stays attached to the clip through rotation, and bends with the
    // throw instead of rotating the entire card about an invisible fixed pivot.
    const endX = 180 + m.x,
      endY = 164 + m.y;
    const length = Math.hypot(m.x, endY + 35);
    const slack = Math.max(0, 199 - length);
    const bow = m.bend + slack * 0.65;
    const d = `M180 -35 C${180 + m.x * 0.22 + bow} ${-35 + (endY + 35) * 0.35 + slack * 0.65} ${180 + m.x * 0.72 + bow} ${-35 + (endY + 35) * 0.78 + slack * 0.5} ${endX} ${endY}`;
    cord.current?.setAttribute("d", d);
  }
  function tick(time) {
    const dt = (time - last.current) / 1000 || 1 / 60;
    last.current = time;
    stepCard(motion.current, dt, held.current);
    paint();
    if (held.current || !cardAtRest(motion.current))
      frame.current = requestAnimationFrame(tick);
    else {
      motion.current = restingCard();
      paint();
      frame.current = 0;
    }
  }
  function animate() {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      matchMedia("(max-width: 809.98px)").matches
    ) {
      paint();
      return;
    }
    if (!frame.current) {
      last.current = performance.now();
      frame.current = requestAnimationFrame(tick);
    }
  }
  function release(event) {
    if (!held.current && event) return;
    held.current = false;
    setDragging(false);
    if (event && event.timeStamp - previous.current.time > 100) {
      motion.current.vx = 0;
      motion.current.vy = 0;
    }
    if (event?.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      matchMedia("(max-width: 809.98px)").matches
    ) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      motion.current = restingCard();
      paint();
    } else animate();
  }
  function down(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    held.current = true;
    setDragging(true);
    grab.current = {
      x: event.clientX - motion.current.x,
      y: event.clientY - motion.current.y,
      time: event.timeStamp,
    };
    previous.current = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };
    motion.current.vx = 0;
    motion.current.vy = 0;
    animate();
  }
  function move(event) {
    if (!held.current) return;
    const x = event.clientX - grab.current.x,
      y = event.clientY - grab.current.y;
    const m = motion.current;
    const elapsed = Math.max(
      0.008,
      (event.timeStamp - previous.current.time) / 1000,
    );
    m.vx = Math.max(
      -1600,
      Math.min(1600, (event.clientX - previous.current.x) / elapsed),
    );
    m.vy = Math.max(
      -1200,
      Math.min(1200, (event.clientY - previous.current.y) / elapsed),
    );
    // Pointer capture keeps the grab attached anywhere on the page. Preserve
    // the initial grab offset; don't impose artificial hero or axis limits.
    m.x = x;
    m.y = y;
    previous.current = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };
    paint();
  }
  return (
    <div
      ref={root}
      className="hanging-card"
      aria-label="Interactive hanging profile card"
    >
      <svg className="cord" viewBox="0 0 360 500" aria-hidden="true">
        <path
          ref={cord}
          d="M180 -35 C180 22 180 100 180 164"
          stroke="#a6a6a6"
          strokeWidth="9"
          vectorEffect="non-scaling-stroke"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <button
        ref={badge}
        className={`hanging-badge ${dragging ? "dragging" : ""}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={(event) => {
          if (held.current) release(event);
        }}
        onKeyDown={(event) => {
          if (
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
              event.key,
            )
          ) {
            event.preventDefault();
            motion.current.vx +=
              event.key === "ArrowLeft"
                ? -620
                : event.key === "ArrowRight"
                  ? 620
                  : 0;
            motion.current.vy +=
              event.key === "ArrowUp"
                ? -400
                : event.key === "ArrowDown"
                  ? 400
                  : 0;
            release();
          }
        }}
        aria-label="Drag or throw the profile card; use arrow keys to swing it"
      >
        <span className="badge-front">
          <Avatar large />
          <span className="badge-caption">
            <strong>{portfolio.name}</strong>
            <small>{portfolio.role}</small>
          </span>
          <span className="badge-code" aria-hidden="true">
            &lt;/&gt;
          </span>
        </span>
        <span className="badge-back" aria-hidden="true">
          <span>AR</span>
          <small>React · Next.js · TypeScript</small>
        </span>
        <span className="badge-clip" />
      </button>
      <span className="drag-hint">grab, move, and let go ↗</span>
    </div>
  );
}
