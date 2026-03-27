import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Play, Share2, Heart, ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import { usePlayerStore, useLibraryStore } from '../../store/musicStore';
import { useYouTubeSearch } from '../../hooks/useYouTubeSearch';

export default function SongPage() {
  const router = useRouter();
  const { id } = router.query;
  const { demoSongs } = useYouTubeSearch();
  const { setCurrentSong, setIsPlaying, setQueue } = usePlayerStore();
  const { toggleLike, isLiked } = useLibraryStore();

  const song = demoSongs.find((s) => s.youtubeId === id) || {
    id: id as string, title: 'Song', artist: 'Artist',
    youtubeId: id as string,
    thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
  };

  const liked = isLiked(song.id);

  const handlePlay = () => {
    setQueue([song]);
    setCurrentSong(song, 0);
    setIsPlaying(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <>
      <Head>
        <title>{song.title} - Ultimate Purple Music</title>
        <meta name="description" content={`Listen to ${song.title} by ${song.artist}`} />
        <meta property="og:title" content={song.title} />
        <meta property="og:description" content={`by ${song.artist}`} />
        <meta property="og:image" content={song.thumbnail} />
      </Head>
      <Layout>
        <div className="px-4 md:px-8 pt-6 pb-8 max-w-xl">
          <div className="pt-10 md:pt-0 mb-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-purple-400 text-sm mb-6 hover:text-purple-200 transition-colors font-body">
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass-strong rounded-3xl overflow-hidden p-6">
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 glow-lg">
                <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
              </div>

              <h1 className="text-xl font-semibold text-purple-100 font-body mb-1">{song.title}</h1>
              <p className="text-purple-400 font-body mb-6">{song.artist}</p>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlay}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-body font-medium glow-md"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                >
                  <Play size={18} className="fill-white" /> Play
                </motion.button>

                <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleLike(song)}
                  className={`p-3 rounded-xl glass ${liked ? 'text-purple-400' : 'text-purple-600'}`}>
                  <Heart size={20} className={liked ? 'fill-purple-400' : ''} />
                </motion.button>

                <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare} className="p-3 rounded-xl glass text-purple-400">
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
