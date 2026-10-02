import test from "node:test";
import assert from "node:assert/strict";
import {
  restingCard,
  stepCard,
  cardAtRest,
} from "../lib/motion/card-physics.js";

test("an entry drop overshoots and bounces back before settling", () => {
  const card = { ...restingCard(), y: -360, vy: -90 };
  let crossed = false;
  let bounced = false;
  let peak = 0;
  for (let frame = 0; frame < 900; frame++) {
    stepCard(card, 1 / 60);
    peak = Math.max(peak, card.y);
    crossed ||= card.y > 0;
    bounced ||= crossed && card.y < -10;
  }
  assert.ok(
    peak > 50,
    "the drop should visibly overshoot the resting position",
  );
  assert.ok(bounced, "the card should bounce back after its first drop");
  assert.ok(cardAtRest(card));
});

test("a throw crosses the resting position, twists in 3D, and settles", () => {
  const card = { ...restingCard(), x: -350, y: 80, vx: 1100, vy: -350 };
  let crossed = false,
    largestTwist = 0;
  for (let frame = 0; frame < 900; frame++) {
    stepCard(card, 1 / 60);
    crossed ||= card.x > 0;
    largestTwist = Math.max(largestTwist, Math.abs(card.yaw));
    assert.ok(Object.values(card).every(Number.isFinite));
  }
  assert.ok(crossed, "the released badge should swing past the anchor");
  assert.ok(
    largestTwist > 60,
    "a fast throw should turn the card almost edge-on",
  );
  assert.ok(cardAtRest(card), "the motion must eventually stop");
});

test("holding a card preserves its grabbed position while it twists", () => {
  const card = { ...restingCard(), x: -220, y: 40, vx: -650 };
  for (let frame = 0; frame < 30; frame++) stepCard(card, 1 / 60, true);
  assert.equal(card.x, -220);
  assert.equal(card.y, 40);
  assert.ok(Math.abs(card.yaw) > 15);
  assert.ok(Math.abs(card.vx) < 2, "a stationary grab stops twisting");
});

test("30, 60, and 120Hz simulation all settle without diverging", () => {
  for (const rate of [30, 60, 120]) {
    const card = { ...restingCard(), x: -500, y: -180, vx: 1600, vy: 1200 };
    for (let frame = 0; frame < rate * 18; frame++) stepCard(card, 1 / rate);
    assert.ok(cardAtRest(card), `motion must settle at ${rate}Hz`);
  }
});

test("a delayed animation frame does not explode the spring", () => {
  const card = { ...restingCard(), x: -500, y: 100, vx: 900 };
  stepCard(card, 30);
  assert.ok(Math.abs(card.x) < 600 && Math.abs(card.y) < 150);
  assert.ok(Object.values(card).every(Number.isFinite));
});

test("reload bounce settles at about 10 seconds", () => {
  const card = { ...restingCard(), x: -8, y: -360, vy: -90 };
  let seconds = 0;
  while (!cardAtRest(card) && seconds < 20) {
    stepCard(card, 1 / 60);
    seconds += 1 / 60;
  }
  assert.ok(seconds >= 9.5 && seconds <= 11, `settled after ${seconds}s`);
});

test("slack cord permits a gravity-driven fall, and a side swing rises", () => {
  const raised = { ...restingCard(), y: -100 };
  stepCard(raised, 1 / 60);
  assert.ok(raised.vy > 0, "gravity pulls down a raised card with slack cord");
  const side = { ...restingCard(), x: 220 };
  stepCard(side, 1 / 60);
  assert.ok(
    side.vx < 0 && side.vy < 0,
    "tension pulls toward the anchor along an arc",
  );
});

test("reference rebound peaks are roughly 0.6 seconds apart", () => {
  const card = { ...restingCard(), x: -8, y: -360, vy: -90 };
  const peaks = [];
  for (let frame = 1; frame <= 720; frame++) {
    const previousVelocity = card.vy;
    stepCard(card, 1 / 240);
    if (previousVelocity > 0 && card.vy <= 0)
      peaks.push({ time: frame / 240, y: card.y });
  }
  assert.ok(peaks.length >= 4);
  for (let i = 1; i < 4; i++) {
    const period = peaks[i].time - peaks[i - 1].time;
    assert.ok(period > 0.5 && period < 0.67, `rebound period ${period}s`);
  }
  assert.ok(peaks[1].y < peaks[0].y * 0.3, "large rebounds decay quickly");
});

test("24fps and 60fps retain the same real-time bounce speed", () => {
  const slow = { ...restingCard(), x: -8, y: -360, vy: -90 };
  const fast = { ...slow };
  for (let i = 0; i < 48; i++) stepCard(slow, 1 / 24);
  for (let i = 0; i < 120; i++) stepCard(fast, 1 / 60);
  assert.ok(Math.abs(slow.y - fast.y) < 0.01);
  assert.ok(Math.abs(slow.vy - fast.vy) < 0.01);
});
