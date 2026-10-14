import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CAPTION_FONT} from './Fonts';
import {FPS} from './theme';

export type Word = {w: string; s: number; e: number};

/** One word at a time, bold white with a black outline, like the reference. */
export const Captions: React.FC<{words: Word[]; y?: number; size?: number}> = ({
  words,
  y = 1568,
  size = 56,
}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let idx = -1;
  for (let i = 0; i < words.length; i++) {
    const next = words[i + 1]?.s ?? Infinity;
    const until = Math.min(next, words[i].e + 0.6);
    if (t >= words[i].s && t < until) idx = i;
  }
  if (idx < 0) return null;
  const word = words[idx];
  const age = f - Math.round(word.s * FPS);
  const opacity = interpolate(age, [0, 2], [0.25, 1], {extrapolateRight: 'clamp'});
  const scale = interpolate(age, [0, 3], [0.92, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: y,
          left: 0,
          right: 0,
          textAlign: 'center',
          transform: `translateY(-50%) scale(${scale})`,
          fontFamily: CAPTION_FONT,
          fontSize: size,
          letterSpacing: -1,
          color: 'white',
          opacity,
          WebkitTextStroke: '11px #111',
          paintOrder: 'stroke fill',
          textShadow: '0 3px 0 #111',
        }}
      >
        {word.w.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};
