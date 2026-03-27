import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import SongCard from '../components/SongCard';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { useTranslation } from '../hooks/useTranslation';

const categories = ['All', 'Pop', 'Hip Hop', 'R&B', 'Electronic', 'Rock', 'Jazz', 'Classical', 'K-Pop', 'Indonesian'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { results, isLoading, search, demoSongs } = useYouTubeSearch();
  const { t } = useTranslation();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInput = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim()) {
      debounceRef.current = setTimeout(() => search(val), 500);
    }
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    search(cat === 'All' ? 'top hits' : cat + ' music');
  };

  const displayResults = query.trim() || activeCategory !== 'All' ? results : demoSongs;

  return (
    <Layout>
      <div className="px-4 md:px-8 pt-6 pb-8">
        <div className="pt-10 md:pt-0 mb-6">
          <h1 className="text-2xl font-display font-bold gradient-text mb-4">{t('search')}</h1>

          {/* Search input */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl glass-strong text-purple-100 placeholder-purple-500 font-body text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
            {query && (
              <button onClick={() => { setQuery(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium font-body transition-all ${
                  activeCategory === cat
                    ? 'text-white glow-sm'
                    : 'glass text-purple-400 hover:text-purple-200'
                }`}
                style={activeCategory === cat ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)' } : {}}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 size={28} className="text-purple-400" />
              </motion.div>
            </div>
          ) : displayResults.length === 0 && query ? (
            <div className="text-center py-20">
              <p className="text-purple-400 font-body">{t('noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              <AnimatePresence>
                {displayResults.map((song, i) => (
                  <SongCard key={song.id} song={song} index={i} queue={displayResults} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
