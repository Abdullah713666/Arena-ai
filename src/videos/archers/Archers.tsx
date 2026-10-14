import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Captions} from '../../lib/Caption';
import {useFonts} from '../../lib/Fonts';
import {FPS} from '../../lib/theme';
import {SHOTS} from './shots';
import {SFX} from './sfx';
import {WORDS} from './words';

export const ARCHERS_DURATION = Math.round(25.85 * FPS);

const fr = (s: number) => Math.round(s * FPS);

export const Archers: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {SHOTS.map(({start, end, Comp, name}) => (
        <Sequence key={name} name={name} from={fr(start)} durationInFrames={fr(end) - fr(start)}>
          <Comp />
        </Sequence>
      ))}
      <Captions words={WORDS} />
      {SFX.map((s, i) => (
        <Sequence key={i} name={`sfx ${s.file}`} from={fr(s.at)} layout="none">
          <Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol ?? 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
