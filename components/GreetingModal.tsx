import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2 } from 'lucide-react';
import { useSettingsStore } from '../store/musicStore';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { useTranslation } from '../hooks/useTranslation';

export default function GreetingModal() {
  const { hasSeenGreeting, setHasSeenGreeting } = useSettingsStore();
  const { playGreeting } = useAudioEngine();
  const { t } = useTranslation();

  const handleEnter = () => {
    playGreeting();
    setHasSeenGreeting(true);
  };

  if (hasSeenGreeting) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: 'rgba(5,0,10,0.97)' }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                width: 200 + i * 50,
                height: 200 + i * 50,
                background: `radial-gradient(circle, rgba(${120 + i * 20},${50 + i * 10},247,0.8), transparent)`,
                left: `${10 + i * 20}%`,
                top: `${10 + i * 15}%`,
              }}
            />
          ))}
        </div>

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', damping: 20 }}
          className="relative text-center px-10 py-12 rounded-3xl glass-strong max-w-sm mx-4 glow-lg"
        >
          {/* Logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center glow-lg"
            style={{ background: 'linear-gradient(135deg, #581c87, #7c3aed, #a855f7)' }}
          >
            <Music2 size={36} className="text-white" />
          </motion.div>

          <motion.h1
            className="font-display text-2xl font-bold mb-1 gradient-text"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            ULTIMATE
          </motion.h1>
          <motion.h1
            className="font-display text-2xl font-bold mb-2 gradient-text"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            PURPLE MUSIC
          </motion.h1>

          <p className="text-purple-300/70 text-sm font-body mb-8 leading-relaxed">
            Your premium music experience with royal purple aesthetic
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168,85,247,0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className="w-full py-4 rounded-2xl font-semibold text-white font-body transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)' }}
          >
            Enter the Experience ✨
          </motion.button>

          <p className="text-purple-500/40 text-xs mt-4 font-body">
            Sound will play upon entering
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
