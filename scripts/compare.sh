#!/bin/bash
# Reference-vs-render contact sheet: top row reference, bottom row render.
# usage: scripts/compare.sh ref.mp4 render.mp4 out.png t1 t2 t3 ...
set -euo pipefail
REF=$1; M=$2; O=$3; shift 3
TMP=$(mktemp -d); i=0
for t in "$@"; do
  ffmpeg -v error -y -ss "$t" -i "$REF" -frames:v 1 -vf scale=216:384 "$TMP/r$i.png"
  ffmpeg -v error -y -ss "$t" -i "$M" -frames:v 1 -vf scale=216:384 "$TMP/m$i.png"
  i=$((i+1))
done
in=""; for j in $(seq 0 $((i-1))); do in="$in -i $TMP/r$j.png"; done
for j in $(seq 0 $((i-1))); do in="$in -i $TMP/m$j.png"; done
ffmpeg -v error -y $in -filter_complex "xstack=inputs=$((2*i)):grid=${i}x2" "$O"
rm -rf "$TMP"; echo "$O"
