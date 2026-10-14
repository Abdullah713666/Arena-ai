import React from 'react';
import {interpolate, random} from 'remotion';
import {EASE} from './anim';
import {Arrow} from './shapes';
import {C, H, W} from './theme';

/** Arrow travelling from `from` to `to` between frames a..b; hidden outside. */
export const FlyingArrow: React.FC<{
  f: number;
  a: number;
  b: number;
  from: [number, number];
  to: [number, number];
  len?: number;
}> = ({f, a, b, from, to, len = 240}) => {
  if (f < a || f >= b) return null;
  const t = interpolate(f, [a, b], [0, 1]);
  const x = from[0] + (to[0] - from[0]) * t;
  const y = from[1] + (to[1] - from[1]) * t;
  const ang = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      {/* speed streak */}
      <line x1={-len * 1.4} y1={0} x2={-len * 0.6} y2={0} stroke="white" strokeWidth={6} opacity={0.7} />
      <g transform={`translate(${-len / 2} 0)`}>
        <Arrow len={len} />
      </g>
    </g>
  );
};

/** Squares that blow apart and fade, like a game death. */
export const PixelBurst: React.FC<{f: number; start: number; x: number; y: number; w: number; h: number; colors?: string[]; seed?: string; reverse?: boolean}> = ({
  f,
  start,
  x,
  y,
  w,
  h,
  colors = ['#ffffff', '#e6e6e6', '#cfcfcf', '#f4f4f4'],
  seed = 'px',
}) => {
  const t = f - start;
  if (t < 0 || t > 26) return null;
  const n = 70;
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const px = x + (random(`${seed}a${i}`) - 0.5) * w;
        const py = y + (random(`${seed}b${i}`) - 0.5) * h;
        const vx = (random(`${seed}c${i}`) - 0.3) * 9;
        const vy = -random(`${seed}d${i}`) * 5;
        const s = 10 + random(`${seed}e${i}`) * 22;
        const life = 12 + random(`${seed}f${i}`) * 14;
        const o = interpolate(t, [0, life], [1, 0], {extrapolateRight: 'clamp'});
        const grow = interpolate(t, [0, 3], [0.4, 1], {extrapolateRight: 'clamp'});
        return (
          <rect
            key={i}
            x={px + vx * t - (s * grow) / 2}
            y={py + vy * t - (s * grow) / 2}
            width={s * grow}
            height={s * grow}
            fill={colors[i % colors.length]}
            opacity={o}
          />
        );
      })}
    </g>
  );
};

/** Ink/paint splat: a spiky blob that grows from a point. */
export const Splat: React.FC<{x: number; y: number; r: number; color?: string; seed?: string; spikes?: number}> = ({
  x,
  y,
  r,
  color = 'white',
  seed = 'sp',
  spikes = 14,
}) => {
  if (r <= 0) return null;
  const pts: string[] = [];
  const n = spikes * 2;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const spike = i % 2 === 0;
    const k = spike ? 1 + random(`${seed}${i}`) * 0.9 : 0.55 + random(`${seed}${i}`) * 0.2;
    pts.push(`${x + Math.cos(a) * r * k},${y + Math.sin(a) * r * k}`);
  }
  const drops = Array.from({length: 10}, (_, i) => {
    const a = random(`${seed}da${i}`) * Math.PI * 2;
    const d = r * (1.5 + random(`${seed}dd${i}`) * 0.9);
    return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={r * (0.05 + random(`${seed}dr${i}`) * 0.08)} fill={color} />;
  });
  return (
    <g>
      <path d={`M${pts.join(' L')} Z`} fill={color} stroke={color} strokeWidth={r * 0.18} strokeLinejoin="round" />
      {drops}
    </g>
  );
};

/** Old film / VHS treatment for the rewind. Overlay drawn above the shot. */
export const OldFilmOverlay: React.FC<{f: number; glitch?: number}> = ({f, glitch = 0.4}) => {
  const bars = Array.from({length: 4}, (_, i) => {
    const on = random(`gb${f}-${i}`) < glitch;
    if (!on) return null;
    const y = random(`gy${f}-${i}`) * H;
    const h = 6 + random(`gh${f}-${i}`) * 50;
    const col = ['#3cff6a', '#4a7bff', '#ff4a6a', '#ffffff'][i % 4];
    return <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y, height: h, background: col, opacity: 0.55, mixBlendMode: 'screen'}} />;
  });
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)',
        }}
      />
      {bars}
      {/* rounded CRT frame */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 70, boxShadow: '0 0 0 40px #111 inset, 0 0 60px 50px rgba(0,0,0,0.9) inset'}} />
    </>
  );
};

/** Black letterbox bars. */
export const Letterbox: React.FC<{amount: number}> = ({amount}) => (
  <g>
    <rect x={-100} y={-100} width={W + 200} height={100 + amount} fill={C.black} />
    <rect x={-100} y={H - amount} width={W + 200} height={amount + 100} fill={C.black} />
  </g>
);

export const easeOut = EASE.out;
