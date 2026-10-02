import test from "node:test";
import assert from "node:assert/strict";
import { subscribeScroll } from "../lib/scroll-scheduler.js";

test("scroll subscribers share a frame and release all listeners on cleanup", () => {
  const listeners = new Map();
  const frames = new Map();
  let nextId = 0;
  const original = Object.fromEntries(
    [
      "addEventListener",
      "removeEventListener",
      "requestAnimationFrame",
      "cancelAnimationFrame",
    ].map((key) => [key, globalThis[key]]),
  );
  Object.assign(globalThis, {
    addEventListener: (event, fn) => {
      assert.ok(!listeners.has(event));
      listeners.set(event, fn);
    },
    removeEventListener: (event, fn) => {
      assert.equal(listeners.get(event), fn);
      listeners.delete(event);
    },
    requestAnimationFrame: (fn) => {
      frames.set(++nextId, fn);
      return nextId;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  let first = 0,
    second = 0;
  const stopFirst = subscribeScroll(() => first++);
  const stopSecond = subscribeScroll(() => second++);
  try {
    assert.equal(listeners.size, 2);
    listeners.get("scroll")();
    listeners.get("scroll")();
    listeners.get("resize")();
    assert.equal(frames.size, 1);
    const callback = [...frames.values()][0];
    frames.clear();
    callback();
    assert.equal(first, 1);
    assert.equal(second, 1);
    stopFirst();
    listeners.get("scroll")();
    const next = [...frames.values()][0];
    frames.clear();
    next();
    assert.equal(first, 1);
    assert.equal(second, 2);
    listeners.get("scroll")();
    stopSecond();
    assert.equal(frames.size, 0);
    assert.equal(listeners.size, 0);
  } finally {
    stopFirst();
    stopSecond();
    Object.assign(globalThis, original);
  }
});
