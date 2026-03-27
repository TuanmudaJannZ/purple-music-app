import React, { useEffect } from 'react';
import { useSettingsStore } from '../store/musicStore';
import Sidebar from './Sidebar';
import MiniPlayer from './MiniPlayer';
import GreetingModal from './GreetingModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme, purpleIntensity } = useSettingsStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--purple-intensity', purpleIntensity.toString());
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  }, [theme, purpleIntensity]);

  return (
    <div className={`min-h-screen animated-bg ${theme === 'light' ? 'theme-light' : ''}`}>
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(168,85,247,${0.6 * purpleIntensity}), transparent)`,
            top: '-10%',
            left: '-5%',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(124,58,237,${0.5 * purpleIntensity}), transparent)`,
            bottom: '10%',
            right: '-5%',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(192,132,252,${0.4 * purpleIntensity}), transparent)`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'float 12s ease-in-out infinite',
          }}
        />
      </div>

      {/* App layout */}
      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-28">
          {children}
        </main>
      </div>

      {/* Persistent mini player at bottom */}
      <MiniPlayer />

      {/* Greeting modal */}
      <GreetingModal />
    </div>
  );
}
