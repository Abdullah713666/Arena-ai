import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Skinny} from '../../../characters/Skinny';
import {EASE, TimeOverride, onTwos, step, track, useT} from '../../../lib/anim';
import {HAND_FONT} from '../../../lib/Fonts';
import {OldFilmOverlay, Splat} from '../../../lib/fx';
import {Bow, Limb, Shadow, SkyGround} from '../../../lib/shapes';
import {Stage} from '../../../lib/Stage';
import {C, H, STROKE as S, W} from '../../../lib/theme';
import {GameShot, HoodFaceShot, SkinnyShootShot} from './Intro';

/** Handwritten title card; each line writes on letter by letter. */
export const TitleCard: React.FC<{lines: {text: string; at: number}[]; size?: number; y?: number; dot?: boolean}> = ({
  lines,
  size = 150,
  y = 760,
  dot = false,
}) => {
  const f = useT();
  return (
    <Stage bg={C.black} boil={2.2}>
      {dot && f < 4 && <circle cx={300} cy={y - 140} r={8} fill="white" />}
      {lines.map((ln, li) => (
        <text
          key={li}
          x={W / 2}
          y={y + li * size * 0.95}
          textAnchor="middle"
          fontFamily={HAND_FONT}
          fontSize={size}
          fill="white"
        >
          {ln.text.split('').map((ch, i) => {
            const shown = f >= ln.at + i * 0.8;
            const r = (random(`t${li}${i}`) - 0.5) * 14;
            const dy = (random(`d${li}${i}`) - 0.5) * 16;
            return (
              <tspan key={i} opacity={shown ? 1 : 0} rotate={r} dy={i === 0 ? 0 : dy - (random(`d${li}${i - 1}`) - 0.5) * 16}>
                {ch}
              </tspan>
            );
          })}
        </text>
      ))}
    </Stage>
  );
};

export const HistoricallyShot: React.FC = () => <TitleCard lines={[{text: 'HISTORICALLY', at: 2}]} size={128} dot />;

/** Plays a shot at a forced frame. */
const At: React.FC<{frame: number; children: React.ReactNode}> = ({frame, children}) => (
  <TimeOverride.Provider value={Math.max(0, Math.floor(frame))}>{children}</TimeOverride.Provider>
);

/** 7.03 - 8.40  Tape rewind: earlier shots play backwards in grey. */
export const RewindShot: React.FC = () => {
  const f = useT();
  const jx = (random(`rx${f}`) - 0.5) * 10;
  let body: React.ReactNode;
  if (f < 12) body = <At frame={44 - f * 2}><GameShot /></At>;
  else if (f < 21) body = <At frame={15 - (f - 12) * 1.6}><HoodFaceShot /></At>;
  else body = <At frame={45 - (f - 21) * 2.3}><SkinnyShootShot /></At>;
  return (
    <AbsoluteFill style={{background: '#111'}}>
      <AbsoluteFill style={{filter: 'grayscale(1) contrast(0.85) brightness(0.92)', transform: `translateX(${jx}px) scale(0.96)`}}>
        {body}
      </AbsoluteFill>
      <OldFilmOverlay f={f} glitch={f > 30 ? 0.8 : 0.3} />
    </AbsoluteFill>
  );
};

/** 8.40 - 9.70  Close-up: he tries to pull the bow. Nope. */
export const SkinnyCloseShot: React.FC = () => {
  const f = useT();
  const strain = f >= 14 && f < 25;
  const after = f >= 25;
  const lean = track(f, [[12, 0], [16, -13]], EASE.back);
  const shiver = strain ? (onTwos(f) % 4 === 0 ? 3 : -3) : 0;
  const face = strain
    ? ({eyes: 'squint', mouth: 'frown'} as const)
    : after
      ? ({eyes: 'big', lid: 0, look: [-0.5, -0.5] as [number, number], mouth: 'smile'} as const)
      : ({eyes: 'open', lid: 0.45, look: [0.5, 0] as [number, number], mouth: 'flat'} as const);
  return (
    <Stage bg={C.sky} cam={{zoom: track(f, [[0, 1], [39, 1.04]]), x: shiver}}>
      <SkyGround horizon={1620} />
      <Shadow x={520} y={1810} rx={230} />
      <g transform="translate(500 1800) scale(3)">
        <Skinny face={face} lean={lean}>
          <g transform={`translate(70 -190) rotate(${-8 + (strain ? -4 : 0)})`}>
            <Bow len={210} bend={34} draw={strain ? 0.12 : 0} strokeW={2.2} />
          </g>
          <Limb d="M-38,-250 Q-30,-180 40,-190" w={8} color={C.skin} outline={2.2} />
          <Limb d="M42,-260 Q86,-230 92,-196" w={8} color={C.skin} outline={2.2} />
          <circle cx={42} cy={-190} r={9} fill={C.skin} stroke={C.ink} strokeWidth={2.2} />
          <circle cx={94} cy={-192} r={9} fill={C.skin} stroke={C.ink} strokeWidth={2.2} />
        </Skinny>
      </g>
    </Stage>
  );
};

/** 9.70 - 10.45  Wide: tiny archer trying to bend the bow over his head. */
export const WideStrainShot: React.FC = () => {
  const f = useT();
  const jit = onTwos(f) % 4 === 0 ? 4 : -4;
  const sq = 1 + (onTwos(f, 3) % 6 === 0 ? -0.03 : 0.02);
  return (
    <Stage bg={C.sky} cam={{zoom: 1}}>
      <SkyGround horizon={1150} />
      <Shadow x={540} y={1250} rx={110} />
      <g transform={`translate(${540 + jit} 1250) scale(0.62 ${0.62 * sq})`}>
        <Skinny view="front" legs="squat" height={330} face={{eyes: 'big', lid: 0, look: [0, -0.6], mouth: 'none'}}>
          <Limb d="M-50,-260 L-150,-330 L-180,-430" w={22} color={C.skin} />
          <Limb d="M50,-260 L150,-330 L180,-430" w={22} color={C.skin} />
          <g transform="translate(0 -440) rotate(-90)">
            <Bow len={200} bend={40} draw={0.25 + (jit > 0 ? 0.03 : 0)} />
          </g>
        </Skinny>
      </g>
    </Stage>
  );
};

/** 10.45 - 12.13  Front view on the bowstring, grin, "PRETTY BOY" tag. */
export const PrettyBoyShot: React.FC = () => {
  const f = useT();
  const face = step(f, [
    [0, {eyes: 'squint', mouth: 'frown', lid: 0}],
    [9, {eyes: 'open', lid: 0.55, mouth: 'flat', look: [0, 0]}],
    [17, {eyes: 'big', lid: 0, mouth: 'grin', look: [0, 0.1]}],
  ] as [number, Parameters<typeof Skinny>[0]['face']][]);
  const labelT = track(f, [[30, 0], [35, 1]], EASE.back);
  const dashed = f >= 34;
  const handY = -300;
  return (
    <Stage bg={C.sand} cam={{zoom: track(f, [[0, 1.0], [50, 1.05]])}}>
      <rect x={-200} y={-200} width={1500} height={2400} fill={C.sand} />
      {Array.from({length: 30}, (_, i) => (
        <circle key={i} cx={random(`pb${i}`) * W} cy={random(`pc${i}`) * H} r={3} fill={C.sandSpeck} opacity={0.5} />
      ))}
      <g transform="translate(540 1330) scale(1.05)">
        {/* the bow under him, string up to his hands */}
        <path d="M-270,-180 Q0,280 270,-180" fill="none" stroke={C.ink} strokeWidth={7} />
        <path d={`M-270,-180 L-30,${handY} M270,-180 L30,${handY}`} stroke={C.ink} strokeWidth={3} />
        <Skinny view="front" face={face} height={520} width={120} dashed={dashed}>
          {!dashed && (
            <>
              <Limb d={`M-56,-380 Q-110,-330 -36,${handY}`} w={20} color={C.skin} />
              <Limb d={`M56,-380 Q110,-330 36,${handY}`} w={20} color={C.skin} />
            </>
          )}
        </Skinny>
      </g>
      {labelT > 0 && (
        <g transform={`translate(540 560) scale(${labelT})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={HAND_FONT} fontSize={120} fill={C.ink}>
            PRETTY BOY
          </text>
          <path d="M0,30 L0,130 M-20,50 L0,26 L20,50" fill="none" stroke={C.ink} strokeWidth={S} />
        </g>
      )}
    </Stage>
  );
};

/** 12.13 - 12.43  White paint splat swallows the frame. */
export const SplatShot: React.FC = () => {
  const f = useT();
  const r = track(f, [[0, 60], [5, 1500]], EASE.out);
  const slash = track(f, [[4, 0], [9, 1]], EASE.inOut);
  return (
    <AbsoluteFill>
      <At frame={50}>
        <PrettyBoyShot />
      </At>
      <AbsoluteFill>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
          <Splat x={560} y={900} r={r} seed="ws" />
          {slash > 0 && (
            <g transform={`translate(540 960) rotate(-28) scale(${slash} 1)`}>
              <rect x={-800} y={-140} width={1600} height={280} fill={C.pink} />
              <rect x={-800} y={-60} width={1600} height={120} fill={C.black} />
            </g>
          )}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
