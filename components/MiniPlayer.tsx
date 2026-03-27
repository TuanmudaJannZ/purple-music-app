import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Repeat1, Heart, ChevronUp, X, Music
} from 'lucide-react';
import { usePlayerStore, useLibraryStore } from '../store/musicStore';
import { useSettingsStore } from '../store/musicStore';
import { useLyrics } from '../hooks/useLyrics';
import { useTranslation } from '../hooks/useTranslation';

export default function MiniPlayer() {
  const {
    currentSong, isPlaying, currentTime, duration, volume, isMuted,
    isShuffled, repeatMode, togglePlay, setCurrentTime, setDuration,
    setVolume, toggleMute, toggleShuffle, cycleRepeat, nextSong, prevSong, setIsPlaying,
  } = usePlayerStore();
  const { toggleLike, isLiked, addToRecent } = useLibraryStore();
  const { animationsEnabled } = useSettingsStore();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [simTime, setSimTime] = useState(0);
  const { lines: lyricsLines, currentLineIndex } = useLyrics(currentSong?.lyrics, simTime);
  const lyricsRef = useRef<HTMLDivElement>(null);

  const liked = currentSong ? isLiked(currentSong.id) : false;

  // Simulate playback time (for lyrics sync, since YouTube iframe doesn't expose time easily)
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setSimTime((t) => t + 0.5);
        setCurrentTime(simTime);
      }, 500);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [isPlaying, simTime]);

  // Reset time on song change
  useEffect(() => {
    setSimTime(0);
    if (currentSong) addToRecent(currentSong);
  }, [currentSong?.id]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (lyricsRef.current && currentLineIndex >= 0) {
      const lines = lyricsRef.current.querySelectorAll('.lyrics-line');
      if (lines[currentLineIndex]) {
        lines[currentLineIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLineIndex]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (simTime / duration) * 100 : 0;

  if (!currentSong) return null;

  return (
    <>
      {/* Expanded fullscreen player */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-50 glass-strong overflow-hidden flex flex-col"
            style={{ background: 'rgba(10,0,16,0.95)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pt-8">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setExpanded(false)}>
                <ChevronUp size={24} className="text-purple-400" />
              </motion.button>
              <p className="text-xs uppercase tracking-widest text-purple-400 font-body">
                {t('nowPlaying')}
              </p>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowLyrics(!showLyrics)}
                className={`text-xs px-3 py-1 rounded-full glass ${showLyrics ? 'text-purple-300 glow-sm' : 'text-purple-500'}`}
              >
                {t('lyrics')}
              </motion.button>
            </div>

            {/* YouTube iframe (hidden) */}
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
              allow="autoplay; encrypted-media"
              className="hidden"
              id="yt-player"
            />

            {/* Artwork / Lyrics */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">
              {showLyrics && lyricsLines.length > 0 ? (
                <div ref={lyricsRef} className="w-full max-w-sm max-h-80 overflow-y-auto text-center scrollbar-hide">
                  {lyricsLines.map((line, i) => (
                    <motion.p
                      key={i}
                      animate={{
                        scale: i === currentLineIndex ? 1.1 : 1,
                        color: i === currentLineIndex ? '#c084fc' : 'rgba(168,85,247,0.4)',
                      }}
                      className="lyrics-line text-base font-medium py-2 font-body transition-all"
                    >
                      {line.text}
                    </motion.p>
                  ))}
                </div>
              ) : (
                <motion.div
                  animate={isPlaying && animationsEnabled ? { rotate: 360 } : {}}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden glow-lg relative"
                  style={{ border: '3px solid rgba(168,85,247,0.4)' }}
                >
                  <img src={currentSong.thumbnail} alt={currentSong.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(88,28,135,0.3) 100%)'
                  }} />
                  {/* Vinyl center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full glass-strong flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-purple-400 glow-sm" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Song info */}
            <div className="px-6 text-center mb-4">
              <h2 className="text-lg font-semibold text-purple-100 font-body truncate">{currentSong.title}</h2>
              <p className="text-sm text-purple-400 font-body">{currentSong.artist}</p>
            </div>

            {/* Progress bar */}
            <div className="px-6 mb-4">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={simTime}
                onChange={(e) => setSimTime(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-purple-500 mt-1 font-body">
                <span>{formatTime(simTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="px-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <motion.button whileTap={{ scale: 0.85 }} onClick={toggleShuffle}
                  className={isShuffled ? 'text-purple-400' : 'text-purple-600'}>
                  <Shuffle size={20} />
                </motion.button>

                <motion.button whileTap={{ scale: 0.85 }} onClick={prevSong} className="text-purple-300">
                  <SkipBack size={28} />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full flex items-center justify-center glow-lg"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                >
                  {isPlaying
                    ? <Pause size={28} className="text-white" />
                    : <Play size={28} className="text-white fill-white ml-1" />}
                </motion.button>

                <motion.button whileTap={{ scale: 0.85 }} onClick={nextSong} className="text-purple-300">
                  <SkipForward size={28} />
                </motion.button>

                <motion.button whileTap={{ scale: 0.85 }} onClick={cycleRepeat}
                  className={repeatMode !== 'none' ? 'text-purple-400' : 'text-purple-600'}>
                  {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
                </motion.button>
              </div>

              {/* Volume + Like */}
              <div className="flex items-center gap-3">
                <motion.button whileTap={{ scale: 0.85 }} onClick={toggleMute} className="text-purple-400">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </motion.button>
                <input
                  type="range" min={0} max={1} step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1"
                />
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleLike(currentSong)}
                  className={liked ? 'text-purple-400' : 'text-purple-600'}
                >
                  <Heart size={20} className={liked ? 'fill-purple-400' : ''} />
                </motion.button>
              </div>
            </div>

            <div className="pb-8" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini player bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-purple-800/30"
      >
        <div className="max-w-screen-xl mx-auto px-3 py-2.5 flex items-center gap-3">
          {/* Thumbnail + info */}
          <div
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 glow-sm">
              <img src={currentSong.thumbnail} alt={currentSong.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-purple-100 truncate font-body">{currentSong.title}</p>
              <p className="text-xs text-purple-400 truncate font-body">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <motion.button whileTap={{ scale: 0.85 }} onClick={prevSong} className="p-2 text-purple-400">
              <SkipBack size={18} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-9 h-9 rounded-full flex items-center justify-center glow-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              {isPlaying
                ? <Pause size={16} className="text-white" />
                : <Play size={16} className="text-white fill-white ml-0.5" />}
            </motion.button>

            <motion.button whileTap={{ scale: 0.85 }} onClick={nextSong} className="p-2 text-purple-400">
              <SkipForward size={18} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => toggleLike(currentSong)}
              className={`p-2 hidden sm:block ${liked ? 'text-purple-400' : 'text-purple-600'}`}
            >
              <Heart size={16} className={liked ? 'fill-purple-400' : ''} />
            </motion.button>
          </div>

          {/* Expand button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setExpanded(true)}
            className="p-2 text-purple-500 hidden md:block"
          >
            <ChevronUp size={18} />
          </motion.button>
        </div>

        {/* Progress line */}
        <div className="h-0.5 bg-purple-900/30">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
            }}
          />
        </div>
      </motion.div>
    </>
  );
}
