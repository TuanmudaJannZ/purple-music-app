export const translations = {
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    library: 'Library',
    settings: 'Settings',

    // Player
    nowPlaying: 'Now Playing',
    play: 'Play',
    pause: 'Pause',
    next: 'Next',
    previous: 'Previous',
    shuffle: 'Shuffle',
    repeat: 'Repeat',
    volume: 'Volume',
    lyrics: 'Lyrics',
    addToQueue: 'Add to Queue',
    download: 'Download',
    share: 'Share',
    like: 'Like',
    unlike: 'Unlike',

    // Search
    searchPlaceholder: 'Search songs, artists...',
    searchResults: 'Search Results',
    noResults: 'No results found',
    searching: 'Searching...',

    // Library
    likedSongs: 'Liked Songs',
    recentlyPlayed: 'Recently Played',
    playlists: 'Playlists',
    createPlaylist: 'Create Playlist',
    newPlaylist: 'New Playlist',
    playlistName: 'Playlist name',
    offlineMusic: 'Offline Music',
    noLikedSongs: 'No liked songs yet',
    noRecentSongs: 'Nothing played yet',
    noPlaylists: 'No playlists yet',

    // Settings
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    purpleIntensity: 'Purple Intensity',
    animations: 'Animations',
    language: 'Language',
    audioQuality: 'Audio Quality',
    lowQuality: 'Low (Save Data)',
    highQuality: 'High Quality',
    apiKey: 'YouTube API Key',
    apiKeyPlaceholder: 'Enter your YouTube Data API v3 key',
    saveSettings: 'Save Settings',

    // Home
    trending: 'Trending Now',
    featured: 'Featured',
    newReleases: 'New Releases',
    welcomeBack: 'Welcome Back',

    // Greeting
    greeting: 'Welcome to Ultimate Purple Music',

    // General
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    songs: 'songs',
    minutes: 'minutes',
    linkCopied: 'Link copied!',
    addedToQueue: 'Added to queue',
    savedOffline: 'Saved for offline',
    downloading: 'Downloading...',
  },
  id: {
    // Navigation
    home: 'Beranda',
    search: 'Cari',
    library: 'Perpustakaan',
    settings: 'Pengaturan',

    // Player
    nowPlaying: 'Sedang Diputar',
    play: 'Putar',
    pause: 'Jeda',
    next: 'Berikutnya',
    previous: 'Sebelumnya',
    shuffle: 'Acak',
    repeat: 'Ulangi',
    volume: 'Volume',
    lyrics: 'Lirik',
    addToQueue: 'Tambah ke Antrian',
    download: 'Unduh',
    share: 'Bagikan',
    like: 'Suka',
    unlike: 'Hapus Suka',

    // Search
    searchPlaceholder: 'Cari lagu, artis...',
    searchResults: 'Hasil Pencarian',
    noResults: 'Tidak ada hasil',
    searching: 'Mencari...',

    // Library
    likedSongs: 'Lagu Disukai',
    recentlyPlayed: 'Baru Diputar',
    playlists: 'Playlist',
    createPlaylist: 'Buat Playlist',
    newPlaylist: 'Playlist Baru',
    playlistName: 'Nama playlist',
    offlineMusic: 'Musik Offline',
    noLikedSongs: 'Belum ada lagu yang disukai',
    noRecentSongs: 'Belum ada yang diputar',
    noPlaylists: 'Belum ada playlist',

    // Settings
    appearance: 'Tampilan',
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    purpleIntensity: 'Intensitas Ungu',
    animations: 'Animasi',
    language: 'Bahasa',
    audioQuality: 'Kualitas Audio',
    lowQuality: 'Rendah (Hemat Data)',
    highQuality: 'Kualitas Tinggi',
    apiKey: 'YouTube API Key',
    apiKeyPlaceholder: 'Masukkan YouTube Data API v3 key Anda',
    saveSettings: 'Simpan Pengaturan',

    // Home
    trending: 'Trending Sekarang',
    featured: 'Unggulan',
    newReleases: 'Rilis Terbaru',
    welcomeBack: 'Selamat Datang Kembali',

    // Greeting
    greeting: 'Selamat Datang di Ultimate Purple Music',

    // General
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    retry: 'Coba Lagi',
    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    confirm: 'Konfirmasi',
    songs: 'lagu',
    minutes: 'menit',
    linkCopied: 'Tautan disalin!',
    addedToQueue: 'Ditambahkan ke antrian',
    savedOffline: 'Disimpan untuk offline',
    downloading: 'Mengunduh...',
  },
};

export type TranslationKey = keyof typeof translations.en;
