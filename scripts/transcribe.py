"""Word-level timestamps for a voiceover (pip install faster-whisper).

usage: python3 -I scripts/transcribe.py audio16k.wav words.json
The audio must be mono 16 kHz WAV (see analyze_reference.sh). It is passed as
a numpy array because faster-whisper's own file decoding (PyAV) broke on the
installed av version.
"""
import json
import sys
import wave

import numpy as np
from faster_whisper import WhisperModel

src, dst = sys.argv[1], sys.argv[2]
wf = wave.open(src)
audio = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768
model = WhisperModel('small.en', device='cpu', compute_type='int8')
segments, _ = model.transcribe(audio, word_timestamps=True)
words = []
for seg in segments:
    for w in seg.words:
        token = w.word.strip()
        if token.startswith('-') and words:  # "100" "-pound" -> "100-pound"
            words[-1]['w'] += token
            words[-1]['e'] = round(w.end, 2)
            continue
        words.append({'w': token, 's': round(w.start, 2), 'e': round(w.end, 2)})
json.dump(words, open(dst, 'w'), indent=1)
print(' '.join(f"{x['w']}[{x['s']}]" for x in words))
