// Sound cue sheet. Times are absolute seconds, derived from each shot's start
// plus the local frame where the action lands (see shots.ts / scenes/*).
export type Cue = {file: string; at: number; vol?: number};

const f30 = (shotStart: number, frame: number) => shotStart + frame / 30;

const RAIN_T = [16, 22, 26, 30, 34, 38, 42, 46, 50];

export const SFX: Cue[] = [
  // knight + arrows
  {file: 'swing', at: 0.0, vol: 0.5},
  ...[26, 36, 47, 51].map((a) => ({file: 'arrow', at: f30(0, a), vol: 0.6})),
  ...[30, 40, 51, 55].map((b) => ({file: 'tink', at: f30(0, b), vol: 0.55})),
  {file: 'pop', at: f30(0, 42), vol: 0.7},
  // skinny plinks the knight
  {file: 'creak', at: 2.2, vol: 0.35},
  ...[2, 11, 20].map((s) => ({file: 'twang', at: f30(2.2, 16 + s), vol: 0.6})),
  ...[2, 11, 20].map((s) => ({file: 'tink', at: f30(2.2, 19 + s), vol: 0.4})),
  // punch-in + low angle
  {file: 'whip', at: 3.72, vol: 0.4},
  {file: 'boom', at: 4.27, vol: 0.7},
  // game logic
  {file: 'swing', at: f30(4.7, 1), vol: 0.7},
  {file: 'hit8', at: f30(4.7, 3), vol: 0.6},
  {file: 'swing', at: f30(4.7, 9), vol: 0.7},
  {file: 'hit8', at: f30(4.7, 11), vol: 0.6},
  {file: 'pixel', at: f30(4.7, 20), vol: 0.6},
  // "historically" + rewind
  {file: 'boom', at: 6.23, vol: 0.6},
  {file: 'scribble', at: f30(6.23, 2), vol: 0.5},
  {file: 'rewind', at: 7.03, vol: 0.45},
  {file: 'glitch', at: 7.75, vol: 0.35},
  {file: 'glitch', at: 8.1, vol: 0.45},
  // can't pull the bow
  {file: 'creak', at: f30(8.4, 14), vol: 0.6},
  {file: 'pop', at: f30(8.4, 25), vol: 0.5},
  {file: 'strain', at: 9.7, vol: 0.45},
  {file: 'creak', at: 10.45, vol: 0.4},
  {file: 'sparkle', at: f30(10.45, 17), vol: 0.45},
  {file: 'pop', at: f30(10.45, 30), vol: 0.7},
  {file: 'poof', at: f30(10.45, 34), vol: 0.5},
  {file: 'splat', at: 12.13, vol: 0.7},
  // spotlight flexing
  {file: 'clunk', at: 12.43, vol: 0.7},
  ...[13, 27, 40].map((f) => ({file: 'slam', at: f30(12.43, f), vol: 0.45})),
  {file: 'sparkle', at: 14.3, vol: 0.4},
  // real archer + caddy
  ...[0, 15, 30, 45].flatMap((c) => [
    {file: 'creak', at: f30(15.33, c + 7), vol: 0.2},
    {file: 'twang', at: f30(15.33, c + 11), vol: 0.55},
    {file: 'arrow', at: f30(15.33, c + 11), vol: 0.4},
  ]),
  {file: 'pop', at: f30(15.33, 64), vol: 0.4},
  {file: 'pop', at: f30(15.33, 70), vol: 0.4},
  {file: 'creak', at: f30(15.33, 74), vol: 0.4},
  {file: 'twang', at: f30(15.33, 84), vol: 0.7},
  // whip pan, battlefield, iris
  {file: 'whip', at: 18.38, vol: 0.7},
  {file: 'thud', at: f30(18.4, 7), vol: 0.6},
  ...RAIN_T.map((t) => ({file: 'rain', at: f30(18.4, t + 7) - 0.17, vol: 0.45})),
  {file: 'iris', at: f30(18.4, 58), vol: 0.5},
  // you didn't win
  ...[3, 9, 17].map((f) => ({file: 'slam', at: f30(21, f), vol: 0.6})),
  // bow drops, axe
  {file: 'whoosh', at: f30(22, 12), vol: 0.5},
  {file: 'bowdrop', at: f30(22, 18), vol: 0.7},
  {file: 'pop', at: f30(22, 30), vol: 0.4},
  {file: 'boom', at: 23.43, vol: 0.5},
  {file: 'axedraw', at: 23.45, vol: 0.5},
  {file: 'shing', at: 24.2, vol: 0.55},
  {file: 'sparkle', at: f30(24.17, 6), vol: 0.3},
  {file: 'impact', at: 25.23, vol: 0.9},
];
