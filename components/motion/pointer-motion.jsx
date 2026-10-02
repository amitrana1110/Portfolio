"use client";
import { useEffect, useRef } from "react";
// A shared, frame-rate independent spring. Only animate while a target changes
// or a spring is settling; do not render the React tree on every pointer event.
export function usePointerSpring(initial = { x: 0, y: 0, angle: 0 }) {
  const element = useRef(null);
  const position = useRef({ ...initial });
  const target = useRef({ ...initial });
  const velocity = useRef({ x: 0, y: 0, angle: 0 });
  const frame = useRef(0);
  const last = useRef(0);
  const reduced = useRef(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduced.current = query.matches;
    };
    update();
    query.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      query.removeEventListener("change", update);
    };
  }, []);
  function paint() {
    const el = element.current;
    if (!el) return;
    el.style.setProperty("--pointer-x", `${position.current.x}px`);
    el.style.setProperty("--pointer-y", `${position.current.y}px`);
    el.style.setProperty("--pointer-angle", `${position.current.angle}deg`);
    el.style.setProperty("--tilt-x", `${-position.current.y}deg`);
    el.style.setProperty("--tilt-y", `${position.current.x}deg`);
  }
  function tick(time) {
    const dt = Math.min((time - last.current) / 1000 || 1 / 60, 1 / 30);
    last.current = time;
    let energy = 0;
    for (const axis of ["x", "y", "angle"]) {
      const distance = target.current[axis] - position.current[axis];
      velocity.current[axis] +=
        (distance * 190 - velocity.current[axis] * 22) * dt;
      position.current[axis] += velocity.current[axis] * dt;
      energy += Math.abs(distance) + Math.abs(velocity.current[axis]);
    }
    paint();
    if (energy > 0.12) frame.current = requestAnimationFrame(tick);
    else {
      position.current = { ...target.current };
      paint();
      frame.current = 0;
    }
  }
  function move(next, immediate = false) {
    target.current = next;
    if (immediate || reduced.current) {
      position.current = { ...next };
      velocity.current = { x: 0, y: 0, angle: 0 };
      paint();
    } else if (!frame.current) {
      last.current = performance.now();
      frame.current = requestAnimationFrame(tick);
    }
  }
  return { element, move };
}
export function TiltSurface({ children, className = "", restingAngle = 0 }) {
  const spring = usePointerSpring({ x: 0, y: 0, angle: restingAngle });
  return (
    <div
      ref={spring.element}
      className={`pointer-tilt ${className}`}
      data-reveal
      style={{ "--pointer-angle": `${restingAngle}deg` }}
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        spring.move({ x: x * 14, y: y * 14, angle: x * 8 });
      }}
      onPointerLeave={() => spring.move({ x: 0, y: 0, angle: restingAngle })}
    >
      {children}
    </div>
  );
}
