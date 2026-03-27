import { useRef, useEffect, useCallback, useState } from 'react';
import { usePlayerStore } from '../store/musicStore';
import { useSettingsStore } from '../store/musicStore';

export interface EQSettings {
  bass: number;   // -12 to 12 dB
  mid: number;
  treble: number;
  volumeNormalization: boolean;
}

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);

  const [eqSettings, setEQSettings] = useState<EQSettings>({
    bass: 0,
    mid: 0,
    treble: 0,
    volumeNormalization: true,
  });

  const { volume, isMuted, setCurrentTime, setDuration, setIsPlaying, nextSong, currentSong } =
    usePlayerStore();
  const { audioQuality } = useSettingsStore();

  // Initialize Web Audio API
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    const bass = ctx.createBiquadFilter();
    const mid = ctx.createBiquadFilter();
    const treble = ctx.createBiquadFilter();

    bass.type = 'lowshelf';
    bass.frequency.value = 200;
    mid.type = 'peaking';
    mid.frequency.value = 1000;
    mid.Q.value = 1;
    treble.type = 'highshelf';
    treble.frequency.value = 4000;

    // Connect chain: source -> bass -> mid -> treble -> gain -> destination
    bass.connect(mid);
    mid.connect(treble);
    treble.connect(gain);
    gain.connect(ctx.destination);

    audioContextRef.current = ctx;
    gainNodeRef.current = gain;
    bassFilterRef.current = bass;
    midFilterRef.current = mid;
    trebleFilterRef.current = treble;
  }, []);

  // Apply EQ settings
  const applyEQ = useCallback((settings: Partial<EQSettings>) => {
    const newSettings = { ...eqSettings, ...settings };
    setEQSettings(newSettings);

    if (bassFilterRef.current) bassFilterRef.current.gain.value = newSettings.bass;
    if (midFilterRef.current) midFilterRef.current.gain.value = newSettings.mid;
    if (trebleFilterRef.current) trebleFilterRef.current.gain.value = newSettings.treble;
  }, [eqSettings]);

  // Update Media Session API for lock screen controls
  const updateMediaSession = useCallback((song: { title: string; artist: string; thumbnail: string }) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: 'Ultimate Purple Music',
        artwork: [
          { src: song.thumbnail, sizes: '320x180', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => usePlayerStore.getState().setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => usePlayerStore.getState().setIsPlaying(false));
      navigator.mediaSession.setActionHandler('nexttrack', () => usePlayerStore.getState().nextSong());
      navigator.mediaSession.setActionHandler('previoustrack', () => usePlayerStore.getState().prevSong());
    }
  }, []);

  // Play greeting audio
  const playGreeting = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const utterance = new SpeechSynthesisUtterance('Welcome to Ultimate Purple Music');
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
      ctx.close();
    } catch (e) {
      console.log('Greeting audio not available');
    }
  }, []);

  // Volume control
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update media session when song changes
  useEffect(() => {
    if (currentSong) {
      updateMediaSession(currentSong);
    }
  }, [currentSong, updateMediaSession]);

  return {
    initAudioContext,
    applyEQ,
    eqSettings,
    playGreeting,
    audioQuality,
  };
}
