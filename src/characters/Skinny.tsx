import React from 'react';
import {Eye, Limb, SquintEye} from '../lib/shapes';
import {C, STROKE as S} from '../lib/theme';

export type Face = {
  eyes?: 'open' | 'squint' | 'big' | 'happy' | 'none';
  look?: [number, number];
  lid?: number;
  lidAngle?: number;
  mouth?: 'flat' | 'smile' | 'grin' | 'o' | 'frown' | 'wavy' | 'none';
};

export type Legs = 'stand' | 'squat' | 'wide' | 'kneel';

const Mouth: React.FC<{kind: Face['mouth']; x: number; y: number; s?: number}> = ({kind, x, y, s = 1}) => {
  switch (kind) {
    case 'flat':
      return <line x1={x - 14 * s} y1={y} x2={x + 14 * s} y2={y} stroke={C.ink} strokeWidth={S} />;
    case 'smile':
      return <path d={`M${x - 16 * s},${y - 4 * s} Q${x},${y + 12 * s} ${x + 16 * s},${y - 4 * s}`} fill="none" stroke={C.ink} strokeWidth={S} />;
    case 'frown':
      return <path d={`M${x - 16 * s},${y + 6 * s} Q${x},${y - 8 * s} ${x + 16 * s},${y + 6 * s}`} fill="none" stroke={C.ink} strokeWidth={S} />;
    case 'wavy':
      return (
        <path
          d={`M${x - 22 * s},${y} q${5.5 * s},${-8 * s} ${11 * s},0 t${11 * s},0 t${11 * s},0 t${11 * s},0`}
          fill="none"
          stroke={C.ink}
          strokeWidth={S}
        />
      );
    case 'o':
      return <ellipse cx={x} cy={y} rx={9 * s} ry={13 * s} fill="#e04a4a" stroke={C.ink} strokeWidth={S} />;
    case 'grin':
      return (
        <g stroke={C.ink} strokeWidth={S}>
          <path d={`M${x - 40 * s},${y - 14 * s} Q${x},${y - 4 * s} ${x + 40 * s},${y - 14 * s} Q${x + 34 * s},${y + 40 * s} ${x},${y + 42 * s} Q${x - 34 * s},${y + 40 * s} ${x - 40 * s},${y - 14 * s} Z`} fill="white" />
          <path d={`M${x - 36 * s},${y + 10 * s} L${x + 36 * s},${y + 10 * s}`} strokeWidth={S - 2} />
          {[-24, -8, 8, 24].map((dx) => (
            <line key={dx} x1={x + dx * s} y1={y - 10 * s} x2={x + dx * s} y2={y + 38 * s} strokeWidth={S - 2} />
          ))}
        </g>
      );
    default:
      return null;
  }
};

/**
 * The skinny archer: a tall pink sausage with no neck. Feet centre at origin.
 * Arms and props are passed as children in the same local space so each shot
 * can pose them freely.
 */
export const Skinny: React.FC<{
  view?: 'side' | 'front';
  face?: Face;
  legs?: Legs;
  height?: number;
  width?: number;
  lean?: number;
  squash?: number;
  behind?: React.ReactNode;
  children?: React.ReactNode;
  color?: string;
  dashed?: boolean;
}> = ({
  view = 'side',
  face = {},
  legs = 'stand',
  height = 440,
  width = 120,
  lean = 0,
  squash = 1,
  behind,
  children,
  color = C.skin,
  dashed = false,
}) => {
  const {eyes = 'open', look = [0.4, 0], lid = 0.35, lidAngle = 0, mouth = 'flat'} = face;
  const hw = width / 2;
  const legH = legs === 'squat' ? 40 : legs === 'kneel' ? 30 : 70;
  const top = -height;
  const bodyBottom = -legH + 10;
  const body =
    `M${-hw + 2},${bodyBottom} ` +
    `C${-hw - 6},${bodyBottom - 120} ${-hw * 0.8},${top + 120} ${-hw * 0.82},${top + 22} ` +
    `Q${-hw * 0.82},${top} ${-hw * 0.82 + 22},${top + 2} L${hw * 0.8 - 20},${top - 2} Q${hw * 0.8},${top} ${hw * 0.8},${top + 22} ` +
    `C${hw * 0.82},${top + 120} ${hw + 8},${bodyBottom - 120} ${hw},${bodyBottom} ` +
    `Q0,${bodyBottom + 26} ${-hw + 4},${bodyBottom} Z`;

  const legPaths: string[] =
    legs === 'squat'
      ? [`M-20,${-legH} q-40,10 -48,${legH - 6} l-14,0`, `M20,${-legH} q40,10 48,${legH - 6} l14,0`]
      : legs === 'wide'
        ? [`M-18,${-legH} L-46,-4 l-16,0`, `M18,${-legH} L48,-4 l16,0`]
        : legs === 'kneel'
          ? [`M-16,${-legH} q-10,30 -60,30 l-30,0`, `M18,${-legH} q30,-40 60,-10 l4,30`]
          : [`M-18,${-legH} L-20,-4 l-14,0`, `M18,${-legH} L20,-4 l14,0`];

  const eyeY = top + 70;
  const ex = view === 'front' ? [-width * 0.2, width * 0.2] : [width * 0.06, width * 0.4];
  const er = width * 0.23;
  const mouthX = view === 'front' ? 0 : 34;
  const dash = dashed ? {strokeDasharray: '16 14', fill: 'none'} : {};

  return (
    <g transform={`rotate(${lean}) scale(1 ${squash})`}>
      {behind}
      {!dashed && legPaths.map((d, i) => <Limb key={i} d={d} w={22} color={color} />)}
      <path d={body} fill={dashed ? 'none' : color} stroke={C.ink} strokeWidth={S} {...dash} />
      {!dashed && eyes !== 'none' && (
        <g>
          {eyes === 'squint' ? (
            <>
              <SquintEye x={ex[0]} y={eyeY} s={er * 0.8} flip />
              <SquintEye x={ex[1]} y={eyeY} s={er * 0.8} />
            </>
          ) : eyes === 'happy' ? (
            <>
              <path d={`M${ex[0] - er},${eyeY + 6} Q${ex[0]},${eyeY - er} ${ex[0] + er},${eyeY + 6}`} fill="none" stroke={C.ink} strokeWidth={S} />
              <path d={`M${ex[1] - er},${eyeY + 6} Q${ex[1]},${eyeY - er} ${ex[1] + er},${eyeY + 6}`} fill="none" stroke={C.ink} strokeWidth={S} />
            </>
          ) : (
            <>
              <Eye x={ex[0]} y={eyeY} r={eyes === 'big' ? er * 1.25 : er} look={look} lid={lid} lidAngle={-lidAngle} lidColor={color} />
              <Eye x={ex[1]} y={eyeY} r={eyes === 'big' ? er * 1.2 : er * 0.95} look={look} lid={lid} lidAngle={lidAngle} lidColor={color} />
            </>
          )}
          <Mouth kind={mouth} x={mouthX} y={eyeY + er * 2.2} s={width / 120} />
        </g>
      )}
      {children}
    </g>
  );
};
