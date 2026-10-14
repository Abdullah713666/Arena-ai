import React, {useId} from 'react';
import {random} from 'remotion';
import {C, H, STROKE, W} from './theme';

const S = STROKE;

/** Tube limb: a fat black stroke under a thinner coloured one. */
export const Limb: React.FC<{d: string; w: number; color: string; outline?: number}> = ({
  d,
  w,
  color,
  outline = S,
}) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={C.ink} strokeWidth={w + outline * 2} />
    <path d={d} stroke={color} strokeWidth={w} />
  </g>
);

/** Two-segment limb from shoulder angle + elbow angle (degrees, 0 = +x). */
export const arm2 = (x: number, y: number, a1: number, l1: number, a2: number, l2: number) => {
  const r = Math.PI / 180;
  const ex = x + Math.cos(a1 * r) * l1;
  const ey = y + Math.sin(a1 * r) * l1;
  const hx = ex + Math.cos((a1 + a2) * r) * l2;
  const hy = ey + Math.sin((a1 + a2) * r) * l2;
  return {d: `M${x},${y} L${ex},${ey} L${hx},${hy}`, elbow: [ex, ey], hand: [hx, hy]};
};

export const SkyGround: React.FC<{horizon?: number; sky?: string; ground?: string; tilt?: number; seed?: string}> = ({
  horizon = 1180,
  sky = C.sky,
  ground = C.sand,
  tilt = 0,
  seed = 'g',
}) => {
  const specks = Array.from({length: 46}, (_, i) => ({
    x: random(`${seed}x${i}`) * (W + 400) - 200,
    y: horizon + 40 + random(`${seed}y${i}`) * (H - horizon + 200),
    r: 2 + random(`${seed}r${i}`) * 2.5,
  }));
  return (
    <g>
      <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill={sky} />
      <g transform={`rotate(${tilt} ${W / 2} ${horizon})`}>
        <rect x={-600} y={horizon} width={W + 1200} height={H + 800} fill={ground} />
        <line x1={-600} y1={horizon} x2={W + 600} y2={horizon} stroke={C.ink} strokeWidth={4} />
        {specks.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.sandSpeck} opacity={0.55} />
        ))}
      </g>
    </g>
  );
};

export const Shadow: React.FC<{x: number; y: number; rx: number; ry?: number; o?: number}> = ({
  x,
  y,
  rx,
  ry = rx * 0.14,
  o = 1,
}) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={C.shadow} opacity={o} />;

/** Arrow pointing along +x, centred on its shaft. */
export const Arrow: React.FC<{len?: number; scale?: number; headless?: boolean}> = ({
  len = 260,
  scale = 1,
  headless = false,
}) => {
  const h = len / 2;
  return (
    <g transform={`scale(${scale})`}>
      <line x1={-h} y1={0} x2={h - 4} y2={0} stroke={C.ink} strokeWidth={5} />
      {!headless && (
        <path d={`M${h + 16},0 L${h - 8},-9 L${h - 8},9 Z`} fill={C.ink} stroke={C.ink} strokeWidth={3} />
      )}
      <path
        d={`M${-h + 2},0 L${-h - 14},-13 L${-h + 18},-13 L${-h + 30},0 L${-h + 18},13 L${-h - 14},13 Z`}
        fill={C.fletch}
        stroke={C.ink}
        strokeWidth={3}
      />
      <line x1={-h - 10} y1={0} x2={-h + 26} y2={0} stroke={C.ink} strokeWidth={3} />
    </g>
  );
};

/**
 * Bow with its grip at the origin, belly facing +x.
 * draw: 0 = string at rest, 1 = fully drawn back toward -x.
 */
export const Bow: React.FC<{len?: number; bend?: number; draw?: number; strokeW?: number; color?: string}> = ({
  len = 170,
  bend = 46,
  draw = 0,
  strokeW = 5,
  color = C.ink,
}) => {
  const L = len * (1 - draw * 0.1);
  const b = bend * (1 + draw * 0.6);
  const nock = -draw * len * 0.75;
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      <path d={`M${-b},${-L} Q${b},0 ${-b},${L}`} strokeWidth={strokeW + 2.5} />
      <path d={`M${-b},${-L} L${nock - b * 0.3},0 L${-b},${L}`} strokeWidth={Math.max(2, strokeW * 0.45)} />
    </g>
  );
};

export const Sword: React.FC<{len?: number; scale?: number}> = ({len = 260, scale = 1}) => (
  // Pointing up (-y), hilt at the origin.
  <g transform={`scale(${scale})`} strokeWidth={S} stroke={C.ink}>
    <path
      d={`M-30,-36 L-30,${-len} L0,${-len - 44} L30,${-len} L30,-36 Z`}
      fill={C.blade}
      strokeLinejoin="round"
    />
    <rect x={-56} y={-50} width={112} height={26} rx={5} fill={C.gold} />
    <rect x={-11} y={-28} width={22} height={58} rx={5} fill={C.gold} />
  </g>
);

/**
 * Cartoon eye. lid: 0 open, 1 closed (lid comes down from the top).
 * look: pupil offset in units of eye radius.
 */
export const Eye: React.FC<{
  x: number;
  y: number;
  r: number;
  rx?: number;
  look?: [number, number];
  lid?: number;
  lidAngle?: number;
  lidColor?: string;
  pupil?: number;
}> = ({x, y, r, rx, look = [0, 0], lid = 0, lidAngle = 0, lidColor = C.skin, pupil = 0.22}) => {
  const id = useId().replace(/:/g, '');
  const ex = rx ?? r;
  return (
    <g>
      <clipPath id={`e${id}`}>
        <ellipse cx={x} cy={y} rx={ex} ry={r} />
      </clipPath>
      <ellipse cx={x} cy={y} rx={ex} ry={r} fill="white" />
      <circle cx={x + look[0] * ex * 0.55} cy={y + look[1] * r * 0.55} r={r * pupil} fill={C.ink} clipPath={`url(#e${id})`} />
      {lid > 0 && (
        <g clipPath={`url(#e${id})`} transform={`rotate(${lidAngle} ${x} ${y})`}>
          <rect x={x - ex * 1.6} y={y - r * 1.6} width={ex * 3.2} height={r * 0.6 + lid * r * 2} fill={lidColor} />
          <line
            x1={x - ex * 1.6}
            x2={x + ex * 1.6}
            y1={y - r * 1.0 + lid * r * 2}
            y2={y - r * 1.0 + lid * r * 2}
            stroke={C.ink}
            strokeWidth={S}
          />
        </g>
      )}
      <ellipse cx={x} cy={y} rx={ex} ry={r} fill="none" stroke={C.ink} strokeWidth={S} />
    </g>
  );
};

/** Hand-drawn style ">" squint eye. */
export const SquintEye: React.FC<{x: number; y: number; s: number; flip?: boolean}> = ({x, y, s, flip}) => (
  <path
    d={flip ? `M${x - s},${y - s * 0.6} L${x + s},${y} L${x - s},${y + s * 0.6}` : `M${x + s},${y - s * 0.6} L${x - s},${y} L${x + s},${y + s * 0.6}`}
    fill="none"
    stroke={C.ink}
    strokeWidth={S}
  />
);
