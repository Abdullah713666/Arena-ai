# Playbook: code-animated "useless facts" shorts

This is a handover document for an agent that has to make vertical, animated, voiceover-driven comedy shorts entirely in code. It has three jobs:

1. **Genre forensics:** explain what this kind of video is and why it works, measured from a real reference.
2. **Case study:** record exactly how the first video (`Archers`) was rebuilt in this repo, including the mistakes and their fixes.
3. **Method for new videos:** give a repeatable process, creative rules and code reference for making new videos on any topic, each with its own creative direction.

Read Part 1 for taste, Part 2 for craft, Part 3 for the process, and Part 4 when you're writing code. Every number here was measured from the reference or from this build, not guessed.

---

## Contents

- Part 1. Genre forensics
  - 1.1 What the format is
  - 1.2 Reference measurements
  - 1.3 Shot-by-shot autopsy of the reference
  - 1.4 Narrative structure (the beat formula)
  - 1.5 Comedy mechanics
  - 1.6 Visual language
  - 1.7 Caption language
  - 1.8 Sound language
  - 1.9 Why it works
- Part 2. Case study: how `Archers` was built
- Part 3. Making a new video
  - 3.1 Pipeline overview
  - 3.2 Topic selection
  - 3.3 Script writing
  - 3.4 Voiceover and timestamps
  - 3.5 Shot list design
  - 3.6 Creative direction: making each video its own thing
  - 3.7 Three worked examples
  - 3.8 Sound design and cue placement
  - 3.9 QA checklist
- Part 4. Codebase reference
- Part 5. Environment gotchas
- Part 6. Known weaknesses and roadmap
- Part 7. Rules and ethics

---

# Part 1. Genre forensics

## 1.1 What the format is

The genre is the **micro-explainer comedy short**, sometimes tagged `#uselessfacts #animation`. Typical traits:

- **Format:** vertical 9:16, 1080x1920, 30fps, about 20–60 seconds. The reference runs 25.8s.
- **Driver:** a single narrator voice. The voiceover *is* the edit: every cut, gag and caption hangs on a word.
- **Premise:** one surprising historical, scientific or pop-culture claim. It usually takes the shape "the thing you believe, mostly from games or movies, is wrong, and the truth is funnier."
- **Art:** deliberately crude, flat, thick-outlined cartoon. Simple geometric characters, no shading beyond a flat contact shadow, a two-tone world (sky and ground). It looks dashed off, but the timing is precise.
- **Pacing:** brutal. A new picture every ~1.3s on average, a joke every 2–3s, no shot held longer than ~3s.
- **Captions:** one word at a time, centered in the lower third, bold white with a black outline. Captions carry retention because many viewers watch muted.
- **Ending:** a hard, violent or absurd punchline, then cut to black. No outro, no call to action.

It belongs to the same family as Sam O'Nella-style history animation and "Infographics"-style shorts, compressed for Shorts/Reels/TikTok.

## 1.2 Reference measurements

| Metric | Value |
|---|---|
| Resolution / fps | 1080x1920, 30fps |
| Duration | 25.84s (775 frames) |
| Words (hyphenated compounds counted once) | 84 |
| Speech rate | 3.28 words/s (about 197 wpm, fast and deadpan) |
| Shots | 20 |
| Mean shot length | 1.29s |
| Shortest / longest shot | 0.30s (splat transition) / 3.07s (buff archer gag) |
| Cuts vs. designed transitions | 19 shot changes: 15 hard cuts and 4 designed transitions (splat wipe, whip pan, iris close, letterbox-in); the rewind is a hard cut into a treated shot |
| Title cards | 2 ("HISTORICALLY", "YOU DIDN'T WIN") |
| Recurring characters | 3 (knight, skinny archer, buff archer) plus 1 extra (top-down soldier) |
| Background types | sky/sand two-tone (most shots), solid black (cards), pink spotlight, purple close-up, top-down sand path |

**Palette** (sampled with PIL from the reference frames; these are the values in `src/lib/theme.ts`):

| Role | Hex |
|---|---|
| Sky | `#88d7f3` |
| Sand (side view) | `#e3c6a1` |
| Sand (top-down) | `#d9c5a6`, edge `#cbb18a` |
| Outline ink | `#111111` |
| Skinny archer skin | `#fcb7a3` |
| Buff archer skin | `#bd8e82` (light `#d2a59b`) |
| Knight armor | `#acadad`, dark `#5c5d5f` |
| Blade | `#f3f3f3` |
| Crossguard | `#f5c518` |
| Arrow fletching | `#d7263d` |
| Title-card black | `#191919` |
| Spotlight pink | `#fe81d9` |
| Close-up purple | `#9c5a85` |

The rule behind the palette: **two big flat background fields, low saturation, plus one or two saturated accents** (red fletching, gold hilt, pink spotlight) that point the eye at the gag object.

## 1.3 Shot-by-shot autopsy of the reference

The voiceover transcript, with word timestamps in `src/videos/archers/words.ts`:

> Why are archers always the weakest, skinniest characters in games? Why do they die in two hits? It's not true. Historically, they were the exact opposite. Pulling a 100-pound warbow 50 times in a row isn't for pretty boys. It requires insane back and shoulder strength. Real archers were 250-pound, muscle-bound absolute units. If you managed to survive the arrows and sprint up to one, you didn't win. They would drop the bow, pull out a massive battle axe, and beat you to death.

| # | Time (s) | Len | VO over the shot | Picture | Gag / purpose | Technique |
|---|---|---|---|---|---|---|
| 1 | 0.00–2.20 | 2.20 | "Why are archers always the weakest," | Knight in heroic guard pose, sword raised. Arrows fly in from off-screen and stick in his helmet. His eyes go from slit to angry to alarmed. | **Hook.** The question is shown from the receiving end: the archer isn't even in the picture, only his useless arrows. | Arrows travel 3–4 frames; small shake on each hit; slow push-in |
| 2 | 2.20–3.73 | 1.53 | "skinniest characters in games?" | Skinny pink archer aims lazily, then a two-shot: he plinks the knight point-blank and the arrows bounce or stick harmlessly. His face turns worried. | Stereotype dramatized: the "game archer" | Mid-shot cut at 2.73 to the two-shot; the knight doesn't react (deadpan) |
| 3 | 3.73–4.27 | 0.54 | "Why do they die" | Extreme close-up: archer staring down the arrow at the lens, huge eyes, hood-shaped background | Punch-in on the second question | Zoom from 1.12 to 1.0; symmetrical frontal composition |
| 4 | 4.27–4.70 | 0.43 | "in two" | Low angle: the knight towers over camera with arrows sticking out of him | Power contrast | Worm's-eye view, giant body filling the frame |
| 5 | 4.70–6.23 | 1.53 | "hits? It's not true." | Game-UI parody: health bar over the archer. Two sword hits take the bar from green to red, and he pixel-dissolves like a game death. The knight stays. | Literal video-game logic, ending on the "It's not true" pivot | UI overlay, pixel-burst particles, 8-bit SFX |
| 6 | 6.23–7.03 | 0.80 | "Historically, they" | Black card, white handwritten "HISTORICALLY" writing on | **Act break.** Tone switches from game myth to history | Card on `#191919`, marker font, letter-by-letter reveal |
| 7 | 7.03–8.40 | 1.37 | "were the exact opposite." | VHS rewind: earlier shots play backwards in grey with glitch bars and a rounded CRT frame | "Opposite" made visual: the myth literally rewinds | Earlier shots replayed with reversed time; grayscale, vignette, colored glitch bars |
| 8 | 8.40–9.70 | 1.30 | "Pulling a 100-pound warbow" | Close-up of the skinny archer holding a huge bow. He tries to pull, squints, leans and fails, then gives a sheepish look. | Effort gag: failure shown before the fact is explained | Snap pose changes (bored → strain → sheepish) with a shiver jitter |
| 9 | 9.70–10.45 | 0.75 | "50 times" | Wide: tiny archer squatting, trying to bend the bow over his head | Scale gag: the wide shot makes him pathetic | Trembling jitter on twos |
| 10 | 10.45–12.13 | 1.68 | "in a row isn't for pretty boys." | Front view, standing in the bow. He squints, then gives a big toothy grin; a "PRETTY BOY" label pops in with an arrow, then he turns into a dashed outline (erased). | **Literalization:** the phrase "pretty boy" becomes a diagram label, and he's deleted from the argument | Label pop with a back-ease; body swapped to a dashed outline |
| 11 | 12.13–12.43 | 0.30 | — | A white paint splat swallows the frame; a pink/black slash wipes to the next shot | Energy spike before the reveal | Spiky blob scaled 60→1500px in 5 frames |
| 12 | 12.43–14.30 | 1.87 | "It requires insane back and shoulder strength." | Pink spotlight cone on black; a muscular silhouette snaps through flex poses | **Reveal staging:** the real archer is introduced like a wrestler | Silhouette (no detail), pose snaps every ~13 frames, bass hit per pose |
| 13 | 14.30–15.33 | 1.03 | "Real archers" | Smug close-up of the buff archer: finger on chin, half-lidded eye, pink rim light | Character beat: confidence | Rim light = a thick pink stroke under the black outline |
| 14 | 15.33–18.40 | 3.07 | "were 250-pound, muscle-bound absolute units." | The buff archer shoots arrows on a fast loop while the skinny archer serves as his arrow caddy. The skinny one gets exhausted, gets a pat on the head, and is finally nocked and fired as an arrow. | **Escalation and callback:** the old stereotype becomes literal ammunition | Pose-to-pose cycle, ~15 frames per shot |
| 15 | 18.40–21.00 | 2.60 | "If you managed to survive the arrows and sprint up to one," | Whip pan, then top-down battlefield: a small soldier gets up and runs up a sand path while arrows rain down and stick | POV shift to "you" (second person) | Motion-blur stripes for the pan; scrolling camera; iris close at the end |
| 16 | 21.00–22.00 | 1.00 | "you didn't win." | Black card, "YOU / DIDN'T / WIN" stacked, each word landing on its spoken word | Second act break; deadpan verdict | Per-word slam SFX |
| 17 | 22.00–23.43 | 1.43 | "They would drop the bow, pull out a" | The soldier kneels with his sword planted; a giant bow thuds down in the foreground; his eyes look up | Calm before violence | Foreground drop with chromatic fringes, ground ripple, shake |
| 18 | 23.43–24.17 | 0.74 | "massive battle" | From behind: a giant back, red belt, axe hoisted overhead | Threat reveal from behind, so the audience shares the victim's view | Back view; the arm and axe swing up on a back-ease |
| 19 | 24.17–25.23 | 1.06 | "axe, and beat you" | Letterboxed extreme close-up of the axe blade; a gleam runs up the edge | Cinematic parody (the "epic weapon" shot) | Letterbox bars, 4-point twinkle, slow push |
| 20 | 25.23–25.85 | 0.62 | "to death." | Black screen; a white ink splash flickers and shrinks away | **Punchline by omission:** the violence happens off-screen | Hard cut to black, shrinking flame, big impact SFX, no outro |

## 1.4 Narrative structure (the beat formula)

The reference follows this skeleton almost exactly. Use it as the default.

| Beat | Share of runtime | Reference | Job |
|---|---|---|---|
| **1. Hook question** | 0–15% | "Why are archers always the weakest…?" | State the myth as a question the viewer half-believes. Show it in the first frame. |
| **2. Myth dramatized** | 15–25% | Game logic, two hits, pixel death | Make the myth vivid and slightly ridiculous, usually by parodying the medium the myth comes from (games, movies, cartoons). |
| **3. Pivot** | ~25% | "It's not true." + "HISTORICALLY" card | One short sentence of denial, then a title card. This is the act break. |
| **4. Reversal device** | 25–33% | Rewind, "the exact opposite" | Visually undo the myth: rewind, record scratch, crossed-out graphic, glitch. |
| **5. Evidence by failure** | 33–47% | The skinny guy can't pull the bow | Prove the fact by showing the stereotype failing at the real task. |
| **6. The truth revealed** | 47–70% | Spotlight, smug close-up, "absolute units" | Introduce the real version as a character with swagger, and escalate. |
| **7. Second-person consequence** | 70–85% | "If you… you didn't win" | Put the viewer in the scene. A second card lands the verdict. |
| **8. Punchline** | 85–100% | "beat you to death" + cut to black | A hard, absurd or violent final image, then nothing. The last word is the last frame. |

**Script rules derived from the reference:**

- **Length:** 75–90 words for 25s. At 3.3 words/s the narrator never pauses longer than ~0.7s.
- **Questions:** two in the hook ("Why…? Why…?"). Repetition plus rhythm.
- **Pivot:** the denial is three words or fewer ("It's not true.").
- **Concrete numbers:** at least two, said in full ("100-pound", "50 times", "250-pound"). Numbers are believable and easy to visualize.
- **Slang for punch:** at least one colloquial phrase at the peak ("absolute units", "pretty boys").
- **Ending:** on a short, violent or blunt monosyllable ("death").

## 1.5 Comedy mechanics

Each gag type below appears in the reference. Use at least five of them per video.

1. **Literalization.** A figure of speech becomes the image. "Pretty boys" becomes a labeled diagram; "the exact opposite" becomes a rewind; "absolute units" becomes a man who uses another man as an arrow.
2. **Medium parody.** Mimic the visual language of where the myth comes from: health bars and pixel deaths for games, letterboxed blade gleams for movies, VHS for "old footage".
3. **Deadpan non-reaction.** One character doesn't react to something absurd: the knight ignores the arrows in his head.
4. **Scale and power contrast.** Low-angle giant vs. tiny wide-shot figure; buff vs. skinny side by side.
5. **Failure before explanation.** Show the character failing, then let the VO give the number. The picture lands the joke and the number confirms it.
6. **Escalation in threes.** Arrows hit 1, 2, 3, 4 times; the buff archer fires 4 arrows, then fires the person.
7. **Callback / role reversal.** The hook's victim (the skinny archer) returns as an object in the reveal.
8. **Reveal staging.** Silhouette in a spotlight before the character is shown in detail.
9. **Off-screen violence.** The final hit is a black screen and a sound. The viewer imagines it.
10. **Expression snaps.** Eyes are the main acting tool: slit → angry → alarmed, bored → squint → sheepish. They change in one frame, never tweened.
11. **Second person.** "If *you*…" moves the viewer into the scene for the final act.
12. **Hard-cut punchline.** No outro. The audience laughs at the cut.

## 1.6 Visual language

**Line and shape**
- **Outlines:** uniformly thick black (`#111`), about 6px at 1080px width, with round joins and caps.
- **Characters:** built from one dominant primitive each. Sausage (skinny archer), bucket on a box (knight), pear with a block head (buff). No necks, no fingers except in close-ups, no noses. The eyes are the face.
- **Eyes:** white ovals with small black pupils. A lid is a skin-colored mask with a straight black lid line. Mood comes from lid height, lid angle and pupil direction.
- **Mouths:** optional. When present they are tiny: flat line, frown, small "o", or a huge toothy grin for comedy beats.
- **Hand-drawn feel:** the "line boil" (every outline wobbles slightly, changing every 2–3 frames). This build reproduces it with an SVG displacement filter, so vector shapes don't look clean and dead.

**World**
- **Side-view ground:** horizon at about 61% of frame height (y≈1175 of 1920). Sky above, sand below, a thin black horizon line, sparse darker sand specks.
- **Contact shadows:** flat semi-transparent ellipses under every standing object. No other lighting.
- **Detail on demand:** scenery only appears when the gag needs it (the top-down path edges, the spotlight).

**Framing**
- **Placement:** subjects sit in the vertical center band. Feet land at about y≈1210–1360 in side views.
- **Caption-safe zone:** y≈1480–1650. Keep important action out of it.
- **Shot variety:** cycle wide, medium, close-up and extreme close-up. Never use the same framing twice in a row.
- **Camera:** almost static. Slow push-ins (zoom 1.00→1.05 over a shot), short decaying shakes on impacts, occasional low angle.

**Transitions** (15 of 19 shot changes are hard cuts)
- **Hard cut:** the default, timed on a word onset.
- **Title card:** black, handwritten, marking an act break.
- **Splat:** high energy, into a reveal.
- **Whip pan:** location or POV change.
- **Iris close:** ends a "you" sequence.
- **Letterbox:** "epic" parody.
- **Rewind/VHS:** reversal.

**Animation timing**
- **Poses:** the reference animates mostly pose-to-pose, holding drawings for 2–4 frames ("on twos/threes"). Tweening is reserved for projectiles, camera and squash.
- **Projectiles:** arrows cross the frame in 3–4 frames, with a pale speed streak.
- **Impacts:** a 5–8 frame decaying shake of 6–18px.

## 1.7 Caption language

- **Style:** one word on screen at a time, uppercase, Montserrat Black, about 56px, white fill, ~11px black outline, a 3px hard drop shadow, centered at y≈1568.
- **Entry:** the word appears on its spoken onset with a 2–3 frame fade/scale-in (opacity 0.25→1, scale 0.92→1).
- **Duration:** it holds until the next word's onset, or until 0.6s after its own end, whichever comes first.
- **Text:** punctuation is kept ("WEAKEST,", "GAMES?", "DEATH."). Hyphenated compounds stay one word ("100-POUND", "MUSCLE-BOUND").
- **Title cards** are a separate, louder layer: handwritten font, much larger, placed upper-middle. The small caption still runs underneath.

## 1.8 Sound language

- **Voice:** fast, flat, slightly sardonic narrator. It carries rhythm; no pauses for laughs.
- **SFX density:** roughly one cue every 0.4–0.5s (this build has 51 cues over 25.8s). Every visible action has a sound: arrow whoosh, metal tink, bowstring twang, wood creak, 8-bit hit, pixel arpeggio, paint splat, bass thump per pose, slam per title word, blade shing, final impact.
- **Music:** none, or a barely audible bed. The voice and SFX are the soundtrack.
- **Mix:** VO on top, SFX underneath (here at 0.3–0.9 relative volume). The last impact is the loudest sound in the video.

## 1.9 Why it works

- **Recognition then surprise.** The opening shows something the viewer already believes (the game archer), so it costs no attention. The pivot then rewards attention with a reversal.
- **Every 1–2 seconds the picture changes and makes a joke**, which resets the scroll impulse. Captions add a second, faster stream of novelty (a new word every 0.3s).
- **Crude art lowers expectations and speeds production.** Precise timing makes it feel crafted anyway.
- **The ending gives no time to leave before it's over**, which encourages replays (a loop-friendly short).

---

# Part 2. Case study: how `Archers` was built

This is the actual sequence of work, with the problems hit along the way. Repeat it for any reference-matching job.

### Step 1. Forensic pass on the reference

```bash
scripts/analyze_reference.sh ref.mp4 analysis/
```

- **Probe:** `ffprobe` gave 1080x1920, 30fps, 25.84s, with an audio track.
- **Scene detection:** ffmpeg's `select='gt(scene,0.15)'` found most cuts (3.73, 4.27, 4.70, 6.23, 7.03, 8.40, 12.13, 12.43, 14.30, 15.33, 21.97, 23.43, 24.17, 25.23). It **missed** cuts between similar-looking shots (2.20, 9.70, 10.45, 18.40, 21.00). The 4fps sheets fixed that: always check scene detection visually.
- **Contact sheets:** a 1fps sheet for the overview, then **4fps sheets with burned-in timestamps** to read every shot's internal animation (when the eyes change, when arrows land). Reading the sheets as images was the main analysis tool.
- **Close study:** mid-resolution strips of 4–5 frames were used for character proportions and drawing.
- **Colors:** sampled with PIL `getpixel` at chosen coordinates of extracted full-resolution frames.

### Step 2. Transcription with word timestamps

```bash
pip install faster-whisper
python3 -I scripts/transcribe.py analysis/audio16k.wav words.json
```

- **Gotcha:** `faster-whisper`'s own file decoding crashed (`av.open() got an unexpected keyword argument 'metadata_errors'`, a PyAV version mismatch). The fix is to read the WAV yourself and pass a float32 numpy array (the script does this).
- **Cleanup:** Whisper misheard "skinniest" as "skittiest", so fix words by checking them against the burned-in captions. Hyphen tokens ("-pound") are merged into the previous word.
- **Output:** `src/videos/archers/words.ts`. These timestamps drive both the captions and the cut points.

### Step 3. Tool choice: Remotion

- **Why Remotion:**
  - Each frame is a pure React function of the frame number, which is exactly "frame by frame with code".
  - Headless rendering to MP4.
  - First-class `<Sequence>` and `<Audio>`.
  - TypeScript.
- **Why not Motion Canvas:** its rendering is built around its editor UI, and character work is clumsier.
- **Why not raw canvas:** you'd have to rebuild timeline, audio sync and encoding yourself.
- **Pinned versions** (each at least two weeks old at the time): `remotion`/`@remotion/cli` 4.0.529, React 19.1.1, TypeScript 5.9.2. Fonts come from `@fontsource` packages and are copied into `public/fonts`, so rendering needs no network.

### Step 4. Architecture decisions

- **One SVG canvas per shot** (`Stage`), 1080x1920 coordinates. This allows pixel-exact layout against the reference.
- **Line boil as a global filter** on each `Stage`. Every shot gets the hand-drawn wobble for free.
- **Characters as puppets:** the body is drawn by the component, and arms and props are passed in as `children` in the character's local space. A new pose then needs no new component.
- **Local coordinates:** origin at the feet center, up is negative y. Place a character with `translate(x y) scale(s)`.
- **`useT()` instead of `useCurrentFrame()`,** so any shot can be replayed at an arbitrary frame. The rewind shot depends on this.
- **Edit decision list** (`shots.ts`) separate from the scenes. Cut times live in one place.
- **Cue sheet** (`sfx.ts`): sound times are computed as `shotStart + localFrame/30`, so sounds follow the action automatically when you change a scene.

### Step 5. First calibration render and comparison

The first five shots were written, rendered at `--scale=0.4` (about 20s), and compared side by side with the reference:

```bash
npx remotion render Archers prev.mp4 --frames=0-186 --scale=0.4 --browser-executable=...
scripts/compare.sh ref.mp4 prev.mp4 cmp.png 0.3 1.2 1.8 2.3 3.0 3.5 3.9 4.4 4.9 5.6
```

Findings and fixes:

| Problem seen in the comparison | Fix |
|---|---|
| Characters about 25% too small | Knight scaled to 1.12; two-shot actors set to scale 1.0–1.05; feet moved to y≈1245–1360 |
| Skinny archer read as a stick | Width 104→120; body tapers (narrower top, wider bottom) |
| Sword too thin | Blade half-width 22→30, larger crossguard |
| Eyes too big in the close-up (scale 3) | Eye radius ratio 0.27→0.23 of body width |
| Rewind washed out to white | Filter `brightness(1.2)` → `contrast(0.85) brightness(0.92)` |
| Archer-as-arrow invisible | It was drawn *under* the buff guy's arm (SVG paints in document order); moved after the arms, and the camera pans left so it isn't off the edge |
| Dropped bow curved like a rainbow | Control point moved below the endpoints (convex down, like the reference) |
| Death splash looked like a star | Replaced with a flame teardrop path plus a few holes, flickered with `skewX` |

### Step 6. Remaining shots

Shots 6–20 were written in `scenes/Middle.tsx` and `scenes/Late.tsx`. The full preview at 0.4 scale renders in under a minute. Comparison sheets at about 40 timestamps covered every shot.

### Step 7. Sound effects

- **Synthesis:** `scripts/make_sfx.py` builds 27 effects with numpy only (no scipy was installed, so it has a hand-written biquad filter).
- **Placement:** `sfx.ts` places 51 cues.
- **Render check:** `ffmpeg -af volumedetect` gave mean −22.4 dB, peak −4.6 dB, with no clipping.

### Step 8. Final render

- **Command:** `npm run render`, about 86s for 776 frames at concurrency 4. Output is about 5.9 MB H.264 with AAC.
- **Side-by-side:** a review video was made with `ffmpeg hstack` (reference on the left, render on the right, render audio).

### Time budget observed

| Stage | Share |
|---|---|
| Forensics and transcription | ~15% |
| Library and characters | ~25% |
| Scenes | ~40% |
| Calibration loops | ~10% |
| SFX | ~10% |

---

# Part 3. Making a new video

## 3.1 Pipeline overview

```
topic → myth/truth pair → script (80 words) → voiceover → word timestamps
      → shot list (cuts on words) → creative direction (palette, cast, world)
      → characters/props → scenes → SFX cue sheet → preview renders
      → compare/QA → final render
```

Commands, in order:

```bash
# 1. voiceover -> timestamps
ffmpeg -i vo.wav -ac 1 -ar 16000 vo16k.wav
python3 -I scripts/transcribe.py vo16k.wav words.json      # fix misheard words by hand
# 2. build: write src/videos/<slug>/{words,shots,sfx}.ts and scenes/*.tsx,
#    register a <Composition> in src/Root.tsx
# 3. sounds
npm run sfx                                                # add recipes if needed
# 4. iterate
npx remotion render <Id> out/prev.mp4 --scale=0.4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
ffmpeg -i out/prev.mp4 -vf "fps=4,scale=240:-1,drawtext=text='%{pts\:hms}':x=4:y=4:fontsize=20:fontcolor=red:box=1,tile=8x2" out/sheet_%02d.png
# 5. final
npx remotion render <Id> out/<slug>.mp4 --browser-executable=...
```

Read the contact sheets as images after every preview render. Never ship a shot you haven't looked at.

## 3.2 Topic selection

A good topic has all of these:

- **A widely held image** from games, movies or cartoons that contradicts reality.
- **A concrete, visualizable truth.** Numbers, weights, distances, body changes, objects.
- **A villain or extreme version** of the truth that can be shown with swagger.
- **A way to put "you" in danger or embarrassment** for the final act.
- **A one-word blunt ending.**

Topic seeds that fit the formula:

| Myth (what media shows) | Truth (the reversal) | Possible punchline |
|---|---|---|
| Ninjas wore black and fought in the open | Ninjas dressed as farmers and merchants; black was a theater convention | "…and you'd never even know which farmer killed you." |
| Vikings wore horned helmets | No horns; the image comes from 1800s opera costumes | "The only horns were on the costume designer." |
| Knights were too heavy to stand up if they fell | Full plate ~25 kg, spread out; knights did cartwheels in it | "He'd get back up. You wouldn't." |
| Pirates made people walk the plank | Almost never happened; they just threw you overboard | "No plank. Just the ocean." |
| Cavemen dragged women by the hair | Invented by cartoons; skeletons show communities caring for the injured | "The real cavemen would've beaten the cartoonist." |
| Gladiators always fought to the death | Expensive athletes, often spared; many were celebrities | "Dying was bad for business." |
| Medieval people never bathed | Public bathhouses were common | "The plague did not care about your bath." |
| Samurai always used the katana | The bow was the main samurai weapon for centuries | "The sword was the backup." |

Verify every fact before writing; the tone is confident, so the facts must be right.

## 3.3 Script writing

**Template** (fill the brackets; target 75–90 words):

```
Why are [group] always [myth trait] in [medium]? Why do they [myth consequence]?
It's not true. [Historically/Actually], they were the exact opposite.
[Concrete demanding task with a number] [number] times [frequency] isn't for [mocking label].
It requires [extreme adjective] [specific attribute].
Real [group] were [number + unit], [slang compound] [slang noun].
If you [tried to beat them / met one], you [didn't win].
They would [escalating action], [escalating action], and [blunt final verb] you [blunt final word].
```

**Checklist:**
- [ ] Two "Why…?" questions in the first 5 seconds.
- [ ] A denial of three words or fewer, followed by a title-card word ("Historically", "Actually", "In reality").
- [ ] Two or more spoken numbers.
- [ ] One mocking label for the myth version ("pretty boys") and one slang superlative for the truth version ("absolute units"). These become literal visual gags.
- [ ] Last act in second person.
- [ ] Last word is short and blunt.
- [ ] Every sentence suggests a picture. If a line can't be drawn as a gag, rewrite it.

## 3.4 Voiceover and timestamps

- **Pace:** about 3.2–3.4 words per second, flat, slightly bored. Speed sells the deadpan.
- **Sources:** a human recording (best), or TTS. If you use TTS, use a dry, fast voice and normalize to about −16 LUFS.
- **Timestamps:** run `scripts/transcribe.py`, then fix spellings and merge hyphenated compounds. Times within ±40 ms are fine.
- **Integration:** add the voiceover as `<Audio src={staticFile('vo/<slug>.wav')} />` at frame 0 in the video's root component.

## 3.5 Shot list design

**Procedure**
1. Write the transcript out with timestamps.
2. Mark **cut words**: the first word of each new idea, every number, every slang or label word, and the denial.
3. Aim for 16–24 shots in 25s, none shorter than 0.3s (transitions only) and none longer than about 3s. A long shot is allowed only if it contains its own internal escalation (like the caddy loop).
4. Give every shot a **framing**, a **gag type** from §1.5, a **technique** from the catalog below, and its **sound cues**.
5. Put the two title cards on the two act breaks (pivot and verdict).

**Shot catalog** (all built in this repo; reuse them)

| Shot pattern | Use it when the VO… | Reference implementation |
|---|---|---|
| Hero pose under attack | opens with a myth about one side of a conflict | `KnightShot` |
| Point-blank failure two-shot | describes weakness | `SkinnyShootShot` |
| Frontal punch-in close-up | asks the second question | `HoodFaceShot` |
| Low-angle giant | mentions toughness or power | `LowKnightShot` |
| Medium parody (game UI) | references games or "hits"/"lives"/"levels" | `GameShot` |
| Handwritten title card | hits an act break word | `TitleCard`, `HistoricallyShot`, `YouDidntWinShot` |
| Rewind / VHS | says "opposite", "actually", "turns out" | `RewindShot` |
| Effort-fail close-up | gives a demanding task with a number | `SkinnyCloseShot` |
| Tiny wide strain | repeats or quantifies the task | `WideStrainShot` |
| Literal label | uses a mocking label | `PrettyBoyShot` |
| Splat transition | is about to reveal the "real" version | `SplatShot` |
| Spotlight silhouette poses | introduces the real version | `SpotlightShot` |
| Smug close-up with rim light | names the real version | `ChinShot` |
| Escalating loop gag | lists stats or superlatives | `BuffShootShot` |
| Whip pan, then top-down run | says "if you…", a journey or attempt | `TopDownShot` |
| Iris close | ends the attempt | inside `TopDownShot` |
| Foreground drop | drops or switches a tool | `KneelShot` |
| Back-view threat | introduces the weapon | `AxeBackShot` |
| Letterboxed gleam | names an "epic" object | `AxeGleamShot` |
| Cut to black with splash | delivers the last word | `DeathShot` |

**Shot list format** (write this before any scene code):

```
| # | start | end | VO | framing | picture + action beats (local frames) | gag | sfx |
```

## 3.6 Creative direction: making each video its own thing

Keep the **grammar** (pacing, captions, line boil, thick outlines, flat color, beat formula). Change the **vocabulary**: world, palette, cast and signature device. For each new video, write a five-line direction brief before coding:

```
WORLD:       where the side-view ground and sky are (desert, snow, deck, forest, arena)
PALETTE:     sky / ground / accent1 / accent2 (keep sky+ground desaturated, accents saturated)
CAST:        myth archetype (weak/silly), truth archetype (extreme/smug), victim ("you")
SIGNATURE:   one recurring visual device unique to this video (e.g. a stat counter, a stamp)
PARODY:      which medium the myth comes from and how to imitate it (game UI, movie, cartoon, textbook)
```

**Palette presets** (all keep the reference's value structure: light sky, mid ground, dark ink):

| World | Sky | Ground | Accent 1 | Accent 2 |
|---|---|---|---|---|
| Desert / medieval field (reference) | `#88d7f3` | `#e3c6a1` | `#d7263d` | `#f5c518` |
| Snow / Viking | `#bfe3f2` | `#f2f5f7` | `#c0392b` | `#2e86de` |
| Ocean / pirate deck | `#7fd0e8` | `#b8875a` (planks) | `#e74c3c` | `#f1c40f` |
| Japan / feudal | `#f6d6c6` (dusk) | `#9bbf6a` | `#c0392b` | `#2d2d2d` |
| Arena / Rome | `#9ad5f0` | `#e8cf9d` | `#8e44ad` | `#d4ac0d` |
| Cave / prehistoric | `#f3b26b` (sunset) | `#a9876a` | `#e67e22` | `#5d6d7e` |
| Lab / science | `#e8eef2` | `#c9d3da` | `#27ae60` | `#e84393` |

**Character archetype rules:**
- **Myth version:** thin, tall, pale, worried eyes, holds the iconic prop wrong.
- **Truth version:** wide pear or V torso, small block head, slit eye with an angled brow, darker skin tone, oversized prop held casually.
- **"You":** small, simple, top-down or kneeling, big eyes. A blank stand-in.
- **Each character:** one dominant shape, at most two colors plus ink, and an identifiable silhouette in black (test it with `fill="#000"`).

**Signature device ideas** (one per video, used 2–3 times):
- **Stat counter:** a number ticking up next to the character as the VO lists numbers.
- **Stamp:** a red "MYTH" / "FACT" rubber-stamp slam on cards.
- **Tally marks:** for repetitions ("50 times").
- **Textbook diagram:** dashed arrows and labels (extend `PrettyBoyShot`).
- **Fake game UI:** XP bar, "GAME OVER", damage numbers floating up.
- **Film-reel scratch:** for movie myths instead of VHS.

## 3.7 Three worked examples

### A. "Ninjas didn't wear black"

- **World:** feudal village at dusk.
- **Palette:** Japan preset.
- **Cast:** cartoon ninja (black suit, headband, the myth); farmer-ninja (straw hat, smug, the truth); "you" as a lord.
- **Signature:** red "MYTH" stamp.
- **Parody:** a 90s action-movie ninja intro with smoke-bomb puffs.

Script (82 words):

> Why do ninjas always wear black in movies? Why do they flip around on rooftops? It's not true. Actually, black made you stand out. Real ninjas dressed as farmers, monks and merchants, and walked in the front gate. The black suit came from theater, where stagehands wore black to be "invisible." Real ninjas were 40-year-old rice farmers with a knife in the basket. If you were a lord, you didn't see them coming. You bought their rice, said thank you, and died.

| # | VO | Picture | Gag |
|---|---|---|---|
| 1 | "Why do ninjas always wear black in movies?" | Ninja on a rooftop, smoke-bomb puff, dramatic pose | Medium parody |
| 2 | "Why do they flip around on rooftops?" | Ninja flips and lands on his face | Failure |
| 3 | "It's not true." | Hard cut: the ninja frozen mid-pose | Pivot |
| 4 | "Actually," | Title card + "MYTH" stamp slam over the ninja | Signature |
| 5 | "black made you stand out." | Wide village: everyone pastel, one black blob, guards pointing | Literalization |
| 6 | "dressed as farmers, monks and merchants" | Three fast cuts, same smug face under three hats | Escalation in threes |
| 7 | "walked in the front gate" | Guard waves him through | Deadpan |
| 8 | "The black suit came from theater" | Stage with curtains; black-clad stagehands "invisible" | Reveal of the source |
| 9 | "40-year-old rice farmers" | Spotlight silhouette with a hat, then close-up of a smug farmer | Reveal staging |
| 10 | "knife in the basket" | Basket close-up, letterbox gleam | Epic parody |
| 11 | "If you were a lord" | Top-down: lord's palanquin moving through the crowd | Second person |
| 12 | "you didn't see them coming" | Card "YOU / DIDN'T / SEE" | Verdict |
| 13 | "You bought their rice, said thank you," | Lord bows to the farmer; the farmer bows deeper | Calm before violence |
| 14 | "and died." | Cut to black, single "shing" | Off-screen punchline |

### B. "Vikings never wore horned helmets"

- **World:** snowy fjord.
- **Palette:** Snow preset.
- **Cast:** opera Viking (giant horns, the myth); real Viking (round iron cap, huge beard, the truth); "you" as a monk.
- **Signature:** a 19th-century opera poster frame.
- **Parody:** a dusty opera stage with spotlight and velvet curtains.

Beat outline:
- **Hook:** horned Viking gets his horns stuck in a doorway.
- **Myth:** horns used as a weapon and failing (cartoon "boing").
- **Pivot:** "It's not true." → card "IN REALITY".
- **Reversal:** curtains close on the horned Viking (theater device instead of rewind).
- **Evidence by failure:** horns as a handle; an enemy grabs them and spins him.
- **Truth reveal:** spotlight silhouette with a round helmet; smug beard close-up; stat counter for a 1.2 m axe and 20 kg of chainmail.
- **Second person:** "If you were a monk on Lindisfarne…" top-down beach landing.
- **Punchline:** "…they didn't need horns." Cut to black.

### C. "Knights could get up when they fell"

- **World:** tournament field.
- **Palette:** Arena preset, with green ground `#9bbf6a` swapped in.
- **Cast:** the crane-lift knight (myth); the acrobat knight (truth); "you" as a peasant with a pitchfork.
- **Signature:** gymnastics scorecards (judges holding 10s).
- **Parody:** an old textbook illustration with dashed annotation arrows.

Beat outline:
- **Hook:** a knight is lowered onto his horse by a crane, then falls over and turtles.
- **Myth:** a "turtle" health bar empties while he flails.
- **Pivot:** card "HISTORICALLY".
- **Reversal:** VHS rewind of the crane lift.
- **Evidence by failure:** the skinny squire tries to wear the armor and the helmet visor drops shut.
- **Reveal:** "25 kilograms, spread over the whole body" as a textbook diagram with dashed weight arrows; then the knight does a cartwheel and judges hold up 10s; a "he could climb a ladder from underneath" vignette.
- **Second person:** "If you knocked one down…" iris on the peasant.
- **Punchline:** "He'd get back up. You wouldn't." Cut to black.

## 3.8 Sound design and cue placement

**Rules**
- Every action gets a sound placed at the frame it happens: `at = shotStart + localFrame/30`. Projectiles get a whoosh at launch and an impact at arrival.
- Pose snaps in reveal shots get a bass hit or slam; expression snaps get a short pop.
- Each title-card word gets a slam on the frame it appears.
- The last impact is the loudest cue (vol 0.9); typical cues sit at 0.3–0.7.
- Keep about 2 cues per second at most; let the voiceover breathe.
- Each act break gets a low boom.

**Recipe table** (`scripts/make_sfx.py`)

| File | Recipe | Used for |
|---|---|---|
| `whoosh`, `swing`, `whip`, `arrow` | white noise → band-pass with an exponentially swept center (`f0→f1`), bell envelope | movement, swings, whip pans, arrows |
| `tink` | sum of inharmonic sines (2350, 3720, 5480, 1180 Hz) with fast exponential decay + high-passed click | arrow on metal |
| `twang` | Karplus-Strong plucked string at 98 Hz + a short low thud | bowstring release |
| `creak` | irregular impulses (70–140/s, stick-slip) through 650 Hz and 1400 Hz resonant band-passes | wood/bow strain |
| `hit8` | square wave pitch drop 330→90 Hz, 0.14s + thud | game hit |
| `pixel` | descending square arpeggio (880→262 Hz) + sparse high-passed crackle | pixel death |
| `boom` | sine sweep 110→32 Hz + low-passed noise burst + comb reverb | act breaks, reveals |
| `scribble` | 3.2 kHz band-passed noise gated by random half-sine "strokes" | title write-on |
| `rewind` | repeating rising chirps (7.5/s) + modulated band-passed hiss + saw sweep | VHS rewind |
| `glitch` | random short square-wave fragments, bit-crushed to 2 bits | glitch bars |
| `strain` | detuned square + sine with 13 Hz vibrato, low-passed | comic effort |
| `sparkle` | staggered high bell tones (2–4 kHz) + reverb | grin, smug, gleam |
| `pop`, `poof` | sine drop 900→220 Hz in 80 ms / low-pass-swept noise burst | snaps, vanish |
| `splat` | low-passed noise + 5 wet sine drops + thud | paint splat |
| `clunk` | thud + band-passed click, heavy reverb | spotlight on |
| `rain` | whistle 2.6 kHz→900 Hz then delayed thud | arrows into sand |
| `iris` | triangle sweep 900→90 Hz | iris close |
| `slam` | 160→40 Hz thud + noise click | title words, pose snaps |
| `bowdrop`, `thud` | low thud + three wood knocks | heavy object lands |
| `axedraw`, `shing` | rising band-passed scrape + long metallic ring (3.1/4.7/6.3 kHz) | blade reveal |
| `impact` | thud + noise, bit-crushed + reverb | final hit |

To add a sound, write a function returning a numpy array, call `save('name', ...)` in `main()`, run `npm run sfx`, and reference it as `{file: 'name', at, vol}`.

## 3.9 QA checklist

**Before the final render:**
- [ ] `npx tsc --noEmit` passes.
- [ ] Preview at `--scale=0.4`; 4fps contact sheets inspected for every shot.
- [ ] No shot holds an unchanged picture longer than ~1s (something must move or snap).
- [ ] Every caption word is legible; no key action sits behind the caption band (y 1480–1650).
- [ ] Characters are readable as silhouettes; nothing important is hidden behind a limb (SVG draw order!).
- [ ] Projectiles visibly travel (at least 3 frames on screen) and land on an impact frame with a shake and a sound.
- [ ] Cuts land within ±2 frames of the word onset they belong to.
- [ ] Title-card words appear on their spoken words.
- [ ] The final frame is the punchline; no dead frames after the last word (≤0.3s).

**After the final render:**
- [ ] `ffprobe` shows 1080x1920, 30fps, video and audio streams.
- [ ] `ffmpeg -af volumedetect` peak between −6 and −1 dB, no clipping.
- [ ] Watch the full video once at real speed, with sound.

---

# Part 4. Codebase reference

## 4.1 Layout

```
package.json            scripts: studio | sfx | render | still | typecheck
remotion.config.ts      jpeg frames q92, concurrency 4
src/index.ts            registerRoot
src/Root.tsx            <Composition id="Archers" …>; register new videos here
src/lib/
  theme.ts              FPS, W, H, palette C, STROKE
  anim.ts               time + easing helpers
  Stage.tsx             shot canvas, camera, line boil
  Caption.tsx           Captions component, Word type
  Fonts.tsx             useFonts(), CAPTION_FONT, HAND_FONT
  shapes.tsx            Limb, arm2, SkyGround, Shadow, Arrow, Bow, Sword, Eye, SquintEye
  fx.tsx                FlyingArrow, PixelBurst, Splat, OldFilmOverlay, Letterbox
src/characters/
  Knight.tsx            KnightGuard, KnightSide, StuckArrow type
  Skinny.tsx            Skinny (side/front), Face, Legs types
  Buff.tsx              Buff, BuffArm, Fist
src/videos/archers/
  Archers.tsx           root: Sequences per shot + Captions + Audio cues
  shots.ts              EDL: {name, start, end, Comp}
  words.ts              caption timings
  sfx.ts                cue sheet
  scenes/Intro.tsx      shots 1–5
  scenes/Middle.tsx     shots 6–11 (+ TitleCard)
  scenes/Late.tsx       shots 12–20
scripts/
  analyze_reference.sh  probe, cuts, contact sheets, 16 kHz audio
  transcribe.py         faster-whisper word timestamps
  compare.sh            reference-vs-render sheet
  make_sfx.py           SFX synthesis
public/fonts, public/sfx
docs/PLAYBOOK.md        this file
```

## 4.2 Conventions

- **Coordinates:** 1080x1920 SVG space; (0,0) is top-left.
- **Character local space:** origin at the feet center, up is −y. Place with `<g transform="translate(x y) scale(s)">`.
- **Time:** inside a shot, `const f = useT();` gives the local frame (0 at the shot's start). Use frame numbers, not seconds, for in-shot choreography; use seconds in `shots.ts` and `sfx.ts`.
- **Draw order is z-order:** later elements paint on top. Typical order: background, shadows, back props, body, face, front props, front arms, effects.
- **Determinism:** use `random('seed')` from Remotion, never `Math.random()`. Frames render in parallel and must be reproducible.
- **Pose style:** `step()` for drawn-pose swaps, `track()` for moves; jitter with `onTwos()`.

## 4.3 API

**`theme.ts`**: `FPS=30`, `W=1080`, `H=1920`, `STROKE=6`, palette `C` (keys: `ink sky sand sandDark sandSpeck sandTop sandTopEdge shadow steel steelDark steelDeep blade bladeShade gold skin skinShade buff buffLight buffShade fletch wood black pink pinkFloor purple white hpGreen hpRed`).

**`anim.ts`**
- `useT(): number`: local frame, or the forced frame from `TimeOverride`.
- `TimeOverride`: React context. `<TimeOverride.Provider value={n}>` replays children at frame `n` (see the `At` helper in `Middle.tsx`).
- `track(f, [[frame, value], …], easing = EASE.inOut)`: clamped keyframe interpolation.
- `step(f, [[frame, value], …])`: hold values (any type); the latest key ≤ f wins.
- `ramp(f, a, b, easing)`: 0→1 between frames a and b.
- `shake(f, start, dur, amp, seed) → {x, y, r}`: quadratic-decay random shake; add it to the `Stage` cam.
- `onTwos(f, n = 2)`: quantize time to hold every n frames.
- `EASE.{out, in, inOut, back, linear}`, `sec(s)`: seconds to frames.

**`Stage.tsx`**: `<Stage bg cam={{x, y, zoom, rot}} boil={3.2} overlay={html}>{svg children}</Stage>`
- `cam` pans, zooms and rotates around the frame center.
- `boil` is the displacement strength in px: about 2–3.5 for normal shots, 0 for motion-blur shots, 5 for frantic shots. The noise reseeds every 3 real frames (it keeps boiling even when time is overridden).
- Draw backgrounds oversized (e.g. `x=-200 width=1500`) so the displacement and camera never expose the edges.

**`Caption.tsx`**: `<Captions words={Word[]} y={1568} size={56} />`, with `Word = {w, s, e}` in seconds. Mounted once at the root, above all shots.

**`Fonts.tsx`**: call `useFonts()` once in the video root; it blocks rendering until the fonts load. Fonts: `CAPTION_FONT` (Montserrat 900) and `HAND_FONT` (Permanent Marker), both loaded from `public/fonts`.

**`shapes.tsx`**
- `<Limb d w color outline=6 />`: outlined tube along any path.
- `arm2(x, y, a1, l1, a2, l2) → {d, elbow, hand}`: two-segment limb from angles (degrees).
- `<SkyGround horizon=1180 sky ground tilt seed />`: side-view world with specks.
- `<Shadow x y rx ry o />`: contact shadow.
- `<Arrow len=260 scale headless />`: points +x, centered; use `headless` for arrows stuck in things.
- `<Bow len=170 bend=46 draw=0..1 strokeW color />`: grip at the origin, belly toward +x, string pulled toward −x by `draw`.
- `<Sword len scale />`: points up (−y), hilt at the origin.
- `<Eye x y r rx look=[dx,dy] lid=0..1 lidAngle lidColor pupil />`: `look` is in eye-radius units; `lidColor` must match the skin.
- `<SquintEye x y s flip />`: ">"-shaped squint.

**`fx.tsx`**
- `<FlyingArrow f a b from to len />`: visible only during frames [a, b), with a speed streak.
- `<PixelBurst f start x y w h colors seed />`: game death. It runs backwards correctly under a reversed `TimeOverride`.
- `<Splat x y r color seed spikes />`: spiky paint blob with droplets; animate `r`.
- `<OldFilmOverlay f glitch=0..1 />`: HTML overlay (vignette, colored glitch bars, rounded CRT mask). Pair it with a CSS `filter: grayscale(1)` wrapper.
- `<Letterbox amount />`: black bars of `amount` px.

**Characters**
- `KnightGuard {eyes: 'slit'|'angry'|'alarmed'|'squint', swordAngle, armLift, stuck: {x,y,a,len}[], look}`: front guard pose.
- `KnightSide {eyes, look, stuck, sword (swing angle), thumb}`: side view facing left.
- `Skinny {view: 'side'|'front', face: {eyes: 'open'|'squint'|'big'|'happy'|'none', look, lid, lidAngle, mouth: 'flat'|'smile'|'grin'|'o'|'frown'|'wavy'|'none'}, legs: 'stand'|'squat'|'wide'|'kneel', height=440, width=120, lean, squash, behind, children, color, dashed}`. Arms and props go in `children`; shoulders are at about (±50, height·0.65).
- `Buff {fill, eye: 'slit'|'wide'|'none', legs: 'stand'|'wide'|'step', lean, behind, children}`: shoulders at about (−80…95, −520), head block −44…64 × −708…−520. `fill="#050505"` gives a silhouette with no outline.
- `BuffArm {d, fill, w=62}`, `Fist {x, y, r=40, fill, a}`.

## 4.4 Adding a new video

1. Create `src/videos/<slug>/` with `words.ts`, `shots.ts`, `sfx.ts` and `scenes/`.
2. Copy `Archers.tsx` to `<Name>.tsx`. Point it at the new SHOTS/SFX/WORDS, set the duration from the last word's end plus about 0.25s, and add `<Audio src={staticFile('vo/<slug>.wav')} />` if there's a voiceover.
3. Register it in `src/Root.tsx`: `<Composition id="<Name>" component={…} durationInFrames={…} fps={FPS} width={W} height={H} />`.
4. Add a palette object for the new world (a new `C` variant or a per-video `theme.ts`). Don't mutate the shared `C` if other videos use it.
5. New characters go in `src/characters/`, following the puppet pattern: body drawn by the component, limbs and props as `children`, feet-origin coordinates, optional `fill` override for silhouettes.
6. Render with `npx remotion render <Name> out/<slug>.mp4 --browser-executable=…`.

## 4.5 Patterns to copy

- **Projectile then stuck:** keep a list of hits `{a, b, from, at}`. Render `FlyingArrow` for in-flight ones and add `at` to the target's `stuck` list once `f >= b`. Shake on `b`.
- **Expression timeline:** `const face = step(f, [[0, {...}], [9, {...}], [17, {...}]])`.
- **Action cycle:** loop over cycle start frames; inside each, branch on `t = f - c` for reach / carry / draw / release phases (see `BuffShootShot`).
- **Replay or rewind:** `<At frame={44 - f * 2}><GameShot/></At>`, wrapped in a grayscale filter plus `OldFilmOverlay`.
- **Iris:** an even-odd path (frame rect plus circle) filled black, with the radius animated by `track`.
- **Global to local conversion** for interaction between characters: `local = ((x - X) / S, (y - Y) / S)` (see `toBuff`).

---

# Part 5. Environment gotchas

- **Browser:** Remotion must use the preinstalled headless shell: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`. It's already in `package.json` scripts. Don't let Remotion download Chrome.
- **Package versions:** pin versions at least two weeks old. Check with `npm view <pkg> time --json`.
- **Fonts:** bundled locally (`public/fonts`), so renders are offline and deterministic. Load them through `FontFace` + `delayRender`. TypeScript's DOM lib lacks `document.fonts.add` typing, hence the cast in `Fonts.tsx`.
- **SVG text** uses the loaded family names directly (`fontFamily={HAND_FONT}`).
- **Python:** there is no scipy. `make_sfx.py` has its own biquad. Run Python that reads downloaded files with `-I`.
- **faster-whisper + PyAV:** pass a numpy array, not a file path (see Part 2).
- **Render speed:** about 20s for a 0.4-scale preview of 6s; about 90s for the full 25.8s at 1080p. Use `--frames=a-b` to render one shot while iterating.
- **Concurrency:** 4 in `remotion.config.ts`. Raise it if the machine has more cores.
- **Committed vs. ignored:** `out/` is git-ignored. Don't commit renders or reference videos. Do commit `public/sfx/*.wav` so renders don't depend on running Python.
- **Scene detection** misses cuts between similar shots. Always confirm with timestamped 4fps sheets.

---

# Part 6. Known weaknesses and roadmap

**Weak spots in the current `Archers` build**
- **Organic drawing:** the finger-on-chin close-up and the back-view axe guy are more geometric than the reference.
- **Spotlight silhouettes:** a pear body with posed arms, not real crouched muscle poses.
- **Ending:** the final flame is a single shrinking shape, not animated drips.
- **Audio:** no voiceover or music. The pacing feels empty without narration.

**High-value improvements, in priority order**
1. **Voiceover support:** a `vo/` folder and an `<Audio>` in the root. Optionally, a TTS step in `scripts/` when an API is available.
2. **Pose library:** named arm and leg poses per character (`POSES.skinny.aim`, `.strain`, `.flex`) instead of inline path strings. This is the biggest speed-up for new videos.
3. **Lip flap:** toggle the mouth between 'o' and 'flat' on word onsets from `words.ts` when a character is the speaker.
4. **Shared shot templates:** generalize `TitleCard`, `RewindShot`, `SpotlightShot` and `GameShot` into props-driven templates in `src/lib/shots/`, so a new video composes them with new characters.
5. **Per-video theme:** a `theme` prop or context instead of the single global `C`.
6. **Motion blur:** for whip pans and projectiles, use SVG `feGaussianBlur` with `stdDeviation="X 0"` along the motion direction.
7. **Chromatic aberration:** duplicate a layer into red and blue channels with small offsets (currently faked on the bow drop only).
8. **Music bed:** generate a quiet loop (kick on beats, sub bass) in `make_sfx.py`, ducked under the voiceover.
9. **Automated QA:** a script that renders contact sheets for every shot and flags shots where no pixels change for more than 30 frames.

---

# Part 7. Rules and ethics

- **Practice recreations stay private.** `Archers` reproduces another channel's script and designs. Never publish it or derive monetized content from it.
- **Original videos:** use your own scripts, your own characters (archetypes are fine, specific designs are not), and your own or properly licensed voice. All SFX here are synthesized, so they're yours.
- **Facts:** check every factual claim before scripting. The confident tone makes errors more harmful, and comment sections will catch them.
- **Violence:** keep it cartoon-abstract and off-screen, like the reference's black-screen ending.
