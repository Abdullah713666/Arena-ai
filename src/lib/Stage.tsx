import React, {useId} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {H, W} from './theme';

export type Cam = {x?: number; y?: number; zoom?: number; rot?: number};

/**
 * One shot. Children are SVG in a 1080x1920 space.
 * - cam: pans/zooms around the frame centre.
 * - boil: line-boil strength; the noise seed changes every 3 frames, which
 *   makes every outline wobble like redrawn hand animation.
 */
export const Stage: React.FC<{
  bg?: string;
  cam?: Cam;
  boil?: number;
  style?: React.CSSProperties;
  overlay?: React.ReactNode;
  children: React.ReactNode;
}> = ({bg = '#000', cam = {}, boil = 3.2, style, overlay, children}) => {
  const real = useCurrentFrame();
  const id = useId().replace(/:/g, '');
  const seed = Math.floor(real / 3) % 97;
  const {x = 0, y = 0, zoom = 1, rot = 0} = cam;
  const cx = W / 2;
  const cy = H / 2;
  return (
    <AbsoluteFill style={{backgroundColor: bg, overflow: 'hidden', ...style}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={`boil${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale={boil} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{filter: boil > 0 ? `url(#boil${id})` : undefined}}
      >
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={bg} />
        <g
          transform={`translate(${cx + x} ${cy + y}) rotate(${rot}) scale(${zoom}) translate(${-cx} ${-cy})`}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {children}
        </g>
      </svg>
      {overlay}
    </AbsoluteFill>
  );
};
