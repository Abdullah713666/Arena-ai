#!/bin/bash
# Forensic pass over a reference short.
# usage: scripts/analyze_reference.sh ref.mp4 outdir
# Produces: probe info, scene-cut times, 1fps and 4fps timestamped contact
# sheets, and mono 16 kHz audio for transcription.
set -euo pipefail
REF=$1; OUT=$2; mkdir -p "$OUT"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of compact "$REF" | tee "$OUT/probe.txt"
ffmpeg -v info -i "$REF" -vf "select='gt(scene,0.15)',showinfo" -f null - 2>&1 \
  | grep -o "pts_time:[0-9.]*" | cut -d: -f2 | tee "$OUT/cuts.txt"
ffmpeg -v error -y -i "$REF" -vf "fps=1,scale=270:-1,tile=6x2" "$OUT/sheet1fps_%02d.png"
ffmpeg -v error -y -i "$REF" -vf "fps=4,scale=240:-1,drawtext=text='%{pts\:hms}':x=4:y=4:fontsize=20:fontcolor=red:box=1,tile=8x2" "$OUT/sheet4fps_%02d.png"
ffmpeg -v error -y -i "$REF" -ac 1 -ar 16000 "$OUT/audio16k.wav"
echo "done -> $OUT"
