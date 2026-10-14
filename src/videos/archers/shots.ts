import type React from 'react';
import {GameShot, HoodFaceShot, KnightShot, LowKnightShot, SkinnyShootShot} from './scenes/Intro';
import {
  AxeBackShot,
  AxeGleamShot,
  BuffShootShot,
  ChinShot,
  DeathShot,
  KneelShot,
  SpotlightShot,
  TopDownShot,
  YouDidntWinShot,
} from './scenes/Late';
import {HistoricallyShot, PrettyBoyShot, RewindShot, SkinnyCloseShot, SplatShot, WideStrainShot} from './scenes/Middle';

export type Shot = {name: string; start: number; end: number; Comp: React.FC};

// Cut points (seconds) match the reference edit.
export const SHOTS: Shot[] = [
  {name: 'knight', start: 0, end: 2.2, Comp: KnightShot},
  {name: 'skinny-shoot', start: 2.2, end: 3.73, Comp: SkinnyShootShot},
  {name: 'hood-face', start: 3.73, end: 4.27, Comp: HoodFaceShot},
  {name: 'low-knight', start: 4.27, end: 4.7, Comp: LowKnightShot},
  {name: 'game', start: 4.7, end: 6.23, Comp: GameShot},
  {name: 'historically', start: 6.23, end: 7.03, Comp: HistoricallyShot},
  {name: 'rewind', start: 7.03, end: 8.4, Comp: RewindShot},
  {name: 'skinny-close', start: 8.4, end: 9.7, Comp: SkinnyCloseShot},
  {name: 'wide-strain', start: 9.7, end: 10.45, Comp: WideStrainShot},
  {name: 'pretty-boy', start: 10.45, end: 12.13, Comp: PrettyBoyShot},
  {name: 'splat', start: 12.13, end: 12.43, Comp: SplatShot},
  {name: 'spotlight', start: 12.43, end: 14.3, Comp: SpotlightShot},
  {name: 'chin', start: 14.3, end: 15.33, Comp: ChinShot},
  {name: 'buff-shoot', start: 15.33, end: 18.4, Comp: BuffShootShot},
  {name: 'top-down', start: 18.4, end: 21.0, Comp: TopDownShot},
  {name: 'you-didnt-win', start: 21.0, end: 22.0, Comp: YouDidntWinShot},
  {name: 'kneel', start: 22.0, end: 23.43, Comp: KneelShot},
  {name: 'axe-back', start: 23.43, end: 24.17, Comp: AxeBackShot},
  {name: 'axe-gleam', start: 24.17, end: 25.23, Comp: AxeGleamShot},
  {name: 'death', start: 25.23, end: 25.85, Comp: DeathShot},
];
