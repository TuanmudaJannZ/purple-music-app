import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, ListMusic, WifiOff, Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import SongCard from '../components/SongCard';
import { useLibraryStore } from '../store/musicStore';
import { useTranslation } from '../hooks/useTranslation';

type Tab = 'liked' | 'recent' | 'playlists' | 'offline';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('liked');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const { likedSongs, recentlyPlayed, playlists, addPlaylist, deletePlaylist } = useLibraryStore();
  const { t } = useTranslation();

  const tabs = [
    { id: 'liked' as Tab, icon: Heart, label: t('likedSongs'), count: likedSongs.length },
    { id: 'recent' as Tab, icon: Clock, label: t('recentlyPlayed'), count: recentlyPlayed.length },
    { id: 'playlists' as Tab, icon: ListMusic, label: t('playlists'), count: playlists.length },
    { id: 'offline' as Tab, icon: WifiOff, label: t('offlineMusic'), count: 0 },
  ];

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      addPlaylist(playlistName.trim());
      setPlaylistName('');
      setShowNewPlaylist(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 md:px-8 pt-6 pb-8">
        <div className="pt-10 md:pt-0 mb-6">
          <h1 className="text-2xl font-display font-bold gradient-text mb-6">{t('library')}</h1>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map(({ id, icon: Icon, label, count }) => (
              <motion.button
                key={id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium font-body transition-all ${
                  activeTab === id ? 'text-white glow-sm' : 'glass text-purple-400'
                }`}
                style={activeTab === id ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)' } : {}}
              >
                <Icon size={14} />
                {label}
                {count > 0 && <span className="text-xs opacity-70">({count})</span>}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeTab === 'liked' && (
              likedSongs.length === 0
                ? <EmptyState icon={Heart} message={t('noLikedSongs')} />
                : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {likedSongs.map((song, i) => <SongCard key={song.id} song={song} index={i} queue={likedSongs} />)}
                  </div>
            )}

            {activeTab === 'recent' && (
              recentlyPlayed.length === 0
                ? <EmptyState icon={Clock} message={t('noRecentSongs')} />
                : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {recentlyPlayed.map((song, i) => <SongCard key={song.id} song={song} index={i} queue={recentlyPlayed} />)}
                  </div>
            )}

            {activeTab === 'playlists' && (
              <div>
                {/* Create playlist button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowNewPlaylist(true)}
                  className="flex items-center gap-3 w-full p-4 rounded-2xl glass hover:glass-strong transition-all mb-4 group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                    <Plus size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-purple-300 font-body">{t('createPlaylist')}</span>
                </motion.button>

                {showNewPlaylist && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-4 mb-4 flex gap-3">
                    <input
                      type="text"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      placeholder={t('playlistName')}
                      className="flex-1 bg-transparent text-purple-100 placeholder-purple-500 font-body text-sm outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                      autoFocus
                    />
                    <button onClick={handleCreatePlaylist} className="text-xs px-3 py-1 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>{t('save')}</button>
                    <button onClick={() => setShowNewPlaylist(false)} className="text-purple-500 text-xs">{t('cancel')}</button>
                  </motion.div>
                )}

                {playlists.length === 0
                  ? <EmptyState icon={ListMusic} message={t('noPlaylists')} />
                  : playlists.map((pl) => (
                      <motion.div key={pl.id} whileHover={{ x: 4 }} className="flex items-center gap-3 p-3 rounded-xl glass mb-2 group">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #581c87, #7c3aed)' }}>
                          <ListMusic size={18} className="text-purple-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-purple-100 font-body">{pl.name}</p>
                          <p className="text-xs text-purple-400 font-body">{pl.songs.length} {t('songs')}</p>
                        </div>
                        <button onClick={() => deletePlaylist(pl.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
              </div>
            )}

            {activeTab === 'offline' && (
              <EmptyState icon={WifiOff} message="Songs cached offline will appear here" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
        <Icon size={24} className="text-purple-500" />
      </div>
      <p className="text-purple-400 font-body text-sm">{message}</p>
    </div>
  );
}
