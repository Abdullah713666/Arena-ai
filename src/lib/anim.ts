import {createContext, useContext} from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {FPS} from './theme';

// Scenes read time through useT() instead of useCurrentFrame() so a parent
// can replay them at any frame (used by the rewind shot).
export const TimeOverride = createContext<number | null>(null);

export const useT = (): number => {
  const real = useCurrentFrame();
  const forced = useContext(TimeOverride);
  return forced ?? real;
};

export const sec = (s: number) => Math.round(s * FPS);

export const EASE = {
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  back: Easing.out(Easing.back(2)),
  linear: Easing.linear,
};

/** Keyframe track: [[frame, value], ...] with clamped ends. */
export const track = (
  f: number,
  keys: [number, number][],
  easing: (t: number) => number = EASE.inOut,
): number => {
  if (keys.length === 1) return keys[0][1];
  return interpolate(
    f,
    keys.map((k) => k[0]),
    keys.map((k) => k[1]),
    {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
};

/** Step track: holds each value until the next key (for drawn-pose swaps). */
export const step = <T,>(f: number, keys: [number, T][]): T => {
  let v = keys[0][1];
  for (const [at, val] of keys) if (f >= at) v = val;
  return v;
};

export const ramp = (
  f: number,
  a: number,
  b: number,
  easing: (t: number) => number = EASE.inOut,
) => track(f, [[a, 0], [b, 1]], easing);

/** Decaying camera shake starting at `start`. */
export const shake = (f: number, start: number, dur: number, amp: number, seed = 'shk') => {
  const t = f - start;
  if (t < 0 || t > dur) return {x: 0, y: 0, r: 0};
  const k = amp * (1 - t / dur) ** 2;
  return {
    x: (random(`${seed}x${t}`) - 0.5) * 2 * k,
    y: (random(`${seed}y${t}`) - 0.5) * 2 * k,
    r: (random(`${seed}r${t}`) - 0.5) * 0.02 * k,
  };
};

/** Animation-on-twos: hold each value for `n` frames, like hand-drawn work. */
export const onTwos = (f: number, n = 2) => Math.floor(f / n) * n;
