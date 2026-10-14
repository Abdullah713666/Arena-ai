import React from 'react';
import {Arrow, Limb, Sword} from '../lib/shapes';
import {C, STROKE as S} from '../lib/theme';

export type KnightEyes = 'slit' | 'angry' | 'alarmed' | 'squint';
export type StuckArrow = {x: number; y: number; a: number; len?: number};

const Visor: React.FC<{eyes: KnightEyes; cx: number; cy: number; look?: number}> = ({eyes, cx, cy, look = 0}) => {
  if (eyes === 'slit') {
    return <line x1={cx - 55} y1={cy} x2={cx + 55} y2={cy} stroke={C.ink} strokeWidth={S} />;
  }
  if (eyes === 'squint') {
    return (
      <g stroke={C.ink} strokeWidth={S} fill="none">
        <path d={`M${cx - 60},${cy - 6} Q${cx - 30},${cy + 4} ${cx - 8},${cy}`} />
        <path d={`M${cx + 8},${cy} Q${cx + 30},${cy + 4} ${cx + 60},${cy - 6}`} />
      </g>
    );
  }
  if (eyes === 'angry') {
    return (
      <g stroke={C.ink} strokeWidth={S} fill="white">
        <path d={`M${cx - 62},${cy - 14} L${cx - 10},${cy} Q${cx - 30},${cy + 18} ${cx - 60},${cy + 6} Z`} />
        <path d={`M${cx + 62},${cy - 14} L${cx + 10},${cy} Q${cx + 30},${cy + 18} ${cx + 60},${cy + 6} Z`} />
        <circle cx={cx - 26 + look * 8} cy={cy + 6} r={5} fill={C.ink} stroke="none" />
        <circle cx={cx + 26 + look * 8} cy={cy + 6} r={5} fill={C.ink} stroke="none" />
      </g>
    );
  }
  // alarmed: big round eyes popping out of the helmet
  return (
    <g stroke={C.ink} strokeWidth={S} fill="white">
      <ellipse cx={cx - 8} cy={cy - 30} rx={34} ry={44} />
      <ellipse cx={cx + 46} cy={cy - 26} rx={30} ry={40} />
      <circle cx={cx - 2 + look * 10} cy={cy - 24} r={8} fill={C.ink} stroke="none" />
      <circle cx={cx + 50 + look * 10} cy={cy - 20} r={8} fill={C.ink} stroke="none" />
    </g>
  );
};

/** Front guard pose from the opening shot. Feet centre at the origin. */
export const KnightGuard: React.FC<{
  eyes?: KnightEyes;
  swordAngle?: number;
  armLift?: number;
  stuck?: StuckArrow[];
  look?: number;
}> = ({eyes = 'slit', swordAngle = 38, armLift = 0, stuck = [], look = 0}) => {
  const fist: [number, number] = [-245, -650 - armLift];
  return (
    <g>
      {/* legs */}
      <path d="M-70,-120 L-120,-30 L-190,-30 L-195,10 L-80,10 L-30,-110 Z" fill={C.steelDark} stroke={C.ink} strokeWidth={S} />
      <path d="M40,-120 L60,-20 L40,10 L140,10 L130,-30 L110,-120 Z" fill={C.steelDark} stroke={C.ink} strokeWidth={S} />
      {/* raised arm */}
      <Limb d={`M-90,-400 L-200,-430 L${fist[0]},${fist[1] + 40}`} w={70} color={C.steelDark} />
      <g transform={`translate(${fist[0]} ${fist[1]}) rotate(${swordAngle})`}>
        <g transform="translate(0 6)">
          <Sword len={300} />
        </g>
      </g>
      <path
        d={`M${fist[0] - 44},${fist[1] - 20} q10,-40 50,-30 q34,0 38,30 l-6,52 q-40,14 -80,-2 Z`}
        fill={C.steel}
        stroke={C.ink}
        strokeWidth={S}
      />
      {/* tunic */}
      <path d="M-125,-440 L85,-440 L95,-150 L-135,-150 Z" fill={C.steel} stroke={C.ink} strokeWidth={S} />
      <path d="M-140,-170 L100,-170 L118,-70 L-160,-70 Z" fill={C.steel} stroke={C.ink} strokeWidth={S} />
      <rect x={-142} y={-192} width={244} height={32} fill={C.steelDeep} stroke={C.ink} strokeWidth={S} />
      <path d="M-60,-300 l14,40 M-20,-120 l8,30 M40,-360 l-6,28" stroke={C.ink} strokeWidth={4} />
      {/* helmet */}
      <path d="M-105,-430 L-100,-630 Q-100,-650 -80,-650 L75,-650 Q95,-650 95,-630 L100,-430 Z" fill={C.steel} stroke={C.ink} strokeWidth={S} />
      <Visor eyes={eyes} cx={-5} cy={-548} look={look} />
      {stuck.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.a})`}>
          <g transform={`translate(${-(s.len ?? 240) / 2 - 6} 0)`}>
            <Arrow len={s.len ?? 240} headless />
          </g>
        </g>
      ))}
      {/* shield, a slab with a visible edge */}
      <path d="M-30,-470 L-10,-480 L-10,-60 L-30,-62 Z" fill={C.steelDark} stroke={C.ink} strokeWidth={S} />
      <path
        d="M-10,-480 Q120,-500 270,-470 Q282,-300 262,-80 Q120,-58 -10,-60 Z"
        fill={C.steel}
        stroke={C.ink}
        strokeWidth={S}
      />
      {[
        [30, -420],
        [220, -430],
        [40, -110],
        [220, -110],
        [130, -300],
        [90, -220],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill={C.steelDark} />
      ))}
    </g>
  );
};

/** Side-on knight (facing left) used in the game / health-bar shot. */
export const KnightSide: React.FC<{
  eyes?: KnightEyes;
  look?: number;
  stuck?: StuckArrow[];
  sword?: number; // sword swing angle; 0 = resting down
  thumb?: boolean;
}> = ({eyes = 'angry', look = -1, stuck = [], sword = 0, thumb = false}) => (
  <g>
    <rect x={-50} y={-130} width={42} height={130} fill={C.steelDeep} stroke={C.ink} strokeWidth={S} />
    <rect x={8} y={-130} width={42} height={130} fill={C.steelDeep} stroke={C.ink} strokeWidth={S} />
    {/* sword hangs behind */}
    <g transform={`translate(60 -230) rotate(${160 - sword})`}>
      <Sword len={190} scale={0.8} />
    </g>
    <path d="M-80,-420 L85,-420 L90,-120 L-85,-120 Z" fill={C.steel} stroke={C.ink} strokeWidth={S} />
    <rect x={-88} y={-170} width={180} height={24} fill={C.steelDeep} stroke={C.ink} strokeWidth={S} />
    <path d="M-70,-560 L-75,-420 L80,-420 L70,-570 Q66,-584 50,-584 L-50,-584 Q-66,-584 -70,-560 Z" fill={C.steel} stroke={C.ink} strokeWidth={S} />
    <Visor eyes={eyes} cx={-25} cy={-505} look={look} />
    {stuck.map((s, i) => (
      <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.a})`}>
        <g transform={`translate(${-(s.len ?? 200) / 2 - 6} 0)`}>
          <Arrow len={s.len ?? 200} headless />
        </g>
      </g>
    ))}
    {/* arm with fist / thumbs-up */}
    <path d="M40,-400 Q90,-380 80,-300 Q70,-250 30,-250" fill={C.steelDark} stroke={C.ink} strokeWidth={S} />
    <path d="M-30,-300 q0,-34 34,-34 l30,0 q22,0 22,26 l0,30 q0,22 -24,22 l-38,0 q-24,0 -24,-24 Z" fill={C.steel} stroke={C.ink} strokeWidth={S} />
    {thumb && <path d="M-6,-334 l0,-34 q0,-14 14,-14 q14,0 14,14 l0,34" fill={C.steel} stroke={C.ink} strokeWidth={S} />}
  </g>
);
