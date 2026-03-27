import React from 'react';
import { motion } from 'framer-motion';
import { useAudioEngine } from '../hooks/useAudioEngine';

export default function Equalizer() {
  const { eqSettings, applyEQ } = useAudioEngine();

  const bands = [
    { key: 'bass' as const, label: 'Bass', freq: '200Hz' },
    { key: 'mid' as const, label: 'Mid', freq: '1kHz' },
    { key: 'treble' as const, label: 'Treble', freq: '4kHz' },
  ];

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-purple-200 mb-4 font-display tracking-wider">
        EQUALIZER
      </h3>

      <div className="flex justify-around items-end gap-4">
        {bands.map(({ key, label, freq }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <span className="text-xs text-purple-400 font-body">
              {eqSettings[key] > 0 ? '+' : ''}{eqSettings[key]}dB
            </span>

            {/* Vertical slider */}
            <div className="relative h-28 flex items-center justify-center">
              <input
                type="range"
                min={-12}
                max={12}
                step={1}
                value={eqSettings[key]}
                onChange={(e) => applyEQ({ [key]: Number(e.target.value) })}
                className="eq-slider"
                style={{
                  writingMode: 'vertical-lr' as any,
                  direction: 'rtl',
                  width: 28,
                  height: 100,
                  cursor: 'pointer',
                  WebkitAppearance: 'slider-vertical' as any,
                  appearance: 'slider-vertical' as any,
                }}
              />
            </div>

            {/* Bar visualization */}
            <div className="flex flex-col-reverse gap-0.5">
              {[...Array(7)].map((_, i) => {
                const threshold = (i / 6) * 24 - 12;
                const active = eqSettings[key] > 0
                  ? threshold <= eqSettings[key] && threshold >= 0
                  : threshold >= eqSettings[key] && threshold <= 0;

                return (
                  <motion.div
                    key={i}
                    animate={{ opacity: active ? 1 : 0.2 }}
                    className="w-6 h-1.5 rounded-sm"
                    style={{
                      background: active
                        ? `rgba(168,85,247,${0.5 + i * 0.07})`
                        : 'rgba(88,28,135,0.3)',
                      boxShadow: active ? '0 0 6px rgba(168,85,247,0.6)' : 'none',
                    }}
                  />
                );
              })}
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold text-purple-300 font-body">{label}</p>
              <p className="text-xs text-purple-500 font-body">{freq}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Volume normalization toggle */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-800/30">
        <span className="text-xs text-purple-300 font-body">Volume Normalization</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => applyEQ({ volumeNormalization: !eqSettings.volumeNormalization })}
          className={`w-10 h-5 rounded-full relative transition-colors ${
            eqSettings.volumeNormalization ? 'bg-purple-600' : 'bg-purple-900/40'
          }`}
        >
          <motion.div
            animate={{ x: eqSettings.volumeNormalization ? 20 : 2 }}
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
          />
        </motion.button>
      </div>
    </div>
  );
}
