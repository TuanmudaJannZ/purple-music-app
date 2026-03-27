# 🎵 Ultimate Purple Music Web-App

A premium Progressive Web App music player with Royal Purple Glassmorphism aesthetic.

## ✨ Features

- 🎨 **Royal Purple Glassmorphism UI** — blur panels, glowing gradients, smooth Framer Motion animations
- 🎵 **YouTube Music Engine** — search and play music via YouTube Data API v3
- 📱 **Fully Responsive** — Mobile, Tablet, Desktop
- 🔊 **Web Audio API** — Bass/Mid/Treble Equalizer, volume normalization
- 📴 **Offline Mode** — Service Worker + IndexedDB caching
- 🔒 **Lock Screen Controls** — Media Session API for background play
- 📝 **Synced Lyrics** — LRC format with real-time sync
- 🌐 **Bilingual** — Indonesian & English (i18n)
- ⚙️ **Settings** — Dark/Light theme, Purple intensity, Audio quality
- 🔗 **Shareable Links** — `/song/[youtubeId]` with Open Graph metadata
- 📦 **PWA Installable** — Android & Desktop installable

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production
```bash
npm run build
npm start
```

## 🔑 YouTube API Key (Optional)

The app works with **demo songs** out of the box. To enable live YouTube search:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **YouTube Data API v3**
3. Create an API key (restrict to your domain for security)
4. In the app: **Settings → YouTube API Key** → paste your key

## 📁 Project Structure

```
purple-music-app/
├── pages/
│   ├── _app.tsx          # App wrapper, Head meta
│   ├── _document.tsx     # HTML document, fonts
│   ├── index.tsx         # Home — trending songs
│   ├── search.tsx        # Search with categories
│   ├── library.tsx       # Liked, Recent, Playlists
│   ├── settings.tsx      # All settings + EQ
│   └── song/[id].tsx     # Shareable song page
├── components/
│   ├── Layout.tsx        # App shell with sidebar
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── MiniPlayer.tsx    # Bottom player + fullscreen
│   ├── SongCard.tsx      # Song card (grid + row)
│   ├── GreetingModal.tsx # Welcome screen with voice
│   └── Equalizer.tsx     # EQ UI component
├── hooks/
│   ├── useYouTubeSearch.ts  # YouTube API + demo songs
│   ├── useAudioEngine.ts    # Web Audio API + Media Session
│   ├── useLyrics.ts         # LRC parser + sync
│   └── useTranslation.ts    # i18n hook
├── store/
│   ├── musicStore.ts     # Zustand state (player, settings, library)
│   └── translations.ts   # EN + ID translations
├── styles/
│   └── globals.css       # Tailwind + custom CSS
└── public/
    ├── manifest.json     # PWA manifest
    └── icons/            # App icons
```

## 🎧 Adding Songs with Lyrics

Songs use this JSON structure:

```json
{
  "id": "unique-id",
  "title": "Song Title",
  "artist": "Artist Name",
  "youtubeId": "YouTube video ID",
  "thumbnail": "https://i.ytimg.com/vi/VIDEO_ID/mqdefault.jpg",
  "lyrics": "[00:00.00] First line\n[00:05.00] Second line\n..."
}
```

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | React framework + routing |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| Zustand | State management |
| next-pwa | PWA / Service Worker |
| Web Audio API | Equalizer + audio processing |
| Media Session API | Lock screen controls |
| YouTube Data API v3 | Music search |

## 🌐 PWA Installation

On Android: tap "Add to Home Screen" in Chrome menu
On Desktop: click the install icon in the address bar

## 📄 License

MIT
