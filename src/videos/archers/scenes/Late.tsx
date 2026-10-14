import React from 'react';
import {random} from 'remotion';
import {Buff, BuffArm, Fist} from '../../../characters/Buff';
import {Skinny} from '../../../characters/Skinny';
import {EASE, shake, step, track, useT} from '../../../lib/anim';
import {Letterbox} from '../../../lib/fx';
import {Arrow, Bow, Eye, Limb, Shadow, SkyGround, Sword} from '../../../lib/shapes';
import {Stage} from '../../../lib/Stage';
import {C, H, STROKE as S, W} from '../../../lib/theme';
import {TitleCard} from './Middle';

/* ------------------------------------------------------------------ */
/* 12.43 - 14.30  Pink spotlight, silhouette flexing through poses.   */
/* ------------------------------------------------------------------ */
type Pose = {front: string; back: string; ff: [number, number]; bf: [number, number]; legs: 'stand' | 'wide' | 'step'; lean: number};
const POSES: Pose[] = [
  {front: 'M90,-520 L190,-400 L250,-430', back: 'M-80,-520 L-150,-380 L-130,-260', ff: [260, -430], bf: [-130, -250], legs: 'stand', lean: 0},
  {front: 'M90,-510 L220,-420 L170,-330', back: 'M-80,-510 L-200,-420 L-260,-380', ff: [160, -320], bf: [-270, -380], legs: 'wide', lean: -12},
  {front: 'M90,-520 L230,-470 L280,-460', back: 'M-80,-520 L-140,-390 L-110,-300', ff: [290, -460], bf: [-110, -290], legs: 'stand', lean: 6},
  {front: 'M90,-520 L200,-640 L120,-760', back: 'M-80,-520 L-150,-400 L-90,-330', ff: [110, -770], bf: [-90, -320], legs: 'step', lean: -4},
];

export const SpotlightShot: React.FC = () => {
  const f = useT();
  const idx = step(f, [
    [0, 0],
    [13, 1],
    [27, 2],
    [40, 3],
  ]);
  const p = POSES[idx];
  const since = f - [0, 13, 27, 40][idx];
  const pop = track(since, [[0, 1.06], [4, 1]], EASE.out);
  const ink = '#050505';
  return (
    <Stage bg={C.black} boil={2.5}>
      <path d="M430,-40 L650,-40 L1180,1120 L-100,1120 Z" fill={C.pink} />
      <ellipse cx={540} cy={1110} rx={640} ry={110} fill={C.pink} />
      <ellipse cx={540} cy={1100} rx={230} ry={34} fill={C.pinkFloor} />
      <g transform={`translate(540 1100) scale(${0.95 * pop})`}>
        <Buff fill={ink} eye="none" legs={p.legs} lean={p.lean}>
          <BuffArm d={p.back} fill={ink} w={84} />
          <BuffArm d={p.front} fill={ink} w={84} />
          <circle cx={-90} cy={-510} r={62} fill={ink} />
          <circle cx={95} cy={-510} r={62} fill={ink} />
          <Fist x={p.ff[0]} y={p.ff[1]} fill={ink} />
          <Fist x={p.bf[0]} y={p.bf[1]} fill={ink} />
        </Buff>
      </g>
      {/* leftover paint from the splat flying off */}
      {f < 10 &&
        Array.from({length: 9}, (_, i) => {
          const a = random(`st${i}`) * Math.PI * 2;
          const d = 300 + f * 90;
          return (
            <ellipse
              key={i}
              cx={540 + Math.cos(a) * d}
              cy={900 + Math.sin(a) * d}
              rx={18}
              ry={90}
              fill="white"
              transform={`rotate(${(a * 180) / Math.PI + 90} ${540 + Math.cos(a) * d} ${900 + Math.sin(a) * d})`}
            />
          );
        })}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 14.30 - 15.33  Smug close-up, finger on chin, pink rim light.      */
/* ------------------------------------------------------------------ */
export const ChinShot: React.FC = () => {
  const f = useT();
  const bob = track(f, [[0, 10], [8, 0]], EASE.out);
  const lid = track(f, [[0, 0.55], [12, 0.42], [24, 0.5]]);
  const rim = '#ff8fe0';
  const head = 'M300,1500 L290,560 Q290,470 380,470 L720,450 Q800,450 800,540 L820,880 Q1100,860 1200,1000 L1200,2100 L300,2100 Z';
  return (
    <Stage bg={C.purple} cam={{y: bob, zoom: track(f, [[0, 1], [31, 1.03]])}}>
      <path d={head} fill="none" stroke={rim} strokeWidth={30} />
      <path d={head} fill={C.buff} stroke={C.ink} strokeWidth={S} />
      <path d="M400,580 L410,760" stroke={C.ink} strokeWidth={5} />
      <Eye x={560} y={760} r={105} rx={100} look={[0.15, 0.2]} lidColor={C.buff} pupil={0.13} />
      <Eye x={740} y={800} r={70} rx={80} look={[0.3, 0.4]} lid={lid} lidAngle={-8} lidColor={C.buff} pupil={0.16} />
      <path d="M430,980 Q500,1050 600,990" fill="none" stroke={C.ink} strokeWidth={S} />
      <path d="M430,1000 Q420,1150 520,1180 Q600,1190 640,1100 Q690,1050 760,1070" fill="none" stroke={C.ink} strokeWidth={S} />
      {/* hand with the thinking finger */}
      <path d="M-100,2100 Q100,1600 300,1520 Q380,1490 420,1440 L440,1080 Q470,1020 520,1050 L560,1440 Q700,1420 760,1540 Q760,1600 680,1620 Q760,1700 640,1760 L520,2100 Z" fill={C.buffLight} stroke={C.ink} strokeWidth={S} />
      <path d="M560,1440 Q600,1520 560,1560 M640,1620 Q560,1600 520,1650" fill="none" stroke={C.ink} strokeWidth={5} />
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 15.33 - 18.40  The real archer, with the skinny guy as arrow caddy. */
/* ------------------------------------------------------------------ */
const BX = 720;
const BY = 1240;
const BS = 0.95;
const toBuff = (x: number, y: number): [number, number] => [(x - BX) / BS, (y - BY) / BS];

export const BuffShootShot: React.FC = () => {
  const f = useT();
  const grip: [number, number] = [330, -470];
  const bowLen = 300;
  const bend = 70;
  const nockX = (d: number) => grip[0] - d * bowLen * 0.75 - bend * (1 + d * 0.6) * 0.3;
  const caddyHand = toBuff(410, 860);
  const cycles = [0, 15, 30, 45];
  let draw = 0;
  let hand: [number, number] = [nockX(0), grip[1]];
  let carrying = false;
  let flying: number | null = null;
  let caddyHasArrow = true;
  for (const c of cycles) {
    const t = f - c;
    if (t >= 0 && t < 15) {
      if (t < 4) {
        hand = [track(t, [[0, nockX(0)], [3, caddyHand[0]]]), track(t, [[0, grip[1]], [3, caddyHand[1]]])];
        carrying = t >= 3;
        caddyHasArrow = t < 3;
      } else if (t < 7) {
        hand = [track(t, [[4, caddyHand[0]], [7, nockX(0)]]), track(t, [[4, caddyHand[1]], [7, grip[1]]])];
        carrying = true;
        caddyHasArrow = false;
      } else if (t < 11) {
        draw = track(t, [[7, 0], [11, 1]]);
        hand = [nockX(draw), grip[1]];
        carrying = true;
        caddyHasArrow = false;
      } else {
        draw = track(t, [[11, 1], [12, 0]], EASE.out);
        hand = [nockX(0) - 20, grip[1]];
        flying = t - 11;
        caddyHasArrow = t > 13;
      }
    }
  }
  const limp = f >= 60;
  const pat = f >= 64 && f < 74;
  const loaded = f >= 74 && f < 84;
  const launched = f >= 84;
  if (pat) hand = toBuff(380, 830 + (Math.floor(f / 3) % 2) * 14);
  if (loaded) {
    draw = track(f, [[74, 0], [80, 1]]);
    hand = [nockX(draw), grip[1]];
  }
  if (launched) {
    draw = track(f, [[84, 1], [85, 0]], EASE.out);
    hand = [nockX(0) - 20, grip[1]];
  }
  const elbow: [number, number] = [hand[0] < 0 ? -140 : (hand[0] + 40) / 2 - 60, hand[1] < -420 ? -440 : -330];
  const sh = launched ? shake(f, 84, 6, 10, 'bl') : {x: 0, y: 0};
  const arrowGlobal = (t: number) => ({x: BX + (grip[0] + 100) * BS + t * 220, y: BY + grip[1] * BS});
  return (
    <Stage bg={C.sky} cam={{zoom: 1.02, x: sh.x + track(f, [[70, 0], [77, -240]], EASE.inOut)}}>
      <SkyGround horizon={1180} />
      <Shadow x={BX + 30} y={BY + 8} rx={190} />
      <Shadow x={340} y={1248} rx={80} />
      {/* caddy */}
      {!loaded && !launched && (
        <g transform={`translate(340 1245) scale(0.62 ${limp ? 0.55 : 0.62})`}>
          <Skinny
            view="front"
            legs={limp ? 'stand' : 'wide'}
            face={limp ? {eyes: 'open', lid: 0.6, look: [0, 0.4], mouth: 'flat'} : {eyes: 'big', lid: 0, look: [0.5, -0.4], mouth: 'none'}}
            lean={limp ? 6 : -4}
          >
            {limp ? (
              <>
                <Limb d="M-55,-330 L-80,-200" w={20} color={C.skin} />
                <Limb d="M55,-330 L80,-200" w={20} color={C.skin} />
              </>
            ) : (
              <>
                <Limb d="M-55,-330 L-170,-360 L-210,-330" w={20} color={C.skin} />
                <Limb d="M55,-330 L100,-520 L110,-620" w={20} color={C.skin} />
                {caddyHasArrow && (
                  <g transform="translate(110 -660) rotate(-70)">
                    <Arrow len={260} />
                  </g>
                )}
              </>
            )}
          </Skinny>
        </g>
      )}
      <g transform={`translate(${BX} ${BY}) scale(${BS})`}>
        <Buff eye={launched ? 'wide' : 'slit'}>
          <g transform={`translate(${grip[0]} ${grip[1]})`}>
            <Bow len={bowLen} bend={bend} draw={draw} strokeW={6} />
          </g>
          {carrying && !pat && (
            <g transform={`translate(${hand[0] + 120} ${hand[1]})`}>
              <Arrow len={260} />
            </g>
          )}
          <BuffArm d={`M-40,-530 L${elbow[0]},${elbow[1]} L${hand[0]},${hand[1]}`} />
          <Fist x={hand[0]} y={hand[1]} r={34} />
          <BuffArm d={`M90,-520 L${grip[0] - 20},${grip[1]}`} />
          <Fist x={grip[0]} y={grip[1]} r={38} />
          {loaded && (
            <g transform={`translate(${hand[0] - 20} ${hand[1]}) rotate(90) scale(0.5)`}>
              <Skinny view="front" face={{eyes: 'big', lid: 0, mouth: 'o'}} />
            </g>
          )}
        </Buff>
      </g>
      {flying !== null && flying < 5 && (
        <g transform={`translate(${arrowGlobal(flying).x} ${arrowGlobal(flying).y})`}>
          <line x1={-300} y1={0} x2={-60} y2={0} stroke="white" strokeWidth={6} opacity={0.7} />
          <Arrow len={240} />
        </g>
      )}
      {launched && f < 90 && (
        <g transform={`translate(${BX + (nockX(0) - 20) * BS + (f - 84) * 190} ${arrowGlobal(0).y}) rotate(90) scale(0.48)`}>
          <Skinny view="front" face={{eyes: 'big', lid: 0, mouth: 'o'}} />
        </g>
      )}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 18.40 - 21.00  Whip pan to a top-down battlefield, arrows raining. */
/* ------------------------------------------------------------------ */
const RAIN = [
  {t: 16, x: 560, y: 1500},
  {t: 22, x: 280, y: 900},
  {t: 26, x: 760, y: 700},
  {t: 30, x: 420, y: 520},
  {t: 34, x: 640, y: 380},
  {t: 38, x: 300, y: 250},
  {t: 42, x: 720, y: 120},
  {t: 46, x: 470, y: -40},
  {t: 50, x: 330, y: -160},
];

const Edge: React.FC<{side: 'l' | 'r'; scroll: number}> = ({side, scroll}) => {
  const pts: string[] = [];
  for (let i = -2; i < 30; i++) {
    const y = i * 120 - (scroll % 120);
    const seg = Math.floor(scroll / 120) + i;
    const x = (side === 'l' ? 150 : 930) + (random(`e${side}${seg}`) - 0.5) * 70;
    pts.push(`${x},${y}`);
  }
  const outer = side === 'l' ? '-200' : String(W + 200);
  return (
    <g>
      <path d={`M${outer},-300 L${pts.join(' L')} L${outer},${H + 400} Z`} fill={C.sandTopEdge} />
      <path d={`M${pts.join(' L')}`} fill="none" stroke={C.ink} strokeWidth={5} />
    </g>
  );
};

export const TopDownShot: React.FC = () => {
  const f = useT();
  if (f < 7) {
    return (
      <Stage bg="#fbefcb" boil={0}>
        {Array.from({length: 12}, (_, i) => (
          <rect key={i} x={((i * 260 - f * 380) % 1600) - 300} y={-100} width={120 + (i % 3) * 60} height={H + 200} fill="#f1d9a6" opacity={0.6} />
        ))}
        <ellipse cx={1100 - f * 120} cy={960} rx={140} ry={40} fill={C.skin} opacity={0.8} />
      </Stage>
    );
  }
  const t = f - 7;
  const scroll = t * 7;
  const up = t > 8 ? (t - 8) * 9 : 0;
  const sx = 540;
  const sy = 1180 - up + scroll;
  const iris = track(f, [[58, 1500], [68, 120], [72, 120], [76, 0]], EASE.inOut);
  const lastHit = RAIN.filter((r) => t >= r.t).pop();
  const sh = lastHit ? shake(t, lastHit.t, 4, 6, `r${lastHit.t}`) : {x: 0, y: 0};
  const irisX = sx;
  const irisY = sy - scroll;
  return (
    <Stage bg={C.sandTop} cam={{x: sh.x, y: sh.y}}>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={C.sandTop} />
      {Array.from({length: 40}, (_, i) => (
        <circle key={i} cx={random(`ts${i}`) * W} cy={((random(`tt${i}`) * H + scroll) % H)} r={3} fill={C.sandSpeck} opacity={0.5} />
      ))}
      <Edge side="l" scroll={-scroll} />
      <Edge side="r" scroll={-scroll} />
      <g transform={`translate(0 ${scroll})`}>
        {RAIN.map((r, i) => {
          if (t < r.t - 3) return null;
          const k = track(t, [[r.t - 3, 2.2], [r.t, 1]], EASE.in);
          const o = track(t, [[r.t - 3, 0], [r.t - 1, 1]]);
          return (
            <g key={i} transform={`translate(${r.x} ${r.y}) scale(${k})`} opacity={o}>
              <ellipse cx={6} cy={4} rx={14} ry={6} fill={C.shadow} />
              <g transform="translate(0 -120) rotate(90)">
                <Arrow len={240} />
              </g>
            </g>
          );
        })}
        {/* the soldier, flattened on landing then running up the path */}
        <g transform={`translate(${sx} ${sy - scroll})`}>
          {t < 7 ? (
            <g>
              <ellipse cx={0} cy={0} rx={120} ry={34} fill={C.skin} stroke={C.ink} strokeWidth={S} />
              <circle cx={-60} cy={-8} r={12} fill="white" stroke={C.ink} strokeWidth={4} />
              <g transform="translate(60 -10) rotate(10) scale(0.35)">
                <Sword len={200} />
              </g>
            </g>
          ) : (
            <g transform={`rotate(${Math.sin(t * 1.2) * 4})`}>
              <rect x={-60} y={-40} width={120} height={95} rx={18} fill={C.shadow} transform="translate(12 12)" />
              <rect x={-60} y={-40} width={120} height={95} rx={18} fill={C.skin} stroke={C.ink} strokeWidth={S} />
              <circle cx={-14} cy={-38} r={18} fill="white" stroke={C.ink} strokeWidth={4} />
              <circle cx={18} cy={-38} r={18} fill="white" stroke={C.ink} strokeWidth={4} />
              <g transform="translate(75 10) scale(0.35)">
                <Sword len={240} />
              </g>
            </g>
          )}
        </g>
      </g>
      {f >= 58 && (
        <path
          d={`M-300,-300 H${W + 300} V${H + 300} H-300 Z M${irisX - iris},${irisY} a${iris},${iris} 0 1,0 ${iris * 2},0 a${iris},${iris} 0 1,0 ${-iris * 2},0 Z`}
          fill={C.black}
          fillRule="evenodd"
        />
      )}
    </Stage>
  );
};

/* 21.00 - 22.00 */
export const YouDidntWinShot: React.FC = () => (
  <TitleCard
    size={150}
    y={560}
    lines={[
      {text: 'YOU', at: 3},
      {text: "DIDN'T", at: 9},
      {text: 'WIN', at: 17},
    ]}
  />
);

/* ------------------------------------------------------------------ */
/* 22.00 - 23.43  Kneeling on his sword; a bow thuds down in front.   */
/* ------------------------------------------------------------------ */
export const KneelShot: React.FC = () => {
  const f = useT();
  const drop = track(f, [[13, -900], [18, 0]], EASE.in);
  const moving = f >= 13 && f < 19;
  const sh = shake(f, 18, 7, 14, 'kd');
  const lookUp = f >= 30;
  const bowPath = 'M-80,1380 Q430,2000 1020,1560';
  return (
    <Stage bg={C.sky} cam={{x: sh.x, y: sh.y, zoom: track(f, [[0, 1], [43, 1.05]])}}>
      <SkyGround horizon={1060} tilt={-5} />
      <Shadow x={520} y={1215} rx={170} />
      <g transform="translate(330 1220)">
        <Sword len={190} scale={-0.75} />
      </g>
      <g transform="translate(520 1220) scale(1.05)">
        <Skinny
          view="front"
          legs="kneel"
          height={380}
          face={lookUp ? {eyes: 'big', lid: 0, look: [0, -0.7], mouth: 'flat'} : {eyes: 'open', lid: 0.3, look: [0.6, 0], mouth: 'o'}}
        >
          <Limb d="M-55,-260 L-130,-200 L-180,-130" w={20} color={C.skin} />
          <Limb d="M55,-260 L90,-160 L80,-80" w={20} color={C.skin} />
        </Skinny>
      </g>
      {f >= 13 && (
        <g transform={`translate(0 ${drop})`}>
          {moving && <path d={bowPath} fill="none" stroke="#ff3a5a" strokeWidth={28} opacity={0.5} transform="translate(-10 -40)" />}
          {moving && <path d={bowPath} fill="none" stroke="#3a7bff" strokeWidth={28} opacity={0.5} transform="translate(10 -80)" />}
          <path d={bowPath} fill="none" stroke={C.ink} strokeWidth={34} />
          <path d={bowPath} fill="none" stroke="#8a5a3a" strokeWidth={22} />
          <path d="M-60,1620 L1000,1580" stroke={C.ink} strokeWidth={4} opacity={0.0} />
        </g>
      )}
      {f >= 18 && f < 26 && (
        <ellipse cx={500} cy={1700} rx={300 + (f - 18) * 60} ry={60 + (f - 18) * 10} fill="none" stroke="#c9a989" strokeWidth={10} opacity={1 - (f - 18) / 8} />
      )}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 23.43 - 24.17  From behind: he hoists a massive axe.               */
/* ------------------------------------------------------------------ */
export const AxeBackShot: React.FC = () => {
  const f = useT();
  const raise = track(f, [[0, 70], [7, 0]], EASE.back);
  return (
    <Stage bg={C.sky} cam={{zoom: track(f, [[0, 1.0], [22, 1.06]])}}>
      <SkyGround horizon={1020} />
      <ellipse cx={420} cy={1780} rx={330} ry={70} fill={C.shadow} />
      {/* legs */}
      <Limb d="M450,1480 L360,1600 L380,1740" w={90} color={C.buff} />
      <Limb d="M640,1480 L720,1600 L700,1740" w={90} color={C.buff} />
      {/* lowered arm */}
      <Limb d="M310,1000 L240,1250 L270,1430" w={110} color={C.buff} />
      <path d="M220,1420 q-30,40 -10,90 l20,-20 l10,40 l20,-34 l20,30 l14,-40 l16,10 q10,-60 -40,-80 Z" fill={C.buff} stroke={C.ink} strokeWidth={S} />
      {/* torso */}
      <path d="M330,1480 C240,1300 200,1040 330,950 Q420,890 470,880 L480,780 L620,780 L630,880 Q700,890 790,950 C900,1040 860,1300 770,1480 Z" fill={C.buff} stroke={C.ink} strokeWidth={S} />
      <path d="M550,900 L550,1300 M420,980 Q480,1040 500,1120 M690,980 Q620,1040 600,1120" fill="none" stroke={C.ink} strokeWidth={4} opacity={0.7} />
      <rect x={320} y={1450} width={460} height={42} fill="#b5332e" stroke={C.ink} strokeWidth={S} />
      <ellipse cx={490} cy={1540} rx={80} ry={64} fill={C.buff} stroke={C.ink} strokeWidth={S} />
      <ellipse cx={610} cy={1540} rx={80} ry={64} fill={C.buff} stroke={C.ink} strokeWidth={S} />
      {/* raised arm + axe, swung up around the shoulder */}
      <g transform={`rotate(${raise} 770 980)`}>
        <Limb d="M770,980 L880,700 L790,520" w={110} color={C.buff} />
        <line x1={300} y1={470} x2={980} y2={430} stroke={C.ink} strokeWidth={46} />
        <line x1={300} y1={470} x2={980} y2={430} stroke="#8a5a3a" strokeWidth={34} />
        <path d="M280,330 Q420,300 480,330 L470,620 Q380,600 290,640 Q230,500 280,330 Z" fill="#c9cbcc" stroke={C.ink} strokeWidth={S} />
        <path d="M300,380 Q360,370 420,400 M310,560 Q380,540 440,560" fill="none" stroke="white" strokeWidth={10} />
        <path d="M740,520 q60,-50 110,10 q20,60 -40,90 q-60,10 -70,-100 Z" fill={C.buff} stroke={C.ink} strokeWidth={S} />
      </g>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 24.17 - 25.23  Letterboxed blade, a gleam runs up the edge.        */
/* ------------------------------------------------------------------ */
export const AxeGleamShot: React.FC = () => {
  const f = useT();
  const g = track(f, [[6, 0], [18, 1]]);
  const gx = 520 + g * 170;
  const gy = 1300 - g * 760;
  const twinkle = f >= 6 && f < 20 ? 1 - Math.abs(g - 0.5) * 1.4 : 0;
  return (
    <Stage bg={C.sky} cam={{zoom: track(f, [[0, 1], [32, 1.08]])}}>
      <rect x={-200} y={-200} width={1500} height={2400} fill={C.sky} />
      <path d="M380,1450 L460,1250 Q470,1000 560,820 Q640,640 740,470 Q760,700 720,1000 Q690,1250 600,1450 Z" fill={C.bladeShade} stroke={C.ink} strokeWidth={S + 2} />
      <path d="M560,1300 Q590,1000 650,800 Q700,640 735,520 Q720,800 690,1050 Q660,1250 610,1350 Z" fill="#e6e7e8" />
      <path d="M520,1180 Q560,1000 610,880" fill="none" stroke="white" strokeWidth={22} opacity={0.8} />
      <path d="M470,1450 L500,1330 L560,1330 L540,1450 Z" fill={C.wood} stroke={C.ink} strokeWidth={S} />
      {twinkle > 0 && (
        <g transform={`translate(${gx} ${gy}) scale(${twinkle}) rotate(${f * 6})`}>
          <path d="M0,-90 L14,-14 L90,0 L14,14 L0,90 L-14,14 L-90,0 L-14,-14 Z" fill="white" />
        </g>
      )}
      <Letterbox amount={track(f, [[0, 380], [6, 500]], EASE.out)} />
    </Stage>
  );
};

/* 25.23 - 25.85  Black, one white splash of ink, gone. */
export const DeathShot: React.FC = () => {
  const f = useT();
  const r = track(f, [[0, 40], [3, 170], [12, 60], [17, 0]], EASE.out);
  const sh = shake(f, 0, 8, 18, 'death');
  return (
    <Stage bg="#000" cam={{x: sh.x, y: sh.y}} boil={5}>
      <g transform={`translate(540 860) scale(${r / 150}) skewX(${(random(`fl${Math.floor(f / 2)}`) - 0.5) * 14})`}>
        <path
          d="M0,-320 C40,-240 150,-120 120,40 C100,170 -30,230 -100,140 C-160,60 -80,-40 -70,-140 C-60,-200 -20,-250 0,-320 Z"
          fill="white"
        />
        <path d="M70,-260 q20,30 6,60 q-24,-20 -6,-60 Z M-110,-120 q10,26 -4,46 q-14,-24 4,-46 Z" fill="white" />
        <ellipse cx={-10} cy={20} rx={26} ry={44} fill="#000" />
        <ellipse cx={40} cy={-90} rx={14} ry={26} fill="#000" />
        <ellipse cx={-50} cy={120} rx={12} ry={18} fill="#000" />
      </g>
    </Stage>
  );
};
