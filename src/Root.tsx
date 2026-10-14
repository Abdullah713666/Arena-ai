import {Composition} from 'remotion';
import {Archers, ARCHERS_DURATION} from './videos/archers/Archers';
import {FPS, H, W} from './lib/theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Archers"
    component={Archers}
    durationInFrames={ARCHERS_DURATION}
    fps={FPS}
    width={W}
    height={H}
  />
);
