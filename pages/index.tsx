import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import SongCard from '../components/SongCard';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { useLibraryStore } from '../store/musicStore';
import { useTranslation } from '../hooks/useTranslation';

const SkeletonCard = () => (
  <div className="glass rounded-2xl overflow-hidden">
    <div className="aspect-video skeleton" />
    <div className="p-3 space-y-2">
      <div className="h-3 skeleton rounded w-3/4" />
      <div className="h-2.5 skeleton rounded w-1/2" />
    </div>
  </div>
);

export default function HomePage() {
  const { results, isLoading, getTrending, demoSongs } = useYouTubeSearch();
  const { recentlyPlayed } = useLibraryStore();
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    getTrending();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning ☀️');
    else if (hour < 17) setGreeting('Good Afternoon 🌤️');
    else setGreeting('Good Evening 🌙');
  }, []);

  const trending = results.length ? results : demoSongs;

  return (
    <Layout>
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-10 md:pt-0"
        >
          <p className="text-purple-400 text-sm font-body mb-1">{greeting}</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text text-glow">
            {t('welcomeBack')}
          </h1>
        </motion.div>

        {recentlyPlayed.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-purple-400" />
              <h2 className="text-sm font-semibold text-purple-200 uppercase tracking-wider font-display">
                {t('recentlyPlayed')}
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {recentlyPlayed.slice(0, 8).map((song, i) => (
                <motion.div key={song.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex-shrink-0 w-40">
                  <SongCard song={song} index={i} queue={recentlyPlayed} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-3xl p-6 mb-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.8) 0%, rgba(168,85,247,0.4) 50%, transparent 100%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-xs uppercase tracking-widest text-purple-400 font-body">{t('featured')}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-purple-100 mb-1">Ultimate Purple Music</h2>
            <p className="text-sm text-purple-300/70 font-body max-w-xs">Experience music like never before with premium audio quality and stunning visuals.</p>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent)', filter: 'blur(10px)' }} />
        </motion.div>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-purple-400" />
            <h2 className="text-sm font-semibold text-purple-200 uppercase tracking-wider font-display">{t('trending')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {isLoading
              ? [...Array(10)].map((_, i) => <SkeletonCard key={i} />)
              : trending.map((song, i) => <SongCard key={song.id} song={song} index={i} queue={trending} />)}
          </div>
        </section>
      </div>
    </Layout>
  );
}
