import { useState, useCallback } from 'react';
import { Song } from '../store/musicStore';
import { useSettingsStore } from '../store/musicStore';

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium: { url: string }; high: { url: string } };
    publishedAt: string;
  };
}

// Demo songs with real YouTube IDs for testing without API key
const DEMO_SONGS: Song[] = [
  {
    id: 'demo1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    youtubeId: '4NRXx6U8ABQ',
    thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/mqdefault.jpg',
  },
  {
    id: 'demo2',
    title: 'As It Was',
    artist: 'Harry Styles',
    youtubeId: 'H5v3kku4y6Q',
    thumbnail: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg',
  },
  {
    id: 'demo3',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    youtubeId: 'G7KNmW9a75Y',
    thumbnail: 'https://i.ytimg.com/vi/G7KNmW9a75Y/mqdefault.jpg',
  },
  {
    id: 'demo4',
    title: 'Unholy',
    artist: 'Sam Smith ft. Kim Petras',
    youtubeId: 'Uq9gPaIzbe8',
    thumbnail: 'https://i.ytimg.com/vi/Uq9gPaIzbe8/mqdefault.jpg',
  },
  {
    id: 'demo5',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    youtubeId: 'b1kbLwvqugk',
    thumbnail: 'https://i.ytimg.com/vi/b1kbLwvqugk/mqdefault.jpg',
  },
  {
    id: 'demo6',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    youtubeId: 'kTJczUoc26U',
    thumbnail: 'https://i.ytimg.com/vi/kTJczUoc26U/mqdefault.jpg',
  },
  {
    id: 'demo7',
    title: 'Peaches',
    artist: 'Justin Bieber',
    youtubeId: 'tQ0yjYUFKAE',
    thumbnail: 'https://i.ytimg.com/vi/tQ0yjYUFKAE/mqdefault.jpg',
  },
  {
    id: 'demo8',
    title: 'Bad Habit',
    artist: 'Steve Lacy',
    youtubeId: 'VF-r7MoFCgk',
    thumbnail: 'https://i.ytimg.com/vi/VF-r7MoFCgk/mqdefault.jpg',
  },
];

const TRENDING_QUERIES = ['top hits 2024', 'viral music 2024', 'pop hits', 'music official'];

export function useYouTubeSearch() {
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = useSettingsStore((s) => s.youtubeApiKey);

  const convertToSong = (item: YouTubeSearchResult): Song => ({
    id: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    youtubeId: item.id.videoId,
    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.high?.url,
  });

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    // Without API key, filter demo songs
    if (!apiKey) {
      const filtered = DEMO_SONGS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.artist.toLowerCase().includes(query.toLowerCase())
      );
      setTimeout(() => {
        setResults(filtered.length ? filtered : DEMO_SONGS);
        setIsLoading(false);
      }, 600);
      return;
    }

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(
        query + ' music official'
      )}&type=video&videoCategoryId=10&key=${apiKey}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();

      const songs = (data.items || []).map(convertToSong);
      setResults(songs);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      setResults(DEMO_SONGS);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const getTrending = useCallback(async () => {
    if (!apiKey) {
      setResults(DEMO_SONGS);
      return;
    }

    setIsLoading(true);
    try {
      const query = TRENDING_QUERIES[Math.floor(Math.random() * TRENDING_QUERIES.length)];
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(
        query
      )}&type=video&videoCategoryId=10&order=viewCount&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();
      const songs = (data.items || []).map(convertToSong);
      setResults(songs.length ? songs : DEMO_SONGS);
    } catch {
      setResults(DEMO_SONGS);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return { results, isLoading, error, search, getTrending, demoSongs: DEMO_SONGS };
}
