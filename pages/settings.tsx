import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Zap, ZapOff, Globe, Headphones, Key, Save, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Equalizer from '../components/Equalizer';
import { useSettingsStore } from '../store/musicStore';
import { useTranslation } from '../hooks/useTranslation';

export default function SettingsPage() {
  const { theme, setTheme, purpleIntensity, setPurpleIntensity, animationsEnabled, toggleAnimations,
    language, setLanguage, audioQuality, setAudioQuality, youtubeApiKey, setYoutubeApiKey } = useSettingsStore();
  const { t } = useTranslation();
  const [apiKeyInput, setApiKeyInput] = useState(youtubeApiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setYoutubeApiKey(apiKeyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-4 font-display">{title}</h3>
      {children}
    </motion.div>
  );

  const Toggle = ({ value, onToggle, label, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-purple-400" />
        <span className="text-sm text-purple-200 font-body">{label}</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="w-11 h-6 rounded-full relative transition-colors"
        style={{ background: value ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(88,28,135,0.3)' }}
      >
        <motion.div animate={{ x: value ? 22 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow" />
      </motion.button>
    </div>
  );

  return (
    <Layout>
      <div className="px-4 md:px-8 pt-6 pb-8 max-w-2xl">
        <div className="pt-10 md:pt-0 mb-6">
          <h1 className="text-2xl font-display font-bold gradient-text">{t('settings')}</h1>
        </div>

        {/* Appearance */}
        <Section title={t('appearance')}>
          {/* Theme */}
          <div className="flex items-center justify-between py-2 mb-3">
            <span className="text-sm text-purple-200 font-body">Theme</span>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((th) => (
                <motion.button
                  key={th}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(th)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-body transition-all ${
                    theme === th ? 'text-white glow-sm' : 'glass text-purple-400'
                  }`}
                  style={theme === th ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}
                >
                  {th === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                  {th === 'dark' ? t('darkMode') : t('lightMode')}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Purple intensity */}
          <div className="py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-200 font-body">{t('purpleIntensity')}</span>
              <span className="text-xs text-purple-400 font-body">{Math.round(purpleIntensity * 100)}%</span>
            </div>
            <input
              type="range" min={0.2} max={1.5} step={0.1}
              value={purpleIntensity}
              onChange={(e) => setPurpleIntensity(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-purple-600 mt-1 font-body">
              <span>Subtle</span><span>Vibrant</span><span>Intense</span>
            </div>
          </div>

          <Toggle value={animationsEnabled} onToggle={toggleAnimations}
            label={t('animations')} icon={animationsEnabled ? Zap : ZapOff} />
        </Section>

        {/* Language */}
        <Section title={t('language')}>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-purple-400" />
              <span className="text-sm text-purple-200 font-body">{t('language')}</span>
            </div>
            <div className="flex gap-2">
              {(['id', 'en'] as const).map((lang) => (
                <motion.button
                  key={lang}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-body transition-all ${
                    language === lang ? 'text-white glow-sm' : 'glass text-purple-400'
                  }`}
                  style={language === lang ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}
                >
                  {lang === 'id' ? '🇮🇩 Indonesia' : '🇺🇸 English'}
                </motion.button>
              ))}
            </div>
          </div>
        </Section>

        {/* Audio Quality */}
        <Section title={t('audioQuality')}>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Headphones size={16} className="text-purple-400" />
              <span className="text-sm text-purple-200 font-body">{t('audioQuality')}</span>
            </div>
            <div className="flex gap-2">
              {(['low', 'high'] as const).map((q) => (
                <motion.button
                  key={q}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAudioQuality(q)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-body transition-all ${
                    audioQuality === q ? 'text-white glow-sm' : 'glass text-purple-400'
                  }`}
                  style={audioQuality === q ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}
                >
                  {q === 'low' ? t('lowQuality') : t('highQuality')}
                </motion.button>
              ))}
            </div>
          </div>
        </Section>

        {/* Equalizer */}
        <div className="mb-4">
          <Equalizer />
        </div>

        {/* API Key */}
        <Section title={t('apiKey')}>
          <div className="flex items-center gap-2 mb-3">
            <Key size={14} className="text-purple-400 flex-shrink-0" />
            <span className="text-xs text-purple-400 font-body">Required for live YouTube search. Get free key at Google Cloud Console.</span>
          </div>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder={t('apiKeyPlaceholder')}
            className="w-full px-4 py-3 rounded-xl glass text-purple-200 placeholder-purple-600 font-body text-sm outline-none focus:ring-1 focus:ring-purple-500 mb-3"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-body transition-all"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
          >
            {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> {t('saveSettings')}</>}
          </motion.button>
        </Section>

        {/* App info */}
        <div className="text-center py-4">
          <p className="text-xs text-purple-500 font-body">Ultimate Purple Music v1.0.0</p>
          <p className="text-xs text-purple-600 font-body mt-1">Built with Next.js + Tailwind + Framer Motion</p>
        </div>
      </div>
    </Layout>
  );
}
