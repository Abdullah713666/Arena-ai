import React from 'react';
import {KnightGuard, KnightSide, StuckArrow} from '../../../characters/Knight';
import {Skinny} from '../../../characters/Skinny';
import {onTwos, shake, step, track, useT} from '../../../lib/anim';
import {FlyingArrow, PixelBurst} from '../../../lib/fx';
import {Arrow, Bow, Eye, Limb, Shadow, SkyGround} from '../../../lib/shapes';
import {Stage} from '../../../lib/Stage';
import {C, STROKE as S} from '../../../lib/theme';

const KX = 560;
const KY = 1360;

/** 0.00 - 2.20  Knight in guard pose; arrows thunk into his helmet. */
export const KnightShot: React.FC = () => {
  const f = useT();
  const hits = [
    {a: 26, b: 30, from: [-400, -560], at: {x: -96, y: -560, a: 0}},
    {a: 36, b: 40, from: [-420, -470], at: {x: -100, y: -478, a: 6}},
    {a: 47, b: 51, from: [-160, -1300], at: {x: -26, y: -650, a: 74}},
    {a: 51, b: 55, from: [260, -1300], at: {x: 46, y: -650, a: 112}},
  ];
  const stuck: StuckArrow[] = hits.filter((h) => f >= h.b).map((h) => h.at);
  const sh = hits.reduce(
    (acc, h) => {
      const s = shake(f, h.b, 6, 10, `k${h.b}`);
      return {x: acc.x + s.x, y: acc.y + s.y};
    },
    {x: 0, y: 0},
  );
  const eyes = f >= 42 ? 'alarmed' : f >= 30 ? 'angry' : 'slit';
  const sway = step(onTwos(f, 4), [
    [0, 0],
    [4, 1],
    [8, 0],
    [12, 1],
  ]);
  const armLift = f < 10 ? track(f, [[0, 0], [6, 40], [10, 30]]) : 30 + sway * 6;
  return (
    <Stage bg={C.sky} cam={{zoom: track(f, [[0, 1], [66, 1.05]]), x: sh.x, y: sh.y}}>
      <SkyGround horizon={1175} />
      <Shadow x={KX + 40} y={KY + 6} rx={220} />
      <g transform={`translate(${KX} ${KY}) scale(1.12)`}>
        <KnightGuard eyes={eyes} armLift={armLift} swordAngle={36 + sway * 4} stuck={stuck} look={f > 44 ? -1 : 0} />
        {hits.map((h, i) => (
          <FlyingArrow key={i} f={f} a={h.a} b={h.b} from={h.from as [number, number]} to={[h.at.x, h.at.y]} />
        ))}
      </g>
    </Stage>
  );
};

/** Side-view archer arms: front arm to the grip, back arm to the nock. */
export const AimArms: React.FC<{grip: [number, number]; nock: [number, number]; color?: string; sh?: number}> = ({
  grip,
  nock,
  color = C.skin,
  sh = -300,
}) => (
  <>
    <Limb d={`M30,${sh} L${grip[0]},${grip[1]}`} w={20} color={color} />
    <Limb d={`M10,${sh + 10} Q${nock[0] - 30},${nock[1] + 60} ${nock[0]},${nock[1]}`} w={20} color={color} />
  </>
);

/** 2.20 - 3.73  Skinny archer alone, then plinking a knight who doesn't care. */
export const SkinnyShootShot: React.FC = () => {
  const f = useT();
  if (f < 16) {
    const draw = track(f, [[0, 0.2], [10, 0.9]]);
    return (
      <Stage bg={C.sky} cam={{zoom: 1.0}}>
        <SkyGround horizon={1180} />
        <Shadow x={540} y={1245} rx={110} />
        <g transform="translate(520 1245)">
          <Skinny face={{lid: 0.5, look: [0.6, 0.3], mouth: 'flat'}} lean={-3}>
            <g transform="translate(150 -250) rotate(28)">
              <Bow len={150} draw={draw} />
              <g transform={`translate(${-draw * 110 + 80} 0)`}>
                <Arrow len={210} />
              </g>
            </g>
            <AimArms grip={[150, -250]} nock={[150 - draw * 100, -250 - draw * 50]} />
          </Skinny>
        </g>
      </Stage>
    );
  }
  const g = f - 16;
  const shots = [2, 11, 20];
  const knockAt = (i: number) => shots[i] + 3;
  const stuck: StuckArrow[] = [
    {x: -40, y: -520, a: -12, len: 200},
    {x: 30, y: -584, a: -80, len: 200},
    {x: 0, y: -440, a: 8, len: 200},
  ];
  const fired = shots.filter((s) => g >= s + 3).length;
  const draw = shots.reduce((d, s, i) => (g >= s - 7 && g < s ? track(g, [[s - 7, 0.2], [s - 1, 1]]) : d), fired === 3 ? 0.2 : 0.6);
  const worried = g >= 18;
  const sh = shots.reduce((acc, _s, i) => acc + shake(g, knockAt(i), 5, 5, `ss${i}`).x, 0);
  return (
    <Stage bg={C.sky} cam={{zoom: 1.04, x: sh}}>
      <SkyGround horizon={1180} />
      <Shadow x={390} y={1248} rx={110} />
      <Shadow x={720} y={1248} rx={130} />
      <g transform="translate(720 1245) scale(1.05)">
        <KnightSide eyes="angry" look={-1} stuck={[...stuck.slice(0, 1 + fired)]} />
      </g>
      <g transform="translate(380 1245)">
        <Skinny
          face={{eyes: worried ? 'big' : 'open', lid: worried ? 0 : 0.4, look: worried ? [0.5, -0.3] : [0.8, 0], mouth: worried ? 'wavy' : 'flat'}}
          lean={-2}
        >
          <g transform="translate(150 -300)">
            <Bow len={150} draw={draw} />
          </g>
          <AimArms grip={[150, -300]} nock={[150 - 46 - draw * 112, -300]} />
        </Skinny>
      </g>
      {shots.map((s, i) => (
        <FlyingArrow key={i} f={g} a={s} b={s + 3} from={[560, 945]} to={[650, 720 - i * 22]} len={170} />
      ))}
      {/* tiny "tink" sparks */}
      {shots.map((s, i) =>
        g >= s + 3 && g < s + 7 ? (
          <g key={i} stroke="white" strokeWidth={5}>
            <path d={`M650,${720 - i * 22} l-30,-20 M650,${720 - i * 22} l-34,10 M650,${720 - i * 22} l-14,-34`} />
          </g>
        ) : null,
      )}
    </Stage>
  );
};

/** 3.73 - 4.27  Punch-in: archer staring down the arrow at the camera. */
export const HoodFaceShot: React.FC = () => {
  const f = useT();
  const z = track(f, [[0, 1.12], [16, 1.0]]);
  const blink = f >= 9 && f < 11;
  return (
    <Stage bg={C.sand} cam={{zoom: z}}>
      <rect x={-200} y={-200} width={1500} height={2400} fill={C.sand} />
      <path d="M-200,1250 C20,1140 120,800 200,620 Q300,480 540,470 Q780,480 860,620 C940,800 1040,1140 1280,1250 L1280,2200 L-200,2200 Z" fill="#b59c79" />
      <g transform="translate(540 1000)">
        <path d="M-200,-330 L200,-340 Q215,-200 200,180 Q120,330 0,330 Q-120,330 -200,180 Q-215,-200 -200,-330 Z" fill="#d78f82" stroke={C.ink} strokeWidth={S} />
        <Eye x={-90} y={-120} r={blink ? 4 : 100} rx={78} look={[0.3, 0.1]} lidColor="#d78f82" />
        <Eye x={86} y={-120} r={blink ? 4 : 96} rx={74} look={[-0.2, 0.1]} lidColor="#d78f82" />
        <path d="M-120,40 Q0,30 120,40" fill="none" stroke={C.ink} strokeWidth={S} />
        <path d="M-90,170 l0,40 M90,170 l0,40" stroke={C.ink} strokeWidth={S} />
      </g>
      {/* bowstring + arrowhead aimed at the lens */}
      <line x1={540} y1={300} x2={540} y2={2000} stroke={C.ink} strokeWidth={12} />
      <path d="M540,1060 L600,1240 L540,1420 L480,1240 Z" fill="#c4c6c8" stroke={C.ink} strokeWidth={S} />
      <path d="M540,1180 l10,60 l-10,60 l-10,-60 Z" fill="white" />
    </Stage>
  );
};

/** 4.27 - 4.70  Low angle: the knight towers, arrows sticking out of him. */
export const LowKnightShot: React.FC = () => {
  const f = useT();
  const z = track(f, [[0, 1.0], [13, 1.06]]);
  return (
    <Stage bg={C.sky} cam={{zoom: z, y: 30}}>
      <rect x={-200} y={-200} width={1500} height={2400} fill={C.sky} />
      {/* raised gauntlet behind */}
      <Limb d="M120,1250 L330,600 L420,420" w={150} color={C.steelDark} />
      <path d="M350,470 q-10,-80 30,-110 l20,-60 q16,-14 28,4 l-6,60 l30,-70 q16,-10 26,6 l-14,72 l36,-50 q16,-6 22,10 l-40,90 q10,60 -40,90 Z" fill={C.steel} stroke={C.ink} strokeWidth={S} />
      {/* stuck arrows */}
      <g transform="translate(680 560) rotate(-66)">
        <g transform="translate(-260 0)">
          <Arrow len={500} headless scale={1} />
        </g>
      </g>
      <line x1={0} y1={420} x2={650} y2={600} stroke={C.ink} strokeWidth={6} />
      <line x1={0} y1={700} x2={620} y2={660} stroke={C.ink} strokeWidth={6} />
      {/* body */}
      <path d="M40,2100 C-20,1300 120,860 640,780 C1100,800 1240,1300 1180,2100 Z" fill="#8e9091" stroke={C.ink} strokeWidth={S} />
      <path d="M460,780 Q470,600 640,590 Q820,600 830,800 Z" fill="#8e9091" stroke={C.ink} strokeWidth={S} />
      <path d="M520,690 Q560,670 590,690 Q560,710 520,690 Z M690,690 Q720,670 760,690 Q720,710 690,690 Z" fill="white" stroke={C.ink} strokeWidth={5} />
      <rect x={-100} y={1360} width={1400} height={90} fill="#3a3a3a" stroke={C.ink} strokeWidth={S} />
      <ellipse cx={540} cy={1405} rx={220} ry={120} fill="#8e9091" stroke={C.ink} strokeWidth={S} />
      <path d="M300,1000 l20,80 M800,1100 l-10,70 M200,1600 l14,90 M900,1650 l-6,80 M620,980 l4,60" stroke={C.ink} strokeWidth={5} />
      {/* shield edge */}
      <path d="M980,2100 L940,560 Q1010,520 1080,580 L1120,2100 Z" fill="#8e9091" stroke={C.ink} strokeWidth={S} />
      <path d="M990,2100 L960,600 Q1000,580 1030,600 L1050,2100" fill="none" stroke={C.ink} strokeWidth={4} />
    </Stage>
  );
};

/** 4.70 - 6.23  Video-game logic: two sword hits and the archer pixel-poofs. */
export const GameShot: React.FC = () => {
  const f = useT();
  const hit1 = 3;
  const hit2 = 11;
  const die = 20;
  const hp = f < hit1 ? 1 : f < hit2 ? 0.5 : 0;
  const swing = track(f, [[0, 0], [hit1, 140], [hit1 + 5, 20], [hit2, 140], [hit2 + 5, 0]]);
  const smear = (f >= hit1 - 2 && f <= hit1 + 1) || (f >= hit2 - 2 && f <= hit2 + 1);
  const sh = shake(f, hit1, 6, 12, 'g1');
  const sh2 = shake(f, hit2, 6, 14, 'g2');
  const stuck: StuckArrow[] = [
    {x: -40, y: -520, a: -12, len: 200},
    {x: 30, y: -584, a: -80, len: 200},
    {x: 0, y: -440, a: 8, len: 200},
  ];
  const recoil = f >= hit2 ? -18 : f >= hit1 ? -10 : 0;
  return (
    <Stage bg={C.sky} cam={{zoom: 1.04, x: sh.x + sh2.x, y: sh.y + sh2.y}}>
      <SkyGround horizon={1180} />
      <Shadow x={720} y={1248} rx={130} />
      <g transform="translate(720 1245) scale(1.05)">
        <KnightSide eyes={f > die ? 'squint' : 'angry'} look={-1} stuck={stuck} sword={swing} thumb={f > die + 10} />
      </g>
      {f < die && (
        <>
          <Shadow x={390} y={1248} rx={110} />
          <g transform={`translate(380 1245) rotate(${recoil})`}>
            <Skinny face={{eyes: f >= hit1 ? 'squint' : 'big', lid: 0, mouth: f >= hit1 ? 'o' : 'wavy'}} lean={0}>
              <g transform="translate(150 -300)">
                <Bow len={150} draw={0.3} />
              </g>
              <AimArms grip={[150, -300]} nock={[70, -300]} />
            </Skinny>
          </g>
          {/* health bar */}
          <g transform="translate(290 700)">
            <rect x={0} y={0} width={180} height={34} rx={10} fill="#333" stroke={C.ink} strokeWidth={S} />
            <rect x={4} y={4} width={172 * Math.max(hp, 1)} height={26} rx={8} fill={hp === 1 ? C.hpGreen : C.hpRed} opacity={hp === 0 ? 0.5 : 1} />
          </g>
        </>
      )}
      {smear && (
        <path d="M640,640 Q380,700 380,1060 Q520,820 660,780 Z" fill="#9aa0a6" opacity={0.75} />
      )}
      <PixelBurst f={f} start={die} x={390} y={1020} w={240} h={420} />
    </Stage>
  );
};

