export const restingCard = () => ({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  yaw: 0,
  yawVelocity: 0,
  pitch: 0,
  roll: 0,
  bend: 0,
  bendVelocity: 0,
});
const clamp = (v, limit) => Math.max(-limit, Math.min(limit, v));
// Integrate at a bounded timestep: the card retains the velocity of the throw,
// while tension and damping bring both the badge and its twist back to rest.
export function stepCard(state, elapsed, held = false) {
  // Advance real elapsed time in small stable steps. A 24fps frame must not
  // discard time and make the animation slower than a 60fps frame.
  const duration = Math.min(0.1, Math.max(0, elapsed));
  const steps = Math.max(1, Math.ceil(duration / (1 / 240)));
  for (let i = 0; i < steps; i++) integrateCard(state, duration / steps, held);
  return state;
}
function integrateCard(state, dt, held) {
  if (held) {
    // A stationary grab should stop twisting even if the last pointer event
    // was fast. Fresh movement restores velocity in the pointer handler.
    state.vx *= Math.exp(-12 * dt);
    state.vy *= Math.exp(-12 * dt);
  } else {
    // A hanging mass: gravity acts even with slack, while the stretched cord
    // pulls along its own direction. Horizontal swings shorten the height.
    const length = Math.hypot(state.x, state.y + 199);
    const nx = length > 0.001 ? state.x / length : 0;
    const ny = length > 0.001 ? (state.y + 199) / length : 1;
    const radialVelocity = state.vx * nx + state.vy * ny;
    // Measured reference rebounds are about 0.6 seconds apart. Stiffness
    // controls that speed; amplitude-dependent damping kills the large drop
    // quickly, then lets the small residual bounce fade more gently.
    const amplitude = Math.hypot(length - 199, radialVelocity / Math.sqrt(120));
    const radialDamping = 0.03 + 4.5 * Math.min(1, amplitude / 16);
    const tension = Math.max(
      0,
      120 * (length - 177) + radialVelocity * radialDamping,
    );
    state.vx += (-tension * nx - 1.2 * state.vx) * dt;
    state.vy += (2640 - tension * ny - 1.2 * state.vy) * dt;
    state.x += state.vx * dt;
    state.y += state.vy * dt;
  }
  // The strap has its own inertia; its curve trails the moving clip instead
  // of changing shape instantly with every pointer sample.
  const bendTarget = clamp(-state.vx * 0.075, 105);
  state.bendVelocity +=
    ((bendTarget - state.bend) * 38 - state.bendVelocity * 6) * dt;
  state.bend += state.bendVelocity * dt;
  const twist = clamp(state.vx * 0.095 + state.x * 0.12, 86);
  state.yawVelocity += ((twist - state.yaw) * 55 - state.yawVelocity * 7) * dt;
  state.yaw += state.yawVelocity * dt;
  state.pitch +=
    (clamp(-state.vy * 0.028, 22) - state.pitch) * Math.min(1, dt * 9);
  state.roll +=
    (clamp(
      ((-Math.atan2(state.x, Math.max(80, state.y + 199)) * 180) / Math.PI) *
        0.3 -
        state.vx * 0.006,
      28,
    ) -
      state.roll) *
    Math.min(1, dt * 8);
  return state;
}
export function cardAtRest(state) {
  return (
    Math.abs(state.x) +
      Math.abs(state.y) +
      Math.abs(state.vx) +
      Math.abs(state.vy) +
      Math.abs(state.yaw) +
      Math.abs(state.yawVelocity) +
      Math.abs(state.bend) +
      Math.abs(state.bendVelocity) <
    0.3
  );
}
