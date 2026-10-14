"""Synthesise every sound effect for the shorts from scratch (numpy only).

Run: python3 scripts/make_sfx.py  -> writes public/sfx/*.wav
Each effect is built from a few primitives: filtered noise, pitch-swept
oscillators, a Karplus-Strong plucked string, and a cheap reverb.
"""

import math
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sfx')
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- primitives

def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def noise(dur):
    return rng.uniform(-1, 1, int(dur * SR))


def env(dur, attack=0.005, decay=None, curve=4.0):
    """Fast attack, exponential-ish decay over the whole duration."""
    t = t_axis(dur)
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    d = np.exp(-curve * t / (decay or dur))
    return a * d


def bell(dur, peak=0.5, width=0.18):
    t = t_axis(dur) / dur
    return np.exp(-((t - peak) ** 2) / (2 * width ** 2))


def sweep(dur, f0, f1, shape='sine', exp=True):
    t = t_axis(dur)
    if exp:
        f = f0 * (f1 / f0) ** (t / dur)
    else:
        f = f0 + (f1 - f0) * t / dur
    ph = 2 * np.pi * np.cumsum(f) / SR
    if shape == 'square':
        return np.sign(np.sin(ph))
    if shape == 'saw':
        return 2 * ((ph / (2 * np.pi)) % 1) - 1
    if shape == 'tri':
        return 2 * np.abs(2 * ((ph / (2 * np.pi)) % 1) - 1) - 1
    return np.sin(ph)


def biquad(x, kind, freq, q=0.707):
    """RBJ biquad; freq may be a scalar or a per-sample array (swept filter)."""
    n = len(x)
    freq = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    y = np.zeros(n)
    x1 = x2 = y1 = y2 = 0.0
    step = 64  # recompute coefficients every 64 samples
    for i0 in range(0, n, step):
        w0 = 2 * math.pi * min(freq[i0], SR * 0.45) / SR
        alpha = math.sin(w0) / (2 * q)
        cw = math.cos(w0)
        if kind == 'lp':
            b0, b1, b2 = (1 - cw) / 2, 1 - cw, (1 - cw) / 2
        elif kind == 'hp':
            b0, b1, b2 = (1 + cw) / 2, -(1 + cw), (1 + cw) / 2
        else:  # band-pass, constant peak gain
            b0, b1, b2 = alpha, 0.0, -alpha
        a0, a1, a2 = 1 + alpha, -2 * cw, 1 - alpha
        b0, b1, b2, a1, a2 = b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0
        for i in range(i0, min(i0 + step, n)):
            xi = x[i]
            yi = b0 * xi + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
            x2, x1, y2, y1 = x1, xi, y1, yi
            y[i] = yi
    return y


def pluck(dur, freq, damp=0.996, bright=0.5):
    """Karplus-Strong string."""
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p) * bright + (1 - bright) * np.sin(np.linspace(0, np.pi, p))
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


def reverb(x, mix=0.25, size=1.0):
    """Four parallel feedback combs: cheap room tail."""
    out = np.zeros(len(x) + int(SR * 0.6 * size))
    xx = np.concatenate([x, np.zeros(len(out) - len(x))])
    for d_ms, g in ((29.7, 0.77), (37.1, 0.74), (41.1, 0.71), (43.7, 0.69)):
        d = int(SR * d_ms / 1000 * size)
        y = xx.copy()
        for i in range(d, len(y)):
            y[i] += g * y[i - d]
        out += y
    out = out / 4
    return np.concatenate([x, np.zeros(len(out) - len(x))]) * (1 - mix) + out * mix


def mix(*parts):
    n = max(len(p) for p in parts)
    out = np.zeros(n)
    for p in parts:
        out[: len(p)] += p
    return out


def delay(x, sec):
    return np.concatenate([np.zeros(int(sec * SR)), x])


def metal(dur, partials, decay):
    t = t_axis(dur)
    return sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / (decay * k)) for f, a, k in partials)


def save(name, x, peak=0.89):
    x = np.asarray(x, dtype=float)
    fade = min(len(x), int(0.01 * SR))
    x[-fade:] *= np.linspace(1, 0, fade)
    m = np.max(np.abs(x)) or 1
    x = x / m * peak
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, f'{name}.wav'), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())
    print(f'{name:14s} {len(x) / SR:5.2f}s')


# ---------------------------------------------------------------- effects

def whoosh(dur=0.35, f0=600, f1=3000, q=1.2):
    t = t_axis(dur)
    f = f0 * (f1 / f0) ** (t / dur)
    return biquad(noise(dur), 'bp', f, q) * bell(dur, 0.55, 0.22)


def thud(dur=0.35, f0=140, f1=45):
    body = sweep(dur, f0, f1) * env(dur, 0.002, dur * 0.5, 5)
    click = biquad(noise(0.03), 'lp', 2500) * env(0.03, 0.001)
    return mix(body, click * 0.6)


def tink():
    return mix(
        metal(0.5, [(2350, 1, 1), (3720, 0.6, 0.7), (5480, 0.4, 0.5), (1180, 0.3, 1.2)], 0.12),
        biquad(noise(0.02), 'hp', 3000) * env(0.02, 0.0005),
    )


def twang():
    s = pluck(0.6, 98, 0.994, 0.7)
    bend = np.interp(np.arange(len(s)) * 1.0, [0, len(s)], [0, 0])  # keep simple
    return mix(s * env(0.6, 0.001, 0.4, 3) + bend, thud(0.12, 220, 90) * 0.5)


def creak(dur=0.9):
    # stick-slip: irregular impulses through a wooden resonance
    n = int(dur * SR)
    x = np.zeros(n)
    i = 0
    while i < n:
        x[i] = rng.uniform(0.5, 1)
        i += int(SR / rng.uniform(70, 140))
    y = biquad(x, 'bp', 650, 6) + biquad(x, 'bp', 1400, 8) * 0.5
    return y * bell(dur, 0.5, 0.3)


def hit8():
    a = sweep(0.14, 330, 90, 'square') * env(0.14, 0.001, 0.14, 2)
    return mix(a, thud(0.12, 200, 60) * 0.6)


def pixel_poof():
    notes = [880, 660, 523, 392, 330, 262]
    out = []
    for k, f in enumerate(notes):
        seg = sweep(0.05, f, f, 'square') * env(0.05, 0.001, 0.05, 1.5) * (1 - k * 0.1)
        out.append(seg)
    arp = np.concatenate(out)
    crackle = biquad(noise(0.45), 'hp', 2000) * (rng.uniform(0, 1, int(0.45 * SR)) > 0.97) * env(0.45, 0.001)
    return mix(arp * 0.7, crackle * 0.8)


def boom():
    return reverb(mix(sweep(1.2, 110, 32) * env(1.2, 0.003, 0.6, 3), biquad(noise(0.25), 'lp', 400) * env(0.25, 0.002)), 0.2)


def scribble(dur=0.7):
    n = int(dur * SR)
    strokes = np.zeros(n)
    i = 0
    while i < n:
        ln = int(rng.uniform(0.04, 0.11) * SR)
        strokes[i : i + ln] = np.sin(np.linspace(0, np.pi, len(strokes[i : i + ln])))
        i += ln + int(rng.uniform(0.01, 0.04) * SR)
    return biquad(noise(dur), 'bp', 3200, 0.9) * strokes


def rewind(dur=1.37):
    t = t_axis(dur)
    chirp_f = 300 + 1600 * ((t * 7.5) % 1) ** 1.5
    ph = 2 * np.pi * np.cumsum(chirp_f) / SR
    chirps = np.sin(ph) * 0.35
    hiss = biquad(noise(dur), 'bp', 2500 + 1500 * np.sin(t * 9), 0.7) * 0.6
    warble = sweep(dur, 160, 900, 'saw') * 0.12
    return (chirps + hiss + warble) * np.clip(t / 0.05, 0, 1)


def glitch(dur=0.28):
    out = np.zeros(0)
    while len(out) < dur * SR:
        seg = sweep(rng.uniform(0.015, 0.05), rng.uniform(80, 1800), rng.uniform(80, 1800), 'square')
        out = np.concatenate([out, seg * rng.uniform(0.3, 1)])
    bits = np.round(out * 4) / 4
    return bits[: int(dur * SR)]


def strain(dur=0.75):
    t = t_axis(dur)
    f = 260 + 60 * t / dur + 22 * np.sin(2 * np.pi * 13 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    v = np.sign(np.sin(ph)) * 0.5 + np.sin(2 * ph) * 0.3
    return biquad(v, 'lp', 1400) * bell(dur, 0.5, 0.35)


def sparkle():
    out = np.zeros(int(0.9 * SR))
    for k, f in enumerate([2093, 2637, 3136, 4186, 3520]):
        tone = metal(0.5, [(f, 1, 1), (f * 2.01, 0.3, 0.5)], 0.12)
        st = int(k * 0.06 * SR)
        out[st : st + len(tone)] += tone * (1 - k * 0.12)
    return reverb(out, 0.3)


def pop():
    return sweep(0.08, 900, 220) * env(0.08, 0.001, 0.08, 3)


def poof():
    return biquad(noise(0.35), 'lp', np.linspace(3000, 300, int(0.35 * SR))) * env(0.35, 0.004, 0.35, 4)


def splat():
    wet = mix(*[delay(sweep(0.07, rng.uniform(500, 900), 120) * env(0.07, 0.001), rng.uniform(0, 0.12)) for _ in range(5)])
    return mix(biquad(noise(0.4), 'lp', 1800) * env(0.4, 0.002, 0.25, 5), wet * 0.5, thud(0.2, 120, 50) * 0.6)


def spot_clunk():
    return reverb(mix(thud(0.3, 90, 50), biquad(noise(0.04), 'bp', 1200, 2) * env(0.04, 0.001)), 0.45, 1.6)


def whip():
    return whoosh(0.28, 400, 6000, 0.9)


def arrow_rain():
    whistle = sweep(0.18, 2600, 900) * bell(0.18, 0.6, 0.25) * 0.4
    return mix(whistle, delay(thud(0.2, 160, 70), 0.17))


def iris():
    return sweep(0.45, 900, 90, 'tri') * env(0.45, 0.005, 0.45, 2)


def slam():
    return mix(thud(0.4, 160, 40), biquad(noise(0.06), 'lp', 3000) * env(0.06, 0.001) * 0.7)


def bow_drop():
    wood = mix(*[delay(biquad(noise(0.08), 'bp', 400 + 300 * k, 4) * env(0.08, 0.001), 0.05 * k) for k in range(3)])
    return mix(thud(0.5, 110, 40), wood * 0.8)


def axe_draw():
    scrape = biquad(noise(0.5), 'bp', np.linspace(1500, 5000, int(0.5 * SR)), 3) * bell(0.5, 0.4, 0.25)
    ring = metal(1.0, [(3100, 1, 1), (4700, 0.6, 0.8), (6300, 0.3, 0.6)], 0.35)
    return mix(scrape, delay(ring * 0.5, 0.3))


def shing():
    return reverb(mix(metal(1.3, [(2800, 1, 1), (4200, 0.7, 0.8), (5600, 0.5, 0.6), (8400, 0.3, 0.4)], 0.4), whoosh(0.25, 3000, 9000) * 0.5), 0.3)


def impact():
    body = mix(thud(0.9, 120, 30), biquad(noise(0.5), 'lp', 1200) * env(0.5, 0.001, 0.3, 4))
    crushed = np.round(body * 6) / 6
    return reverb(crushed, 0.35, 1.3)


def main():
    save('whoosh', whoosh())
    save('arrow', whoosh(0.22, 1800, 600, 2.5))
    save('tink', tink())
    save('twang', twang())
    save('creak', creak())
    save('hit8', hit8())
    save('pixel', pixel_poof())
    save('boom', boom())
    save('scribble', scribble())
    save('rewind', rewind())
    save('glitch', glitch())
    save('strain', strain())
    save('sparkle', sparkle())
    save('pop', pop())
    save('poof', poof())
    save('splat', splat())
    save('clunk', spot_clunk())
    save('whip', whip())
    save('rain', arrow_rain())
    save('iris', iris())
    save('slam', slam())
    save('thud', thud(0.4))
    save('bowdrop', bow_drop())
    save('axedraw', axe_draw())
    save('shing', shing())
    save('impact', impact())
    save('swing', whoosh(0.3, 300, 1800, 1.0))


if __name__ == '__main__':
    main()
