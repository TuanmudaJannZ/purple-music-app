import { useState, useEffect, useCallback } from 'react';

export interface LrcLine {
  time: number; // seconds
  text: string;
}

// Parse LRC format: [mm:ss.xx] text
export function parseLRC(lrc: string): LrcLine[] {
  const lines = lrc.split('\n');
  const parsed: LrcLine[] = [];

  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  for (const line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const ms = parseInt(match[3]);
      const time = minutes * 60 + seconds + ms / (match[3].length === 3 ? 1000 : 100);
      const text = line.replace(/\[[\d:.]+\]/g, '').trim();
      if (text) {
        parsed.push({ time, text });
      }
    }
  }

  return parsed.sort((a, b) => a.time - b.time);
}

export function useLyrics(lrc: string | undefined, currentTime: number) {
  const [lines, setLines] = useState<LrcLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);

  useEffect(() => {
    if (lrc) {
      setLines(parseLRC(lrc));
    } else {
      setLines([]);
    }
  }, [lrc]);

  useEffect(() => {
    if (!lines.length) return;

    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= currentTime) {
        idx = i;
      } else {
        break;
      }
    }
    setCurrentLineIndex(idx);
  }, [currentTime, lines]);

  return { lines, currentLineIndex };
}

// Sample LRC for demo
export const SAMPLE_LRC = `[00:00.00] ♪ Ultimate Purple Music ♪
[00:03.00] Loading lyrics...
[00:06.00] Add .lrc lyrics in the song data
[00:09.00] to see synced lyrics here
[00:12.00] ♪ ♪ ♪`;
