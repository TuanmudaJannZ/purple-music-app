import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Song data structure
export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  thumbnail: string;
  lyrics?: string; // LRC format
  duration?: number;
}

// Player state
interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  currentIndex: number;

  // Actions
  setCurrentSong: (song: Song, index?: number) => void;
  setQueue: (songs: Song[]) => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  nextSong: () => void;
  prevSong: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (id: string) => void;
}

// Settings state
interface SettingsState {
  theme: 'dark' | 'light';
  purpleIntensity: number; // 0.3 to 1.5
  animationsEnabled: boolean;
  language: 'en' | 'id';
  audioQuality: 'low' | 'high';
  youtubeApiKey: string;
  hasSeenGreeting: boolean;

  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setPurpleIntensity: (value: number) => void;
  toggleAnimations: () => void;
  setLanguage: (lang: 'en' | 'id') => void;
  setAudioQuality: (q: 'low' | 'high') => void;
  setYoutubeApiKey: (key: string) => void;
  setHasSeenGreeting: (val: boolean) => void;
}

// Library state
interface LibraryState {
  likedSongs: Song[];
  recentlyPlayed: Song[];
  playlists: { id: string; name: string; songs: Song[] }[];
  offlineSongs: string[]; // song IDs cached offline

  // Actions
  toggleLike: (song: Song) => void;
  isLiked: (id: string) => boolean;
  addToRecent: (song: Song) => void;
  addPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, song: Song) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addOfflineSong: (id: string) => void;
  removeOfflineSong: (id: string) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  currentIndex: 0,

  setCurrentSong: (song, index = 0) => set({ currentSong: song, currentIndex: index, currentTime: 0 }),
  setQueue: (songs) => set({ queue: songs }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),
  cycleRepeat: () => set((s) => ({
    repeatMode: s.repeatMode === 'none' ? 'all' : s.repeatMode === 'all' ? 'one' : 'none'
  })),
  nextSong: () => {
    const { queue, currentIndex, isShuffled, repeatMode } = get();
    if (!queue.length) return;
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (repeatMode === 'one') {
      nextIndex = currentIndex;
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    set({ currentSong: queue[nextIndex], currentIndex: nextIndex, currentTime: 0 });
  },
  prevSong: () => {
    const { queue, currentIndex, currentTime } = get();
    if (!queue.length) return;
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({ currentSong: queue[prevIndex], currentIndex: prevIndex, currentTime: 0 });
  },
  addToQueue: (song) => set((s) => ({ queue: [...s.queue, song] })),
  removeFromQueue: (id) => set((s) => ({ queue: s.queue.filter((s) => s.id !== id) })),
}));

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      purpleIntensity: 1,
      animationsEnabled: true,
      language: 'id',
      audioQuality: 'high',
      youtubeApiKey: '',
      hasSeenGreeting: false,

      setTheme: (theme) => set({ theme }),
      setPurpleIntensity: (purpleIntensity) => set({ purpleIntensity }),
      toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
      setLanguage: (language) => set({ language }),
      setAudioQuality: (audioQuality) => set({ audioQuality }),
      setYoutubeApiKey: (youtubeApiKey) => set({ youtubeApiKey }),
      setHasSeenGreeting: (hasSeenGreeting) => set({ hasSeenGreeting }),
    }),
    { name: 'purple-music-settings' }
  )
);

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      likedSongs: [],
      recentlyPlayed: [],
      playlists: [],
      offlineSongs: [],

      toggleLike: (song) => set((s) => {
        const exists = s.likedSongs.find((l) => l.id === song.id);
        return {
          likedSongs: exists
            ? s.likedSongs.filter((l) => l.id !== song.id)
            : [song, ...s.likedSongs],
        };
      }),
      isLiked: (id) => get().likedSongs.some((s) => s.id === id),
      addToRecent: (song) => set((s) => ({
        recentlyPlayed: [song, ...s.recentlyPlayed.filter((r) => r.id !== song.id)].slice(0, 30),
      })),
      addPlaylist: (name) => set((s) => ({
        playlists: [...s.playlists, { id: Date.now().toString(), name, songs: [] }],
      })),
      addToPlaylist: (playlistId, song) => set((s) => ({
        playlists: s.playlists.map((p) =>
          p.id === playlistId && !p.songs.find((s) => s.id === song.id)
            ? { ...p, songs: [...p.songs, song] }
            : p
        ),
      })),
      removeFromPlaylist: (playlistId, songId) => set((s) => ({
        playlists: s.playlists.map((p) =>
          p.id === playlistId
            ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
            : p
        ),
      })),
      deletePlaylist: (playlistId) => set((s) => ({
        playlists: s.playlists.filter((p) => p.id !== playlistId),
      })),
      addOfflineSong: (id) => set((s) => ({ offlineSongs: [...s.offlineSongs, id] })),
      removeOfflineSong: (id) => set((s) => ({ offlineSongs: s.offlineSongs.filter((s) => s !== id) })),
    }),
    { name: 'purple-music-library' }
  )
);
