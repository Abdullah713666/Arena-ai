import React from 'react';
import {Limb} from '../lib/shapes';
import {C, STROKE as S} from '../lib/theme';

/**
 * The real archer: huge pear torso with a small block head. Feet centre at the
 * origin. `fill` lets the spotlight shot render him as a solid silhouette.
 * Arms are children in local space (shoulders at about (+-95, -520)).
 */
export const Buff: React.FC<{
  fill?: string;
  eye?: 'slit' | 'wide' | 'none';
  behind?: React.ReactNode;
  children?: React.ReactNode;
  legs?: 'stand' | 'wide' | 'step';
  lean?: number;
}> = ({fill = C.buff, eye = 'slit', behind, children, legs = 'stand', lean = 0}) => {
  const line = fill === C.buff ? C.ink : fill;
  const legD =
    legs === 'wide'
      ? ['M-50,-190 L-110,-6 l-26,0', 'M50,-190 L110,-6 l26,0']
      : legs === 'step'
        ? ['M-50,-190 Q-60,-90 -120,-30 l-10,24', 'M50,-190 L40,-6 l26,0']
        : ['M-46,-190 L-56,-6 l-22,0', 'M46,-190 L50,-6 l24,0'];
  return (
    <g transform={`rotate(${lean})`}>
      {behind}
      {legD.map((d, i) => (
        <g key={i} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={d} stroke={line} strokeWidth={48 + S * 2} />
          <path d={d} stroke={fill} strokeWidth={48} />
        </g>
      ))}
      {/* head block */}
      <path d="M-40,-520 L-44,-690 Q-44,-704 -30,-704 L48,-708 Q62,-708 62,-694 L64,-520 Z" fill={fill} stroke={line} strokeWidth={S} />
      {/* torso */}
      <path
        d="M-95,-560 Q-40,-590 20,-575 Q110,-570 120,-480 C150,-380 150,-240 90,-180 Q0,-140 -90,-180 C-150,-260 -150,-420 -95,-560 Z"
        fill={fill}
        stroke={line}
        strokeWidth={S}
      />
      {fill === C.buff && (
        <g stroke={C.ink} strokeWidth={4} fill="none">
          <path d="M96,-300 q10,8 0,18" />
          <path d="M20,-440 q30,20 70,6" opacity={0.6} />
        </g>
      )}
      {eye === 'slit' && (
        <g stroke={C.ink} strokeWidth={S} fill="white">
          <path d="M14,-640 L52,-650 L50,-628 Q30,-622 14,-640 Z" />
          <circle cx={42} cy={-634} r={4} fill={C.ink} stroke="none" />
        </g>
      )}
      {eye === 'wide' && (
        <g stroke={C.ink} strokeWidth={S} fill="white">
          <circle cx={36} cy={-640} r={26} />
          <circle cx={44} cy={-640} r={7} fill={C.ink} stroke="none" />
        </g>
      )}
      {children}
    </g>
  );
};

/** Thick arm helper for the buff guy. */
export const BuffArm: React.FC<{d: string; fill?: string; w?: number}> = ({d, fill = C.buff, w = 62}) => (
  <Limb d={d} w={w} color={fill} outline={fill === C.buff ? S : 0} />
);

/** Big fist / mitten at a point. */
export const Fist: React.FC<{x: number; y: number; r?: number; fill?: string; a?: number}> = ({
  x,
  y,
  r = 40,
  fill = C.buff,
  a = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <rect x={-r} y={-r * 0.85} width={r * 2} height={r * 1.7} rx={r * 0.55} fill={fill} stroke={fill === C.buff ? C.ink : fill} strokeWidth={S} />
    {fill === C.buff && <path d={`M${r * 0.2},${-r * 0.5} l0,${r}`} stroke={C.ink} strokeWidth={4} />}
  </g>
);
