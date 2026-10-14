# Arena-ai shorts

This repo makes animated vertical shorts entirely in code with [Remotion](https://www.remotion.dev). Each video is React/SVG: you write every frame as a function of the frame number. Sound effects are synthesized from scratch in Python.

The first video, `Archers`, is a practice recreation of the "Why video games lied to you about archers" short (1080x1920, 30fps, 25.9s). It is not for publishing, because the script and character designs belong to the original channel.

Full handover documentation (genre forensics, how this video was built, how to make new ones, API reference): [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md).

## Run

```bash
npm install
npm run sfx        # regenerate public/sfx/*.wav (python3 + numpy)
npm run studio     # live preview / scrubbing in the browser
npm run render     # -> out/archers.mp4
```

`render` points Remotion at the Chromium headless shell preinstalled under `/opt/pw-browsers`. On another machine, drop the `--browser-executable` flag and Remotion downloads its own browser.

## Layout

```
src/
  lib/
    Stage.tsx     one shot = an SVG 1080x1920 canvas + camera + line-boil filter
    anim.ts       useT() time hook, keyframe `track`, `step`, `shake`, on-twos
    Caption.tsx   one-word-at-a-time captions driven by word timestamps
    shapes.tsx    Limb (double-stroke tube), Eye, Bow, Arrow, Sword, ground
    fx.tsx        flying arrows, pixel burst, paint splat, old-film overlay
  characters/     Knight, Skinny, Buff: posable SVG puppets
  videos/archers/
    shots.ts      edit decision list: shot name + cut times
    scenes/*.tsx  one component per shot
    words.ts      caption timings (whisper word timestamps of the reference VO)
    sfx.ts        sound cue sheet
scripts/make_sfx.py   noise/oscillator/Karplus-Strong synthesis of every SFX
```

## Techniques worth knowing

- **Line boil.** `Stage` runs the whole frame through `feTurbulence` + `feDisplacementMap`, reseeding the noise every 3 frames. Every outline wobbles slightly, which is what makes vector art read as hand-drawn.
- **Limbs.** Each limb is drawn twice: a thick black stroke with a thinner colored stroke on top. This gives an outlined tube from a single path, so posing a limb means editing one `d` string.
- **Posing.** Use `track(f, [[frame, value], ...])` for eased motion and `step(f, ...)` for snapping between drawn poses. Snapping between held poses on purpose reads as cartoon timing; smooth tweening everywhere reads as cheap Flash animation.
- **Time override.** Scenes read time through `useT()`, never `useCurrentFrame()` directly. A parent can then replay any shot at any frame. The rewind shot uses this to play earlier shots backwards under a grayscale filter.
- **Cut rhythm.** Shots last 0.3–2.5 s, and the cuts land on words of the voiceover.
- **SFX.** Whooshes are band-passed noise with a swept center frequency. Clangs are sums of inharmonic sines with exponential decay. The bowstring is a Karplus-Strong plucked string. The 8-bit sounds are pitch-dropping square waves.

## Making the next video

1. Write the script, record the voiceover, and get word timestamps (e.g. `faster-whisper` with `word_timestamps=True`).
2. Write `shots.ts` first: cut times taken from the words.
3. Reuse or extend the characters in `src/characters`, then write one scene component per shot.
4. Fill in `sfx.ts` from the frames where actions land, add `<Audio>` for the voiceover, and render.
