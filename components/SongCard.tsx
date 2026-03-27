import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Plus, Download, MoreHorizontal } from 'lucide-react';
import { Song, usePlayerStore, useLibraryStore } from '../store/musicStore';
import { useTranslation } from '../hooks/useTranslation';

interface SongCardProps {
  song: Song;
  index?: number;
  variant?: 'card' | 'row';
  queue?: Song[];
}

export default function SongCard({ song, index = 0, variant = 'card', queue }: SongCardProps) {
  const { setCurrentSong, setQueue, setIsPlaying, addToQueue } = usePlayerStore();
  const { toggleLike, isLiked } = useLibraryStore();
  const { t } = useTranslation();
  const liked = isLiked(song.id);

  const handlePlay = () => {
    if (queue) setQueue(queue);
    setCurrentSong(song, queue ? queue.findIndex((s) => s.id === song.id) : 0);
    setIsPlaying(true);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/song/${song.youtubeId}`;
    navigator.clipboard.writeText(url);
  };

  if (variant === 'row') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ backgroundColor: 'rgba(88,28,135,0.2)' }}
        className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group transition-all duration-200"
        onClick={handlePlay}
      >
        {/* Thumbnail */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <Play size={16} className="text-white fill-white" />
          </motion.div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-purple-100 truncate font-body">{song.title}</p>
          <p className="text-xs text-purple-400 truncate font-body">{song.artist}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
            className={`p-1.5 rounded-lg transition-colors ${liked ? 'text-purple-400' : 'text-purple-600 hover:text-purple-400'}`}
          >
            <Heart size={14} className={liked ? 'fill-purple-400' : ''} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); addToQueue(song); }}
            className="p-1.5 rounded-lg text-purple-600 hover:text-purple-400 transition-colors"
          >
            <Plus size={14} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass rounded-2xl overflow-hidden cursor-pointer group relative"
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Play overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full glass-strong flex items-center justify-center glow-md">
            <Play size={18} className="text-white fill-white ml-0.5" />
          </div>
        </motion.div>

        {/* Like button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
          className="absolute top-2 right-2 p-2 rounded-full glass"
        >
          <Heart
            size={14}
            className={liked ? 'text-purple-400 fill-purple-400' : 'text-purple-300'}
          />
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-purple-100 truncate font-body">{song.title}</p>
        <p className="text-xs text-purple-400 truncate font-body mt-0.5">{song.artist}</p>
      </div>

      {/* Bottom gradient glow on hover */}
      <div
        className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}
      />
    </motion.div>
  );
}
