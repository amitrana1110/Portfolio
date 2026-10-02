const subscribers = new Set();
let frame = 0;
function flush() {
  frame = 0;
  subscribers.forEach((update) => update());
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}
// One passive listener and one animation frame for scroll-driven React controls.
export function subscribeScroll(update) {
  if (!subscribers.size) {
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
  }
  subscribers.add(update);
  return () => {
    if (!subscribers.delete(update)) return;
    if (!subscribers.size) {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
