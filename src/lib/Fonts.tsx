import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

export const CAPTION_FONT = 'MontserratBlack';
export const HAND_FONT = 'PermanentMarker';

const FACES: [string, string][] = [
  [CAPTION_FONT, 'fonts/montserrat-latin-900-normal.woff2'],
  [HAND_FONT, 'fonts/permanent-marker-latin-400-normal.woff2'],
];

/** Blocks rendering until the bundled fonts are ready. */
export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      FACES.map(([family, file]) => {
        const face = new FontFace(family, `url(${staticFile(file)})`);
        (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
        return face.load();
      }),
    ).then(() => continueRender(handle));
  }, [handle]);
};
